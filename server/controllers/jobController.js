const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Create job listing
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res, next) => {
  try {
    const { 
      title, description, responsibilities, requirements, benefits, 
      company, location, jobType, workMode, salaryMin, salaryMax, 
      experience, skills, vacancies, deadline 
    } = req.body;

    if (!title || !description || !location || !jobType || !workMode) {
      return next(new ApiError(400, 'Please provide all required fields (title, description, location, jobType, workMode)'));
    }

    let companyId = company;
    if (!companyId) {
      const userCompany = await Company.findOne({ recruiter: req.user._id });
      if (!userCompany) {
        return next(new ApiError(400, 'Please create a company profile first before posting a job'));
      }
      companyId = userCompany._id;
    }

    const job = await Job.create({
      title,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n') : []),
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n') : []),
      benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split('\n') : []),
      company: companyId,
      recruiter: req.user._id,
      location,
      jobType,
      workMode,
      salaryMin: salaryMin || 0,
      salaryMax: salaryMax || 0,
      experience: experience || 'Fresher',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      vacancies: vacancies || 1,
      deadline: deadline || null
    });

    res.status(201).json(new ApiResponse(201, job, 'Job created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs with search, filtering, pagination & sorting
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const { 
      search, location, jobType, workMode, experience, 
      minSalary, maxSalary, sort, page = 1, limit = 10 
    } = req.query;

    const query = { status: 'Active' };

    // Search query by title, description, skills, location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      const types = Array.isArray(jobType) ? jobType : jobType.split(',');
      query.jobType = { $in: types };
    }

    if (workMode) {
      const modes = Array.isArray(workMode) ? workMode : workMode.split(',');
      query.workMode = { $in: modes };
    }

    if (experience) {
      query.experience = { $regex: experience, $options: 'i' };
    }

    if (minSalary || maxSalary) {
      query.salaryMax = { $gte: Number(minSalary) || 0 };
      if (maxSalary) {
        query.salaryMin = { $lte: Number(maxSalary) };
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'salary-high') {
      sortOptions = { salaryMax: -1 };
    } else if (sort === 'salary-low') {
      sortOptions = { salaryMin: 1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo website industry location')
      .populate('recruiter', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalJobs / limitNum);

    res.status(200).json(
      new ApiResponse(200, {
        jobs,
        pagination: {
          totalJobs,
          totalPages,
          currentPage: pageNum,
          limit: limitNum
        }
      }, 'Jobs fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo description website industry location size')
      .populate('recruiter', 'name email phone');

    if (!job) {
      return next(new ApiError(404, 'Job not found'));
    }

    // Also count total applications for this job
    const applicantCount = await Application.countDocuments({ job: job._id });

    res.status(200).json(
      new ApiResponse(200, { ...job.toObject(), applicantCount }, 'Job retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update job listing
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ApiError(404, 'Job not found'));
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to update this job listing'));
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('company');

    res.status(200).json(new ApiResponse(200, job, 'Job updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new ApiError(404, 'Job not found'));
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to delete this job listing'));
    }

    await job.deleteOne();
    // Clean up applications for this job
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json(new ApiResponse(200, null, 'Job deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by current recruiter
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    // Attach applicant count to each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (j) => {
        const applicantCount = await Application.countDocuments({ job: j._id });
        return { ...j.toObject(), applicantCount };
      })
    );

    res.status(200).json(new ApiResponse(200, jobsWithCounts, 'Recruiter jobs retrieved'));
  } catch (error) {
    next(error);
  }
};

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob, getRecruiterJobs };

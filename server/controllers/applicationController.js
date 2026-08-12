const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ApiError(404, 'Job not found'));
    }

    if (job.status !== 'Active') {
      return next(new ApiError(400, 'This job listing is no longer active'));
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return next(new ApiError(400, 'You have already applied for this job'));
    }

    // Determine resume to use (passed in body or user profile resume)
    let resume = resumeUrl || req.user.resume;
    if (!resume && req.file) {
      resume = `/uploads/${req.file.filename}`;
    }

    if (!resume) {
      return next(new ApiError(400, 'Please upload or attach a resume before applying'));
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      recruiter: job.recruiter,
      resume,
      coverLetter: coverLetter || '',
      status: 'Applied'
    });

    // Send notification to recruiter
    await createNotification({
      userId: job.recruiter,
      title: 'New Job Application Received',
      message: `${req.user.name} applied for "${job.title}"`,
      type: 'job_alert'
    });

    res.status(201).json(new ApiResponse(201, application, 'Application submitted successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get job seeker's applications
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, applications, 'My applications retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job (Recruiter ATS)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter/Admin)
const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, search } = req.query;

    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ApiError(404, 'Job not found'));
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to view applicants for this job'));
    }

    const query = { job: jobId };
    if (status) {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate('applicant', 'name email phone profileImage skills location education experience resume bio')
      .populate('job', 'title location')
      .sort({ createdAt: -1 });

    if (search) {
      applications = applications.filter(app => 
        app.applicant?.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.applicant?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json(new ApiResponse(200, applications, 'Job applicants retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application details
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email phone profileImage skills education experience projects bio resume')
      .populate({
        path: 'job',
        populate: { path: 'company' }
      });

    if (!application) {
      return next(new ApiError(404, 'Application not found'));
    }

    // Check permission
    const isApplicant = application.applicant._id.toString() === req.user._id.toString();
    const isRecruiter = application.recruiter.toString() === req.user._id.toString();

    if (!isApplicant && !isRecruiter && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to view this application'));
    }

    res.status(200).json(new ApiResponse(200, application, 'Application retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Recruiter ATS action)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

    if (!status || !allowedStatuses.includes(status)) {
      return next(new ApiError(400, `Invalid status. Allowed: ${allowedStatuses.join(', ')}`));
    }

    const application = await Application.findById(req.params.id).populate('job', 'title');
    if (!application) {
      return next(new ApiError(404, 'Application not found'));
    }

    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to update status of this application'));
    }

    application.status = status;
    await application.save();

    // Create notification for applicant!
    await createNotification({
      userId: application.applicant,
      title: 'Application Status Update',
      message: `Your application for "${application.job.title}" has been updated to "${status}".`,
      type: 'application_status'
    });

    res.status(200).json(new ApiResponse(200, application, 'Application status updated successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  getApplicationById,
  updateApplicationStatus
};

const Company = require('../models/Company');
const Job = require('../models/Job');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Create company profile
// @route   POST /api/companies
// @access  Private (Recruiter)
const createCompany = async (req, res, next) => {
  try {
    const { name, logo, description, website, industry, location, size } = req.body;

    if (!name) {
      return next(new ApiError(400, 'Company name is required'));
    }

    const existingCompany = await Company.findOne({ recruiter: req.user._id });
    if (existingCompany) {
      return next(new ApiError(400, 'You have already created a company profile. Update existing company instead.'));
    }

    const company = await Company.create({
      name,
      logo,
      description,
      website,
      industry,
      location,
      size,
      recruiter: req.user._id
    });

    res.status(201).json(new ApiResponse(201, company, 'Company profile created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate('recruiter', 'name email');
    res.status(200).json(new ApiResponse(200, companies, 'Companies retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company details with active jobs
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate('recruiter', 'name email phone');
    if (!company) {
      return next(new ApiError(404, 'Company not found'));
    }

    const activeJobs = await Job.find({ company: company._id, status: 'Active' });

    res.status(200).json(new ApiResponse(200, { company, jobs: activeJobs }, 'Company details retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private (Recruiter)
const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return next(new ApiError(404, 'Company not found'));
    }

    // Check ownership or admin
    if (company.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to update this company profile'));
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(new ApiResponse(200, company, 'Company updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company profile
// @route   DELETE /api/companies/:id
// @access  Private (Recruiter / Admin)
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return next(new ApiError(404, 'Company not found'));
    }

    if (company.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized to delete this company'));
    }

    await company.deleteOne();
    res.status(200).json(new ApiResponse(200, null, 'Company deleted successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany };

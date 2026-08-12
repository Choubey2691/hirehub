const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Save a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private (Job Seeker)
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ApiError(404, 'Job not found'));
    }

    const existing = await SavedJob.findOne({ user: req.user._id, job: jobId });
    if (existing) {
      return next(new ApiError(400, 'Job is already saved in your bookmarks'));
    }

    const savedJob = await SavedJob.create({
      user: req.user._id,
      job: jobId
    });

    res.status(201).json(new ApiResponse(201, savedJob, 'Job saved to your bookmarks'));
  } catch (error) {
    next(error);
  }
};

// @desc    Unsave a job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Job Seeker)
const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOneAndDelete({
      user: req.user._id,
      job: jobId
    });

    if (!savedJob) {
      return next(new ApiError(404, 'Saved job not found'));
    }

    res.status(200).json(new ApiResponse(200, null, 'Job removed from saved jobs'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved jobs for current user
// @route   GET /api/saved-jobs
// @access  Private (Job Seeker)
const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, savedJobs, 'Saved jobs retrieved'));
  } catch (error) {
    next(error);
  }
};

module.exports = { saveJob, unsaveJob, getSavedJobs };

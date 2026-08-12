const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get platform statistics for admin dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSeekers = await User.countDocuments({ role: 'jobseeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalCompanies = await Company.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();

    // Application status aggregation
    const statusCounts = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const formattedStatusCounts = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Interview: 0,
      Selected: 0,
      Rejected: 0
    };

    statusCounts.forEach(item => {
      if (item._id) formattedStatusCounts[item._id] = item.count;
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          totalUsers,
          totalSeekers,
          totalRecruiters,
          totalCompanies,
          totalJobs,
          activeJobs,
          totalApplications,
          statusBreakdown: formattedStatusCounts
        },
        'Platform stats retrieved'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, users, 'Users retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user block status
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin)
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    if (user.role === 'admin') {
      return next(new ApiError(400, 'Cannot block an admin user'));
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json(
      new ApiResponse(
        200,
        user,
        `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    if (user.role === 'admin') {
      return next(new ApiError(400, 'Cannot delete an admin user'));
    }

    await user.deleteOne();
    res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies for admin
// @route   GET /api/admin/companies
// @access  Private (Admin)
const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate('recruiter', 'name email').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, companies, 'Companies retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for admin
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate('company', 'name logo').populate('recruiter', 'name email').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, jobs, 'Jobs retrieved'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllCompanies,
  getAllJobs
};

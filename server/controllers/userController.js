const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(new ApiResponse(200, user, 'Profile retrieved'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, bio, skills, education, experience, projects, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return next(new ApiError(404, 'User not found'));

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (education !== undefined) user.education = education;
    if (experience !== undefined) user.experience = experience;
    if (projects !== undefined) user.projects = projects;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();
    res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume PDF
// @route   POST /api/users/resume
// @access  Private
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, 'Please upload a PDF file'));
    }

    const resumeUrl = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    user.resume = resumeUrl;
    await user.save();

    res.status(200).json(new ApiResponse(200, { resume: resumeUrl }, 'Resume uploaded successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/users/password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(new ApiError(400, 'Please provide both current and new password'));
    }

    if (newPassword.length < 6) {
      return next(new ApiError(400, 'New password must be at least 6 characters'));
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return next(new ApiError(400, 'Current password is incorrect'));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json(new ApiResponse(200, null, 'Password updated successfully'));
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, uploadResume, updatePassword };

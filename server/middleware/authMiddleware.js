const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized to access this route'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hirehub_secret_key_default');
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError(401, 'User associated with token no longer exists'));
    }

    if (user.isBlocked) {
      return next(new ApiError(403, 'Your account has been suspended. Please contact support.'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Token verification failed or token expired'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `User role '${req.user ? req.user.role : 'guest'}' is not authorized to perform this action`)
      );
    }
    next();
  };
};

module.exports = { protect, authorize };

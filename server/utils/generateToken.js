const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'hirehub_secret_key_default',
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;

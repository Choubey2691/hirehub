const express = require('express');
const {
  getPlatformStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllCompanies,
  getAllJobs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.get('/companies', getAllCompanies);
router.get('/jobs', getAllJobs);

module.exports = router;

const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  getApplicationById,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.post('/:jobId', authorize('jobseeker'), upload.single('resume'), applyForJob);
router.get('/my-applications', authorize('jobseeker'), getMyApplications);
router.get('/job/:jobId', authorize('recruiter', 'admin'), getJobApplicants);
router.get('/:id', getApplicationById);
router.put('/:id/status', authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;

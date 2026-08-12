const express = require('express');
const { saveJob, unsaveJob, getSavedJobs } = require('../controllers/savedJobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('jobseeker'));

router.get('/', getSavedJobs);
router.post('/:jobId', saveJob);
router.delete('/:jobId', unsaveJob);

module.exports = router;

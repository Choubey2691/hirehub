const express = require('express');
const { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

router.post('/', protect, authorize('recruiter', 'admin'), createCompany);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateCompany);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteCompany);

module.exports = router;

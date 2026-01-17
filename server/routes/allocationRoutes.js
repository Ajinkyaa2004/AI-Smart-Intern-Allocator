const express = require('express');
const router = express.Router();
const { runAllocation, getResults } = require('../controllers/allocationController');
const { reportDropout } = require('../controllers/dropoutController');
const { generateAllocationReport } = require('../controllers/reportsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only ADMIN can trigger the allocation engine
router.post('/run', protect, authorize('ADMIN'), runAllocation);

// View results of a batch
router.get('/results/:batchId', protect, authorize('ADMIN'), getResults);

// Export Report (CSV)
router.get('/export', protect, authorize('ADMIN'), generateAllocationReport);

// Report a dropout (Can be triggered by Admin, Org, or Student potentially - restricting to Admin/Org for now)
router.post('/dropout', protect, authorize('ADMIN', 'ORG'), reportDropout);

module.exports = router;

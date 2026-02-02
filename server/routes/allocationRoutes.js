const express = require('express');
const router = express.Router();
const { runAllocation, getResults } = require('../controllers/allocationController');
const { reportDropout } = require('../controllers/dropoutController');
const { generateAllocationReport } = require('../controllers/reportsController');
const { protect, authorize } = require('../middleware/authMiddleware');
const Allocation = require('../models/Allocation');
const Student = require('../models/Student');
const notificationService = require('../services/notificationService');
const reallocationService = require('../services/reallocationService');

// Only ADMIN can trigger the allocation engine
router.post('/run', protect, authorize('ADMIN'), runAllocation);

// View results of a batch
router.get('/results/:batchId', protect, authorize('ADMIN'), getResults);

// Export Report (CSV)
router.get('/export', protect, authorize('ADMIN'), generateAllocationReport);

// Report a dropout (Can be triggered by Admin, Org, or Student potentially - restricting to Admin/Org for now)
router.post('/dropout', protect, authorize('ADMIN', 'ORG'), reportDropout);

// Get allocations for a specific student
router.get('/student/:studentId', protect, async (req, res) => {
    try {
        const allocations = await Allocation.find({ 
            student: req.params.studentId 
        })
        .populate('internship')
        .populate({
            path: 'internship',
            populate: { path: 'org' }
        })
        .sort({ createdAt: -1 });

        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Accept an allocation
router.put('/:allocationId/accept', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const allocation = await Allocation.findById(req.params.allocationId)
            .populate('internship');
        
        if (!allocation) {
            return res.status(404).json({ message: 'Allocation not found' });
        }

        allocation.status = 'ACCEPTED';
        await allocation.save();

        // Update student status
        await Student.findByIdAndUpdate(allocation.student, {
            allocationStatus: 'ACCEPTED'
        });

        // Send notification to organization
        await notificationService.notifyAllocationAccepted(
            allocation.internship.org,
            allocation.student,
            allocation.internship.title
        );

        res.json({ message: 'Allocation accepted successfully', allocation });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Reject an allocation (triggers multi-round reallocation)
router.put('/:allocationId/reject', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const allocation = await Allocation.findById(req.params.allocationId)
            .populate('internship');
        
        if (!allocation) {
            return res.status(404).json({ message: 'Allocation not found' });
        }

        const { reason } = req.body;

        // Update allocation status
        allocation.status = 'REJECTED';
        allocation.rejectionReason = reason || 'Not specified';
        await allocation.save();

        // Update student status back to PENDING for reallocation
        await Student.findByIdAndUpdate(allocation.student, {
            allocationStatus: 'PENDING'
        });

        // Notify organization about rejection
        await notificationService.notifyAllocationRejected(
            allocation.internship.org,
            allocation.student,
            allocation.internship.title
        );

        // Trigger automatic reallocation
        try {
            console.log(`[Multi-Round] Student rejected allocation. Triggering reallocation...`);
            const reallocationResult = await reallocationService.handleDropout(
                req.params.allocationId,
                reason || 'Student rejected allocation',
                'STUDENT'
            );

            res.json({ 
                message: 'Allocation rejected. Searching for alternative matches...', 
                allocation,
                reallocation: reallocationResult 
            });
        } catch (reallocationError) {
            console.error('[Multi-Round] Reallocation failed:', reallocationError.message);
            res.json({ 
                message: 'Allocation rejected. No immediate alternative matches found.', 
                allocation 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

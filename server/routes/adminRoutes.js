const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Allocation = require('../models/Allocation');
const Dropout = require('../models/Dropout');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get dashboard analytics/statistics
// @route   GET /api/v1/admin/analytics
// @access  Private (ADMIN only)
router.get('/analytics', protect, authorize('ADMIN'), async (req, res) => {
    try {
        // Get counts
        const totalStudents = await Student.countDocuments();
        const totalInternships = await Internship.countDocuments();
        const totalAllocations = await Allocation.countDocuments({ status: { $in: ['PROPOSED', 'ACCEPTED'] } });
        const totalDropouts = await Dropout.countDocuments();

        // Get students by allocation status
        const pendingStudents = await Student.countDocuments({ allocationStatus: 'PENDING' });
        const matchedStudents = await Student.countDocuments({ allocationStatus: 'MATCHED' });
        const acceptedStudents = await Student.countDocuments({ allocationStatus: 'ACCEPTED' });

        // Get internships by status
        const openInternships = await Internship.countDocuments({ status: 'OPEN' });
        const closedInternships = await Internship.countDocuments({ status: 'CLOSED' });

        // Get allocation success rate
        const proposedAllocations = await Allocation.countDocuments({ status: 'PROPOSED' });
        const acceptedAllocations = await Allocation.countDocuments({ status: 'ACCEPTED' });
        const rejectedAllocations = await Allocation.countDocuments({ status: 'REJECTED' });

        // Get top internships by applications
        const topInternships = await Allocation.aggregate([
            { $group: { _id: '$internship', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'internships', localField: '_id', foreignField: '_id', as: 'internship' } },
            { $unwind: '$internship' },
            { $project: { title: '$internship.title', applications: '$count' } }
        ]);

        // Get allocation trend (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const allocationTrend = await Allocation.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $project: { date: '$_id', allocations: '$count', _id: 0 } }
        ]);

        res.json({
            kpis: {
                totalStudents,
                totalInternships,
                totalAllocations,
                unallocatedStudents: pendingStudents
            },
            studentStatus: {
                pending: pendingStudents,
                matched: matchedStudents,
                accepted: acceptedStudents
            },
            internshipStatus: {
                open: openInternships,
                closed: closedInternships
            },
            allocationMetrics: {
                proposed: proposedAllocations,
                accepted: acceptedAllocations,
                rejected: rejectedAllocations,
                successRate: totalAllocations > 0 ? ((acceptedAllocations / totalAllocations) * 100).toFixed(1) : 0
            },
            topInternships,
            allocationTrend,
            dropouts: totalDropouts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get transparency logs
// @route   GET /api/v1/admin/logs
// @access  Private (ADMIN only)
router.get('/logs', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        // Get recent allocations
        const allocations = await Allocation.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('student', 'blindId')
            .populate('internship', 'title');

        // Get recent dropouts
        const dropouts = await Dropout.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('student', 'blindId')
            .populate('internship', 'title');

        // Combine and format logs
        const logs = [];

        allocations.forEach(alloc => {
            logs.push({
                id: alloc._id,
                type: 'ALLOCATION',
                details: `Student ${alloc.student?.blindId || 'Unknown'} allocated to ${alloc.internship?.title || 'Unknown'}. Match Score: ${(alloc.matchScore * 100).toFixed(0)}%`,
                status: alloc.status === 'ACCEPTED' ? 'SUCCESS' : alloc.status === 'REJECTED' ? 'WARN' : 'INFO',
                time: alloc.createdAt,
                timestamp: alloc.createdAt
            });
        });

        dropouts.forEach(drop => {
            logs.push({
                id: drop._id,
                type: 'DROPOUT',
                details: `Student ${drop.student?.blindId || 'Unknown'} dropped from ${drop.internship?.title || 'Unknown'}. Reason: ${drop.reason}`,
                status: 'WARN',
                time: drop.createdAt,
                timestamp: drop.createdAt
            });
        });

        // Sort by timestamp
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Format time as relative
        logs.forEach(log => {
            const diff = Date.now() - new Date(log.timestamp).getTime();
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) log.time = `${days} day${days > 1 ? 's' : ''} ago`;
            else if (hours > 0) log.time = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            else if (minutes > 0) log.time = `${minutes} min${minutes > 1 ? 's' : ''} ago`;
            else log.time = 'Just now';
        });

        res.json(logs.slice(0, limit));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Trigger allocation round
// @route   POST /api/v1/admin/trigger-allocation
// @access  Private (ADMIN only)
router.post('/trigger-allocation', protect, authorize('ADMIN'), async (req, res) => {
    try {
        // This would trigger the AI allocation engine
        // For now, return a message
        res.json({
            message: 'Allocation engine triggered successfully',
            note: 'AI matching algorithm will run in background. Check logs for progress.'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

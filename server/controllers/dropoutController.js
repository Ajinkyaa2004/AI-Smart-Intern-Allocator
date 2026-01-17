const reallocationService = require('../services/reallocationService');

/**
 * Handle dropout request
 * POST /api/v1/allocation/dropout
 */
const reportDropout = async (req, res) => {
    const { allocationId, reason } = req.body;
    const userRole = req.user.role; // From authMiddleware

    try {
        const result = await reallocationService.handleDropout(
            allocationId,
            reason,
            userRole // Initiated By
        );

        res.json({
            success: true,
            message: 'Dropout processed successfully',
            data: result
        });
    } catch (error) {
        console.error('Reallocation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    reportDropout
};

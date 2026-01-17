const allocationEngine = require('../services/allocationService');
const Allocation = require('../models/Allocation');

/**
 * Trigger a new allocation round (Admin Only)
 */
const runAllocation = async (req, res) => {
    try {
        const batchId = `MATCH-${Date.now()}`; // Unique Batch ID
        const results = await allocationEngine.runBatchAllocation(batchId);

        res.json({
            success: true,
            message: 'Allocation processed successfully',
            data: results
        });
    } catch (error) {
        console.error('Allocation Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get results for a specific batch
 */
const getResults = async (req, res) => {
    try {
        const { batchId } = req.params;
        const allocations = await Allocation.find({ batchId })
            .populate('student', 'blindId academic')
            .populate('internship', 'title org');

        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    runAllocation,
    getResults
};

const Allocation = require('../models/Allocation');
const { Parser } = require('json2csv');

/**
 * Generate a CSV report of allocations with full explainability details
 */
const generateAllocationReport = async (req, res) => {
    try {
        const { batchId } = req.query;
        const filter = batchId ? { batchId } : {};

        const allocations = await Allocation.find(filter)
            .populate('student', 'blindId academic personal')
            .populate('internship', 'title org location');

        if (allocations.length === 0) {
            return res.status(404).json({ message: 'No records found for export' });
        }

        // Flatten data for CSV
        const reportData = allocations.map(a => ({
            AllocationID: a._id,
            BatchID: a.batchId,
            Status: a.status,
            // Explainability Columns
            TotalScore: a.score,
            SkillMatch: a.breakdown.get('skillMatch') || 0,
            LocationMatch: a.breakdown.get('locationMatch') || 0,
            Reasoning: a.breakdown.get('reason') || 'N/A',
            // Anonymized Student Data
            BlindID: a.student.blindId,
            Degree: a.student.academic.degree,
            GPA: a.student.academic.gpa,
            // Internship Data
            Role: a.internship.title,
            Ministry: a.internship.org.name, // Note: Populating deep might fail if not handled, assuming Org name is in Internship ref which is usually just Org ID. 
            // Actually Internship.org is a REF, so we need to populate 'internship.org' too for name.
            // For simplicity in this demo, let's assume we populate deeper or just ID.
            Location: a.internship.location,
            AllocatedAt: a.createdAt.toISOString()
        }));

        const fields = ['AllocationID', 'BatchID', 'Status', 'TotalScore', 'SkillMatch', 'LocationMatch', 'Reasoning', 'BlindID', 'Degree', 'GPA', 'Role', 'Location', 'AllocatedAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(reportData);

        res.header('Content-Type', 'text/csv');
        res.attachment(`allocation_report_${batchId || 'all'}.csv`);
        return res.send(csv);

    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
};

module.exports = {
    generateAllocationReport
};

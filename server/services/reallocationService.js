const Allocation = require('../models/Allocation');
const Internship = require('../models/Internship');
const Student = require('../models/Student');
const Dropout = require('../models/Dropout');
const allocationEngine = require('./allocationService'); // Reuse scoring logic

class ReallocationService {

    /**
     * Handle a dropout event and trigger immediate reallocation for that slot.
     * @param {String} allocationId - The ID of the allocation being cancelled
     * @param {String} reason - Reason for dropping out
     * @param {String} initiatedBy - 'STUDENT' | 'ORG' | 'SYSTEM'
     */
    async handleDropout(allocationId, reason, initiatedBy) {
        console.log(`[Reallocation] Processing dropout for Allocation ID: ${allocationId}`);

        // 1. Fetch Integration Record
        const oldAllocation = await Allocation.findById(allocationId);
        if (!oldAllocation) throw new Error('Allocation not found');
        if (oldAllocation.status === 'REJECTED') throw new Error('Allocation already rejected');

        const { student: studentId, internship: internshipId } = oldAllocation;

        // 2. Log Dropout
        await Dropout.create({
            student: studentId,
            internship: internshipId,
            allocation: allocationId,
            reason,
            initiatedBy,
            isReallocated: false
        });

        // 3. Update Old Allocation Status
        oldAllocation.status = 'REJECTED';
        await oldAllocation.save();

        // 4. Reset Student Status (so they can be re-allocated in future batches if needed)
        // Note: If student dropped out, maybe we ban them? For now, we set to PENDING.
        await Student.findByIdAndUpdate(studentId, {
            allocationStatus: 'PENDING',
            // availability: false // Optional: Mark unavailable if they rejected the offer
        });

        // 5. Free up Internship Capacity
        const internship = await Internship.findById(internshipId);
        if (!internship) throw new Error('Internship not found');

        if (internship.filledCount > 0) {
            internship.filledCount -= 1;
            await internship.save();
        }

        console.log(`[Reallocation] Capacity freed for ${internship.title}. Searching waitlist...`);

        // 6. Attempt Immediate Reallocation (Waitlist Logic)
        // Find next best candidate who is availalble AND not currently matched
        const bestReplacement = await this.findNextBestCandidate(internship);

        if (bestReplacement) {
            console.log(`[Reallocation] Found replacement: ${bestReplacement.student._id} (Score: ${bestReplacement.score})`);

            // Create New Allocation
            const newAllocation = await Allocation.create({
                batchId: `REALLOC-${Date.now()}`,
                student: bestReplacement.student._id,
                internship: internship._id,
                score: bestReplacement.score,
                breakdown: {
                    ...bestReplacement.breakdown,
                    reason: `Waitlist Replacement. ${bestReplacement.breakdown.reason}`
                },
                status: 'PROPOSED'
            });

            // Update Assets
            await Student.findByIdAndUpdate(bestReplacement.student._id, { allocationStatus: 'MATCHED' });

            internship.filledCount += 1;
            await internship.save();

            return {
                success: true,
                action: 'REPLACED',
                oldAllocationId: allocationId,
                newAllocationId: newAllocation._id,
                replacementStudent: bestReplacement.student._id
            };
        } else {
            console.log('[Reallocation] No suitable replacement found on waitlist.');
            return {
                success: true,
                action: 'OPEN_SLOT',
                message: 'Slot opened but no candidate matched criteria immediately.'
            };
        }
    }

    /**
     * Scans available students to find best fit for a specific internship
     */
    async findNextBestCandidate(internship) {
        // Fetch all available students
        const candidates = await Student.find({
            availability: true,
            allocationStatus: 'PENDING'
        });

        let bestMatch = null;
        let maxScore = -1;

        for (const student of candidates) {
            // Check hard constraints
            if (student.academic.gpa < internship.minGPA) continue;

            const analysis = allocationEngine.calculateScore(student, internship);

            // Optimization: Keep track of highest score
            if (analysis.totalScore > maxScore && analysis.totalScore > 0.3) {
                maxScore = analysis.totalScore;
                bestMatch = {
                    student,
                    score: analysis.totalScore,
                    breakdown: analysis.breakdown
                };
            }
        }

        return bestMatch;
    }
}

module.exports = new ReallocationService();

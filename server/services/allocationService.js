const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Allocation = require('../models/Allocation');

/**
 * Weights for the scoring algorithm
 * Total should strictly sum to 1.0 for explainability.
 */
const WEIGHTS = {
    SKILLS: 0.45,       // Competency (Most important)
    DOMAIN: 0.20,       // Interest/Sector Alignment
    LOCATION: 0.20,     // Logistics
    GPA: 0.15           // Academic Performance
};

class AllocationEngine {

    /**
     * Main entry point to run the allocation batch
     * @param {String} batchId - Unique ID for this execution cycle
     */
    async runBatchAllocation(batchId) {
        console.log(`[Batch: ${batchId}] Starting Allocation Engine...`);

        // 1. Fetch Candidates & Opportunities
        // BLIND LOGIC: We fetch full objects, but the scoring function 
        // strictly only reads allowed fields (skills, gpa, etc.)
        const candidates = await Student.find({
            availability: true,
            allocationStatus: 'PENDING'
        }).populate('user');

        // Populate 'org' to access 'sector' for Domain matching
        const internships = await Internship.find({
            status: 'OPEN'
        }).populate('org');

        console.log(`[Batch: ${batchId}] Found ${candidates.length} candidates and ${internships.length} internships.`);

        // 2. Generate Scoring Matrix (All-to-All)
        let potentialMatches = [];

        for (const student of candidates) {
            for (const internship of internships) {

                // Pre-filter: Check hard constraints (e.g. Min GPA)
                if (student.academic.gpa < internship.minGPA) continue;

                // Calculate Score
                const analysis = this.calculateScore(student, internship);

                if (analysis.totalScore > 0.3) { // Threshold to ignore poor matches
                    potentialMatches.push({
                        studentId: student._id,
                        internshipId: internship._id,
                        score: analysis.totalScore,
                        breakdown: analysis.breakdown,
                        explanation: analysis.explanation, // Pass explanation separately
                        studentInfo: student,       // optimized for memory later
                        internshipInfo: internship
                    });
                }
            }
        }

        // 3. Rank by Merit (Global Sort)
        // "Ranking-based assignment": Highest scores get priority
        potentialMatches.sort((a, b) => b.score - a.score);

        console.log(`[Batch: ${batchId}] Generated ${potentialMatches.length} potential matches. Processing assignments...`);

        // 4. Greedy Assignment (Stable Marriage Approximation)
        const assignments = [];
        const studentAssigned = new Set();
        const vacancyTracker = {};
        const waitlist = []; // Track who missed out for analytics

        // Initialize vacancy counts
        internships.forEach(i => {
            vacancyTracker[i._id] = {
                total: i.vacancies,
                filled: i.filledCount || 0
            };
        });

        for (const match of potentialMatches) {
            const { studentId, internshipId } = match;

            // Rule a: One Student -> One Internship
            if (studentAssigned.has(studentId.toString())) continue;

            // Rule b: Capacity Constraints
            const cap = vacancyTracker[internshipId];
            if (cap.filled >= cap.total) {
                // Determined if valid for specific internship waitlist (optional enhancement)
                continue;
            }

            // Rule c: Reservation/Inclusion Check (Optional hook)
            // if (shouldApplyReservation(match.studentInfo)) { ... }

            // EXECUTE MATCH
            studentAssigned.add(studentId.toString());
            cap.filled++;

            assignments.push({
                batchId,
                student: studentId,
                internship: internshipId,
                score: match.score,
                breakdown: match.breakdown,
                explanation: match.explanation, // Save explanation
                status: 'PROPOSED'
            });
        }

        // Identify Waitlisted Candidates (Available but not assigned)
        candidates.forEach(c => {
            if (!studentAssigned.has(c._id.toString())) {
                waitlist.push(c._id);
            }
        });

        // 5. Persist Results
        if (assignments.length > 0) {
            await Allocation.insertMany(assignments);

            // Update Student Statuses
            const matchedStudentIds = assignments.map(a => a.student);
            await Student.updateMany(
                { _id: { $in: matchedStudentIds } },
                { allocationStatus: 'MATCHED' }
            );

            // Update Internships (Optional: can be done via aggregation later)
            // We don't increment DB 'filledCount' here to allow Admin approval first (PROPOSED state)
            // But if auto-approve, we would.
        }

        console.log(`[Batch: ${batchId}] Allocation Complete. ${assignments.length} matches. ${waitlist.length} waitlisted.`);

        return {
            batchId,
            candidatesProcessed: candidates.length,
            matchesGenerated: assignments.length,
            waitlistedCount: waitlist.length,
            waitlistedIds: waitlist
        };
    }

    /**
     * Core Explainable Scoring Logic
     * IMPT: Implements BLIND RESUME logic by ignoring name/gender/college.
     */
    calculateScore(student, internship) {
        let skillScore = 0;
        let domainScore = 0;
        let locationScore = 0;
        let gpaScore = 0;

        // A. Skill Matching (Vector-like Overlap)
        const required = internship.requiredSkills; // [{ skill: 'Python', weight: 1 }]
        if (required.length > 0) {
            let matchedWeight = 0;
            let totalWeight = 0;

            required.forEach(req => {
                totalWeight += req.weight || 1;
                // Fuzzy find skill in student profile
                const studentSkill = student.skills.find(s =>
                    s.name.toLowerCase().includes(req.skill.toLowerCase())
                );

                if (studentSkill) {
                    // Normalize level (1-5) to 0.2-1.0
                    const mastery = (studentSkill.level || 1) / 5;
                    matchedWeight += (req.weight || 1) * mastery;
                }
            });

            skillScore = totalWeight === 0 ? 0 : (matchedWeight / totalWeight);
        }

        // B. Domain/Sector Matching (Organization Sector vs Student Preferences)
        const orgSector = internship.org?.sector || '';
        if (orgSector && student.preferences.domains) {
            // Case-insensitive check if student prefers this sector
            const hasInterest = student.preferences.domains.some(d =>
                d.toLowerCase() === orgSector.toLowerCase()
            );
            if (hasInterest) domainScore = 1.0;
        }

        // C. Location Matching (Logistics)
        if (student.preferences.locations.includes(internship.location)) {
            locationScore = 1.0; // Perfect match
        } else {
            // Optional: Partial score for same state?
            locationScore = 0;
        }

        // D. GPA Normalization (Merit)
        gpaScore = Math.min((student.academic.gpa || 0) / 10, 1.0);

        // E. Final Weighted Sum
        const finalScore = (
            (skillScore * WEIGHTS.SKILLS) +
            (domainScore * WEIGHTS.DOMAIN) +
            (locationScore * WEIGHTS.LOCATION) +
            (gpaScore * WEIGHTS.GPA)
        );

        return {
            totalScore: parseFloat(finalScore.toFixed(3)),
            breakdown: {
                skillMatch: parseFloat(skillScore.toFixed(2)),
                domainMatch: parseFloat(domainScore.toFixed(2)),
                locationMatch: parseFloat(locationScore.toFixed(2)),
                gpaContribution: parseFloat(gpaScore.toFixed(2))
            },
            explanation: `Skills: ${Math.round(skillScore * 100)}%, Domain: ${domainScore === 1 ? 'Matched' : 'No'}, Loc: ${locationScore === 1 ? 'Yes' : 'No'}`
        };
    }
}

module.exports = new AllocationEngine();

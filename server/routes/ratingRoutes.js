const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Allocation = require('../models/Allocation');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Submit student rating (by organization)
// @route   POST /api/v1/ratings/student/:allocationId
// @access  Private (ORG)
router.post('/student/:allocationId', protect, authorize('ORG'), async (req, res) => {
    try {
        const { allocationId } = req.params;
        const { technicalSkills, communication, professionalism, workEthic, feedback, wouldHireAgain } = req.body;

        const allocation = await Allocation.findById(allocationId).populate('internship');
        if (!allocation) {
            return res.status(404).json({ message: 'Allocation not found' });
        }

        // Calculate overall score
        const overallScore = ((technicalSkills + communication + professionalism + workEthic) / 4).toFixed(1);

        let rating = await Rating.findOne({ allocation: allocationId });
        
        if (!rating) {
            rating = new Rating({
                allocation: allocationId,
                student: allocation.student,
                internship: allocation.internship,
                organization: allocation.internship.org
            });
        }

        rating.studentRating = {
            overallScore: parseFloat(overallScore),
            technicalSkills,
            communication,
            professionalism,
            workEthic,
            orgFeedback: feedback,
            wouldHireAgain,
            ratedByOrg: true,
            orgRatedAt: new Date()
        };

        await rating.save();

        res.json({ message: 'Student rating submitted successfully', rating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Submit internship rating (by student)
// @route   POST /api/v1/ratings/internship/:allocationId
// @access  Private (STUDENT)
router.post('/internship/:allocationId', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const { allocationId } = req.params;
        const { learningExperience, mentorship, workEnvironment, careerGrowth, stipendFairness, feedback, wouldRecommend, matchAccuracy } = req.body;

        const allocation = await Allocation.findById(allocationId).populate('internship');
        if (!allocation) {
            return res.status(404).json({ message: 'Allocation not found' });
        }

        // Calculate overall score
        const overallScore = ((learningExperience + mentorship + workEnvironment + careerGrowth + stipendFairness) / 5).toFixed(1);

        let rating = await Rating.findOne({ allocation: allocationId });
        
        if (!rating) {
            rating = new Rating({
                allocation: allocationId,
                student: allocation.student,
                internship: allocation.internship,
                organization: allocation.internship.org
            });
        }

        rating.internshipRating = {
            overallScore: parseFloat(overallScore),
            learningExperience,
            mentorship,
            workEnvironment,
            careerGrowth,
            stipendFairness,
            studentFeedback: feedback,
            wouldRecommend,
            ratedByStudent: true,
            studentRatedAt: new Date()
        };

        rating.matchAccuracy = matchAccuracy;
        rating.internshipCompleted = true;
        rating.completionDate = new Date();

        await rating.save();

        res.json({ message: 'Internship rating submitted successfully', rating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get ratings for a student
// @route   GET /api/v1/ratings/student/:studentId
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
    try {
        const ratings = await Rating.find({ 
            student: req.params.studentId,
            'studentRating.ratedByOrg': true
        })
        .populate('internship', 'title')
        .populate('organization', 'name')
        .sort({ 'studentRating.orgRatedAt': -1 });

        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get ratings for an internship/organization
// @route   GET /api/v1/ratings/internship/:internshipId
// @access  Private
router.get('/internship/:internshipId', protect, async (req, res) => {
    try {
        const ratings = await Rating.find({ 
            internship: req.params.internshipId,
            'internshipRating.ratedByStudent': true
        })
        .populate('student', 'blindId')
        .sort({ 'internshipRating.studentRatedAt': -1 });

        // Calculate average ratings
        const avgRating = ratings.length > 0 
            ? (ratings.reduce((sum, r) => sum + (r.internshipRating.overallScore || 0), 0) / ratings.length).toFixed(1)
            : 0;

        res.json({ ratings, averageRating: parseFloat(avgRating), totalRatings: ratings.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get pending rating requests for student
// @route   GET /api/v1/ratings/pending/student
// @access  Private (STUDENT)
router.get('/pending/student', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const userId = req.user._id;
        const Student = require('../models/Student');
        const student = await Student.findOne({ user: userId });

        const allocations = await Allocation.find({
            student: student._id,
            status: 'ACCEPTED'
        }).populate('internship');

        const rated = await Rating.find({ student: student._id, 'internshipRating.ratedByStudent': true });
        const ratedAllocationIds = rated.map(r => r.allocation.toString());

        const pending = allocations.filter(a => !ratedAllocationIds.includes(a._id.toString()));

        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get pending ratings for student (internships to rate)
// @route   GET /api/v1/ratings/pending/student
// @access  Private (STUDENT)
router.get('/pending/student', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const allocations = await Allocation.find({
            student: req.user.student,
            status: 'ACCEPTED'
        })
        .populate('internship')
        .populate({
            path: 'internship',
            populate: {
                path: 'organization',
                select: 'name'
            }
        });

        // Get allocations that haven't been rated yet
        const ratedAllocationIds = await Rating.find({
            student: req.user.student,
            'internshipRating.ratedByStudent': true
        }).distinct('allocation');

        const pendingAllocations = allocations.filter(
            a => !ratedAllocationIds.includes(a._id.toString())
        );

        res.json({ allocations: pendingAllocations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get pending ratings for org (students to rate)
// @route   GET /api/v1/ratings/pending/org
// @access  Private (ORG)
router.get('/pending/org', protect, authorize('ORG'), async (req, res) => {
    try {
        const allocations = await Allocation.find({
            'internship.organization': req.user.organization,
            status: 'ACCEPTED'
        })
        .populate('student')
        .populate({
            path: 'student',
            populate: {
                path: 'personal',
                select: 'name email'
            }
        })
        .populate('internship');

        // Get allocations that haven't been rated yet
        const ratedAllocationIds = await Rating.find({
            organization: req.user.organization,
            'studentRating.ratedByOrg': true
        }).distinct('allocation');

        const pendingAllocations = allocations.filter(
            a => !ratedAllocationIds.includes(a._id.toString())
        );

        res.json({ allocations: pendingAllocations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');
const Internship = require('../models/Internship');
const Allocation = require('../models/Allocation');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get organization profile
// @route   GET /api/v1/org/profile
// @access  Private (ORG only)
router.get('/profile', protect, authorize('ORG'), async (req, res) => {
    try {
        const org = await Organization.findOne({ user: req.user._id });

        if (!org) {
            return res.status(404).json({
                message: 'Organization profile not found. Please create your profile.',
                exists: false
            });
        }

        res.json(org);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create or Update organization profile
// @route   POST /api/v1/org/profile
// @access  Private (ORG only)
router.post('/profile', protect, authorize('ORG'), async (req, res) => {
    try {
        const { name, type, sector, locations, contactPerson } = req.body;

        let org = await Organization.findOne({ user: req.user._id });

        if (org) {
            org.name = name;
            org.type = type;
            org.sector = sector;
            org.locations = locations;
            org.contactPerson = contactPerson;

            await org.save();
            res.json({ message: 'Profile updated successfully', org });
        } else {
            org = await Organization.create({
                user: req.user._id,
                name,
                type,
                sector,
                locations,
                contactPerson
            });

            res.status(201).json({ message: 'Profile created successfully', org });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all internship postings for this organization
// @route   GET /api/v1/org/postings
// @access  Private (ORG only)
router.get('/postings', protect, authorize('ORG'), async (req, res) => {
    try {
        const org = await Organization.findOne({ user: req.user._id });

        if (!org) {
            return res.status(404).json({ message: 'Organization profile not found' });
        }

        const postings = await Internship.find({ org: org._id }).sort({ createdAt: -1 });
        res.json(postings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create new internship posting
// @route   POST /api/v1/org/postings
// @access  Private (ORG only)
router.post('/postings', protect, authorize('ORG'), async (req, res) => {
    try {
        const org = await Organization.findOne({ user: req.user._id });

        if (!org) {
            return res.status(404).json({ message: 'Organization profile not found. Please create your profile first.' });
        }

        const { title, description, requiredSkills, minGPA, location, stipend, vacancies } = req.body;

        const internship = await Internship.create({
            org: org._id,
            title,
            description,
            requiredSkills,
            minGPA,
            location,
            stipend,
            vacancies
        });

        res.status(201).json({ message: 'Internship posted successfully', internship });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get allocated candidates for this organization
// @route   GET /api/v1/org/candidates
// @access  Private (ORG only)
router.get('/candidates', protect, authorize('ORG'), async (req, res) => {
    try {
        const org = await Organization.findOne({ user: req.user._id });

        if (!org) {
            return res.status(404).json({ message: 'Organization profile not found' });
        }

        // Get all internships for this org
        const internships = await Internship.find({ org: org._id });
        const internshipIds = internships.map(i => i._id);

        // Get all allocations for these internships
        const allocations = await Allocation.find({
            internship: { $in: internshipIds },
            status: { $in: ['PROPOSED', 'ACCEPTED'] }
        })
            .populate('student')
            .populate('internship')
            .sort({ createdAt: -1 });

        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Report student dropout
// @route   POST /api/v1/org/dropout
// @access  Private (ORG only)
router.post('/dropout', protect, authorize('ORG'), async (req, res) => {
    try {
        const { allocationId, reason } = req.body;

        const allocation = await Allocation.findById(allocationId);

        if (!allocation) {
            return res.status(404).json({ message: 'Allocation not found' });
        }

        // Mark allocation as dropped
        allocation.status = 'DROPPED';
        await allocation.save();

        // Mark student as available again
        await Student.findByIdAndUpdate(allocation.student, {
            availability: true,
            allocationStatus: 'PENDING'
        });

        // Increment vacancy
        await Internship.findByIdAndUpdate(allocation.internship, {
            $inc: { filledCount: -1 }
        });

        res.json({ message: 'Dropout reported successfully. Student marked as available for reallocation.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

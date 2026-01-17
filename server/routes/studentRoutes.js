const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/authMiddleware');

// Generate unique blind ID
function generateBlindId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    id += '-';
    for (let i = 0; i < 4; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// @desc    Get student profile
// @route   GET /api/v1/student/profile
// @access  Private (Student only)
router.get('/profile', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });

        if (!student) {
            return res.status(404).json({
                message: 'Profile not found. Please create your profile.',
                exists: false
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create or Update student profile
// @route   POST /api/v1/student/profile
// @access  Private (Student only)
router.post('/profile', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const {
            personal,
            contacts,
            academic,
            skills,
            preferences
        } = req.body;

        // Check if profile exists
        let student = await Student.findOne({ user: req.user._id });

        if (student) {
            // Update existing profile
            student.personal = personal;
            student.contacts = contacts;
            student.academic = academic;
            student.skills = skills;
            student.preferences = preferences;

            await student.save();

            res.json({
                message: 'Profile updated successfully',
                student
            });
        } else {
            // Create new profile
            student = await Student.create({
                user: req.user._id,
                blindId: generateBlindId(),
                personal,
                contacts,
                academic,
                skills,
                preferences
            });

            res.status(201).json({
                message: 'Profile created successfully',
                student
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

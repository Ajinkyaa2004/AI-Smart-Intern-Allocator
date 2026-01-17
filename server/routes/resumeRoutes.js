const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/authMiddleware');
const { extractSkills, extractEducation, extractExperience } = require('../services/skillExtractor');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/resumes/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter - only PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// @desc    Upload and parse resume
// @route   POST /api/v1/resume/upload
// @access  Private (Student only)
router.post('/upload', protect, authorize('STUDENT'), upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileBuffer = fs.readFileSync(filePath);

        // Parse PDF
        const pdfData = await pdf(fileBuffer);
        const resumeText = pdfData.text;

        // Extract information
        const extractedSkills = extractSkills(resumeText);
        const education = extractEducation(resumeText);
        const experience = extractExperience(resumeText);

        // Get student profile
        let student = await Student.findOne({ user: req.user._id });

        if (!student) {
            return res.status(404).json({
                message: 'Student profile not found. Please create your profile first.'
            });
        }

        // Update student profile with extracted data
        // Merge extracted skills with existing skills (avoid duplicates)
        const existingSkillNames = student.skills.map(s => s.name.toLowerCase());
        const newSkills = extractedSkills.filter(
            skill => !existingSkillNames.includes(skill.name.toLowerCase())
        );

        student.skills = [...student.skills, ...newSkills.map(s => ({
            name: s.name,
            level: s.level,
            isVerified: false
        }))];

        // Update academic info if extracted
        if (education.gpa && !student.academic.gpa) {
            student.academic.gpa = education.gpa;
        }

        // Store resume path
        student.resumePath = `/uploads/resumes/${req.file.filename}`;
        student.resumeUploadedAt = new Date();

        await student.save();

        res.json({
            message: 'Resume uploaded and parsed successfully',
            extractedData: {
                skills: extractedSkills,
                education,
                experience: experience.slice(0, 5), // Limit to 5 entries
                totalSkillsExtracted: extractedSkills.length
            },
            resumeUrl: student.resumePath,
            student
        });

    } catch (error) {
        // Clean up uploaded file if error occurs
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error('Resume upload error:', error);
        res.status(500).json({ message: error.message || 'Failed to process resume' });
    }
});

// @desc    Get resume file
// @route   GET /api/v1/resume/download
// @access  Private (Student only)
router.get('/download', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });

        if (!student || !student.resumePath) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const filePath = path.join(__dirname, '../../', student.resumePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Resume file not found' });
        }

        res.download(filePath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete resume
// @route   DELETE /api/v1/resume/delete
// @access  Private (Student only)
router.delete('/delete', protect, authorize('STUDENT'), async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user._id });

        if (!student || !student.resumePath) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const filePath = path.join(__dirname, '../../', student.resumePath);

        // Delete file if exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from database
        student.resumePath = undefined;
        student.resumeUploadedAt = undefined;
        await student.save();

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

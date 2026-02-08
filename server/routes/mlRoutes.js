const express = require('express');
const router = express.Router();
const mlService = require('../services/mlService');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/ml/train
 * @desc    Train ML model with historical data
 * @access  Admin only
 */
router.post('/train', protect, authorize('ADMIN'), async (req, res) => {
    try {
        console.log('[ML API] Training request received from admin');

        const result = await mlService.trainModel();

        res.json({
            success: true,
            message: 'Model trained successfully',
            metrics: result.metrics
        });
    } catch (error) {
        console.error('[ML API] Training error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to train model',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/ml/predict
 * @desc    Get ML predictions for student-internship pairs
 * @access  Admin only
 */
router.post('/predict', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const { pairs, includeConfidence } = req.body;

        if (!pairs || !Array.isArray(pairs)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input: pairs array required'
            });
        }

        const predictions = await mlService.predict(pairs, includeConfidence);

        res.json({
            success: true,
            predictions
        });
    } catch (error) {
        console.error('[ML API] Prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate predictions',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/ml/status
 * @desc    Get ML model status
 * @access  Admin only
 */
router.get('/status', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const status = mlService.getStatus();

        res.json({
            success: true,
            ...status
        });
    } catch (error) {
        console.error('[ML API] Status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get model status',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/ml/predict-single
 * @desc    Get ML prediction for a single student-internship pair
 * @access  Admin only
 */
router.post('/predict-single', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const { studentId, internshipId, includeConfidence } = req.body;

        if (!studentId || !internshipId) {
            return res.status(400).json({
                success: false,
                message: 'studentId and internshipId required'
            });
        }

        // Fetch student and internship
        const Student = require('../models/Student');
        const Internship = require('../models/Internship');

        const student = await Student.findById(studentId);
        const internship = await Internship.findById(internshipId).populate('org');

        if (!student || !internship) {
            return res.status(404).json({
                success: false,
                message: 'Student or Internship not found'
            });
        }

        const prediction = await mlService.predictSingle(student, internship, includeConfidence);

        res.json({
            success: true,
            prediction
        });
    } catch (error) {
        console.error('[ML API] Single prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate prediction',
            error: error.message
        });
    }
});

module.exports = router;

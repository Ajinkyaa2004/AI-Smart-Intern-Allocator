const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const chatbotService = require('../services/chatbotService');

/**
 * @route   POST /api/v1/chatbot/ask
 * @desc    Send message to chatbot
 * @access  Private
 */
router.post('/ask', protect, async (req, res) => {
    try {
        const { message, sessionHistory } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }
        
        if (message.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Message too long (max 500 characters)'
            });
        }
        
        const result = await chatbotService.processMessage(
            req.user._id,
            req.user.role,
            message,
            sessionHistory || []
        );
        
        res.json(result);
        
    } catch (error) {
        console.error('Chatbot API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process message',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/v1/chatbot/faq
 * @desc    Get FAQ list
 * @access  Public
 */
router.get('/faq', async (req, res) => {
    try {
        const { category } = req.query;
        
        const faqs = chatbotService.getFAQList(category);
        
        res.json({
            success: true,
            count: faqs.length,
            faqs
        });
        
    } catch (error) {
        console.error('FAQ API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch FAQs',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/v1/chatbot/suggestions
 * @desc    Get contextual suggestions based on user role
 * @access  Private
 */
router.get('/suggestions', protect, (req, res) => {
    try {
        const suggestions = chatbotService.getSuggestions('general', req.user.role);
        
        res.json({
            success: true,
            suggestions
        });
        
    } catch (error) {
        console.error('Suggestions API error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch suggestions',
            error: error.message
        });
    }
});

module.exports = router;

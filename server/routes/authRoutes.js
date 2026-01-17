const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);

// Example protected route for testing
router.get('/me', protect, (req, res) => {
    res.json(req.user);
});

// Example admin-only route
router.get('/admin-only', protect, authorize('ADMIN'), (req, res) => {
    res.json({ message: 'Welcome Admin' });
});

module.exports = router;

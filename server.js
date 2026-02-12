const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express();

    // MongoDB Connection
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/next-express-app';

    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => {
            console.error('MongoDB connection error:', err);
        });

    // Middleware
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // API Routes
    server.use('/api/v1/auth', require('./server/routes/authRoutes'));
    server.use('/api/v1/allocation', require('./server/routes/allocationRoutes'));
    server.use('/api/v1/student', require('./server/routes/studentRoutes'));
    server.use('/api/v1/org', require('./server/routes/orgRoutes'));
    server.use('/api/v1/admin', require('./server/routes/adminRoutes'));
    server.use('/api/v1/resume', require('./server/routes/resumeRoutes'));
    server.use('/api/v1/ratings', require('./server/routes/ratingRoutes'));
    server.use('/api/v1/notifications', require('./server/routes/notificationRoutes'));
    server.use('/api/v1/ml', require('./server/routes/mlRoutes'));
    server.use('/api/v1/chatbot', require('./server/routes/chatbotRoutes'));

    // Custom API Routes (Express)
    server.get('/api/health', (req, res) => {
        res.json({ status: 'ok', message: 'Express server is running' });
    });

    // Next.js Request Handler
    server.all(/.*/, (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});

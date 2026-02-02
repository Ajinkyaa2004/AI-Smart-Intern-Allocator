const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    recipientRole: {
        type: String,
        enum: ['STUDENT', 'ORG', 'ADMIN'],
        required: true
    },
    type: {
        type: String,
        enum: [
            'ALLOCATION_PROPOSED',
            'ALLOCATION_ACCEPTED',
            'ALLOCATION_REJECTED',
            'INTERVIEW_SCHEDULED',
            'RATING_REQUEST',
            'PROFILE_INCOMPLETE',
            'NEW_INTERNSHIP',
            'SYSTEM_ALERT'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String // URL to redirect when notification is clicked
    },
    data: {
        type: mongoose.Schema.Types.Mixed // Additional data (allocation ID, etc.)
    },
    read: {
        type: Boolean,
        default: false,
        index: true
    },
    readAt: Date,
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM'
    }
}, { timestamps: true });

// Compound index for efficient unread notifications query
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

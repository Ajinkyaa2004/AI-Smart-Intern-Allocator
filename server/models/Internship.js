const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    title: {
        type: String,
        required: true,
        index: 'text'
    },
    description: {
        type: String,
        required: true
    },
    requiredSkills: [{
        skill: { type: String, required: true },
        weight: { type: Number, default: 1 } // For weighted matching
    }],
    minGPA: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true
    },
    stipend: {
        type: Number,
        required: true
    },
    vacancies: {
        type: Number,
        required: true,
        min: 1
    },
    filledCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED', 'In-Progress'],
        default: 'OPEN',
        index: true
    }
}, { timestamps: true });

// Index for skill matching performance
internshipSchema.index({ 'requiredSkills.skill': 1 });

module.exports = mongoose.model('Internship', internshipSchema);

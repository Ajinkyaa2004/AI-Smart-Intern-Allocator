const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    // Reference to the allocation this rating is for
    allocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Allocation',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    
    // Student Rating (by Organization)
    studentRating: {
        overallScore: {
            type: Number,
            min: 1,
            max: 5,
            required: false
        },
        technicalSkills: {
            type: Number,
            min: 1,
            max: 5
        },
        communication: {
            type: Number,
            min: 1,
            max: 5
        },
        professionalism: {
            type: Number,
            min: 1,
            max: 5
        },
        workEthic: {
            type: Number,
            min: 1,
            max: 5
        },
        orgFeedback: {
            type: String,
            maxlength: 1000
        },
        wouldHireAgain: {
            type: Boolean
        },
        ratedByOrg: {
            type: Boolean,
            default: false
        },
        orgRatedAt: Date
    },
    
    // Internship Rating (by Student)
    internshipRating: {
        overallScore: {
            type: Number,
            min: 1,
            max: 5,
            required: false
        },
        learningExperience: {
            type: Number,
            min: 1,
            max: 5
        },
        mentorship: {
            type: Number,
            min: 1,
            max: 5
        },
        workEnvironment: {
            type: Number,
            min: 1,
            max: 5
        },
        careerGrowth: {
            type: Number,
            min: 1,
            max: 5
        },
        stipendFairness: {
            type: Number,
            min: 1,
            max: 5
        },
        studentFeedback: {
            type: String,
            maxlength: 1000
        },
        wouldRecommend: {
            type: Boolean
        },
        ratedByStudent: {
            type: Boolean,
            default: false
        },
        studentRatedAt: Date
    },
    
    // Completion status
    internshipCompleted: {
        type: Boolean,
        default: false
    },
    completionDate: Date,
    
    // Match accuracy (for improving algorithm)
    matchAccuracy: {
        type: Number,
        min: 1,
        max: 5
    }
}, { timestamps: true });

// Indexes for efficient queries
ratingSchema.index({ student: 1 });
ratingSchema.index({ organization: 1 });
ratingSchema.index({ allocation: 1 });
ratingSchema.index({ 'studentRating.overallScore': 1 });
ratingSchema.index({ 'internshipRating.overallScore': 1 });

module.exports = mongoose.model('Rating', ratingSchema);

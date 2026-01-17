const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    blindId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        description: "Anonymized ID for blind allocation"
    },
    personal: {
        name: { type: String, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        dob: Date,
        category: { type: String, default: 'General' } // Social Justice Category
    },
    contacts: {
        phone: String,
        address: String,
        city: String,
        state: String
    },
    academic: {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        gpa: { type: Number, required: true, index: true },
        passingYear: Number
    },
    skills: [{
        name: String,
        level: {
            type: Number,
            min: 1,
            max: 5,
            default: 1
        },
        isVerified: { type: Boolean, default: false }
    }],
    preferences: {
        locations: [String],
        domains: [String],
        minStipend: Number
    },
    availability: {
        type: Boolean,
        default: true,
        index: true
    },
    allocationStatus: {
        type: String,
        enum: ['PENDING', 'MATCHED', 'ACCEPTED'],
        default: 'PENDING',
        index: true
    },
    resumePath: {
        type: String
    },
    resumeUploadedAt: {
        type: Date
    }
}, { timestamps: true });

// Index for optimizing search by skills (Multikey index)
studentSchema.index({ 'skills.name': 1 });

module.exports = mongoose.model('Student', studentSchema);

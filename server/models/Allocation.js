const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        index: true // Useful for querying specific allocation rounds
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
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    breakdown: {
        type: Map,
        of: Number, // Keep this strictly numeric for chart plotting
        description: "Explainability vector, e.g., { skillMatch: 0.8, locMatch: 1.0 }"
    },
    explanation: {
        type: String, // Human-readable reason
        default: ''
    },
    status: {
        type: String,
        enum: ['PROPOSED', 'ACCEPTED', 'REJECTED'],
        default: 'PROPOSED',
        index: true
    },
    expiresAt: {
        type: Date,
        index: { expireAfterSeconds: 0 } // Basic TTL, though logic might require manual handling
    }
}, { timestamps: true });

// Compound unique index to prevent duplicate allocation in same batch maybe?
// allocationSchema.index({ batchId: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Allocation', allocationSchema);

const mongoose = require('mongoose');

const dropoutSchema = new mongoose.Schema({
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
    allocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Allocation'
    },
    reason: {
        type: String,
        required: true
    },
    initiatedBy: {
        type: String,
        enum: ['STUDENT', 'ORG', 'SYSTEM'],
        required: true
    },
    isReallocated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Dropout', dropoutSchema);

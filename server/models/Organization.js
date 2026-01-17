const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        index: 'text' // Text index for search
    },
    type: {
        type: String,
        enum: ['MINISTRY', 'PSU', 'PRIVATE', 'NGO'],
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    locations: [String],
    // Optional: Contact person details, etc.
    contactPerson: {
        name: String,
        email: String,
        phone: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);

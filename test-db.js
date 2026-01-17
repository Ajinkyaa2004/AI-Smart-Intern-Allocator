const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/internmatch_ai';

console.log('Testing MongoDB connection...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('✅ MongoDB Connection Successful!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Failed:', err.message);
        process.exit(1);
    });

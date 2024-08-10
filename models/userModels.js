const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        message: 'Name field is required'
    },
    username: {
        type: String,
        required: true,
        trim: true,
        message: 'Username field is required',
        unique: true
    },
    
    password: {
        type: String,
        trim: true,
        message: 'Password field is required'
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
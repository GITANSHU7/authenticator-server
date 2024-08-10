const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        message: 'Name field is required'
    },
    email: {
        type: String,
        required: true,
        trim: true,
        message: 'Email field is required',
        unique: true
    },
    number: {
        type: String,
        required: true,
        trim: true,
        message: 'Contact field is required',
        unique: true
    },
    products: [{
        productName: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required']
        },
        price: {
            type: Number,
            required: [true, 'Product price is required']
        }
    }]
    

   
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
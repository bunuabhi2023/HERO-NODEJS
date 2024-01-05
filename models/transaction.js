const mongoose = require('mongoose');

const transactions = new mongoose.Schema({
    agreementNo:{
        type:String,
        required:false,
        maxLenght:255
    },
    customerName:{
        type:String,
        required:false,
        maxLenght:255
    },
    product:{
        type:String,
        required:false,
        maxLenght:255
    },
    razorpayPaymentId: {
        type:String,
        required:false,
        maxLength:255,
    },
    razorpayOrderId: {
        type:String,
        required:false,
        maxLength:255,
    },
    razorpaySignature: {
        type:String,
        required:false,
        maxLength:255,
    },
    amount: {
        type:Number,
        required:false,
        maxLength:255,
    },
    status:{
        type:String,
        enum:["pending", "success"],
        default:"pending"
    }
},{ timestamps: true,});

module.exports = mongoose.model("Transaction", transactions);
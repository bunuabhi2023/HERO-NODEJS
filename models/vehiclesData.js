
const mongoose = require("mongoose");

const vehiclesdata = new mongoose.Schema(
    {
        agreementNo: {
            type:String,
            required:false,
            maxLength:255,
        },
        customerName: {
            type:String,
            required:false,
            maxLength:255,
        },
        regNo: {
            type:String,
            required:false,
            maxLength:255,
        },
        bomBucket: {
            type:String,
            required:false,
            maxLength:255,
        },
        emiOs: {
            type:String,
            required:false,
            maxLength:255,
        },
        settlement: {
            type:String,
            required:false,
            maxLength:255,
        },
        address: {
            type:String,
            required:false,
            maxLength:2000,
        },
        phone: {
            type:Number,
            required:false,
            maxLength:13,
        },
        reference1Name: {
            type:String,
            required:false,
            maxLength:255,
        },
        reference1Phone: {
            type:Number,
            required:false,
            maxLength:13,
        },
        reference2Name: {
            type:String,
            required:false,
            maxLength:255,
        },
        reference2Phone: {
            type:Number,
            required:false,
            maxLength:13,
        },
        assetDescription: {
            type:String,
            required:false,
            maxLength:2000,
        },
        fatherName: {
            type:String,
            required:false,
            maxLength:255,
        },
        fos: {
            type:String,
            required:false,
            maxLength:255,
        },
        feedBack: {
            type:String,
            required:false,
            maxLength:255,
        },

    },
    { timestamps: true,}
);

module.exports = mongoose.model("VehicleData", vehiclesdata);

const Transaction = require('../models/transaction');
const VehicleData = require('../models/vehiclesData');
const crypto = require("crypto");
const Razorpay = require("razorpay");
const {catchError} = require('../middlewares/CatchError')

function hmac_sha256(data, key) {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(data);
    return hmac.digest("hex");
}


exports.payNow = catchError(async(req, res) =>{
    const razorpayKey = "rzp_live_RFDCf6fNpIDBTl";
    const razorpaySecret = "EGt4ymeXKGxJ1hTnDr8j0b2j";

    const razorpay = new Razorpay({
        key_id: razorpayKey,
        key_secret: razorpaySecret,
    });

    const {agreementNo, customerName, assetDescription, amount} = req.body;

    const orderData = {
        amount: amount * 100, // Example: Amount in paise
        currency: "INR",
    };

    const orderRzp = await razorpay.orders.create(orderData);

    const transaction = new Transaction({
        agreementNo,
        customerName, 
        product:assetDescription,
        amount:orderRzp.amount,
        razorpayOrderId: orderRzp.id,
        razorpayPaymentId: null,
        razorpaySignature: null
    });

    const savedtransction = await transaction.save();

    return res.status(200).json({savedtransction});
});

exports.successPayment = catchError(async(req, res) => {
    const secret = 'EGt4ymeXKGxJ1hTnDr8j0b2j';

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const expectedSignature = hmac_sha256(
        `${razorpayOrderId}|${razorpayPaymentId}`,
        secret
    );

    if (expectedSignature === razorpaySignature) {

        const updateTransaction = await Transaction.findOneAndUpdate(
            {razorpayOrderId: razorpayOrderId},
          { razorpayPaymentId, razorpaySignature, status:"success", updatedAt: Date.now() },
          { new: true }
        );
        

        const responseData = {
            message: "Payment success",
            data: updateTransaction
        };

       return res.status(201).json({responseData});
    } else {
        const responseData = {
            status: "Error",
            message: "Payment failed",
        };

       return res.status(201).json({responseData});
    }
})

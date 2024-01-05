const express  = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const vehicleController = require("../controllers/vehicleDataController");
const transactionController = require("../controllers/transactionController");
const receiptController =  require('../controllers/receiptController');





const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {auth, isAdmin,}  = require('../middlewares/Auth');
const { imageSingleUpload , imageMultiUpload, imageBulkUpload} = require("../middlewares/multer");

//=========================================================================================================//
// Home 
router.get("/", (req, res) =>{
    res.send("Welcome to Vehicle Recovery Backend");
});

                                        //****Admin Routes ****//

//User Route//
router.post("/register-user", userController.signUp);
router.post("/login-user", userController.login);
router.get("/my-profile", auth, userController.getMyProfile);
router.put("/update-my-profile", auth, userController.updateMyProfile);
router.post("/forget-password",  userController.forgotPassword);
router.post("/reset-password",  userController.resetPassword);
router.post("/change-password", auth, userController.updatePassword);



//Vehicle Data Route//
router.post("/upload", auth, upload.single("file"), vehicleController.uploadFile);
router.get("/get-details-by-agreement/:agreementNo",  vehicleController.getByAgreementNo);
router.get("/get-vehicle-data", auth, vehicleController.getVehicleData);
router.post("/insert-detail", auth, vehicleController.createVehicleRecord);


//Transaction Route//
router.post("/pay-now", transactionController.payNow);
router.post("/verify-payment", transactionController.successPayment);


router.post("/send-mail", receiptController.sendReceipt);




module.exports = router;
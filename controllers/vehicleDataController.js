
const xlsx = require("xlsx");
const VehicleData = require("../models/vehiclesData"); 
const {catchError} = require('../middlewares/CatchError')

exports.uploadFile = catchError(async (req, res) => {
  
    // Check if the file is provided
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Parse the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const row of data) {
      const vehicleData = new VehicleData({
        agreementNo: row.ProposalNo,
        customerName: row.customerName,
        regNo: row.RegistrationNumber,
        bomBucket: row.BOMBucket,
        settlement: row.Settlement,
        emiOs: row.EMIOS,
        address: row.ResidenceAddress,
        phone: row.ResidencePhone,
        reference1Name: row.Reference1Name,
        reference1Phone: row.Reference1Phone,
        reference2Name: row.Reference2Name,
        reference2Phone: row.Reference2Phone,
        assetDescription: row.AssetDesc,
        fatherName: row.FatherName,
        fos: row.FOS,
        feedBack: row.FEEDBACK,
      });

      await vehicleData.save();
    }

    return res.status(200).json({ message: "File uploaded successfully" });
 
});

exports.createVehicleRecord = catchError(async(req, res)=>{
  const {agreementNo,customerName,regNo,bomBucket,settlement,emiOs,address,phone,reference1Name,reference1Phone,reference2Name,reference2Phone,assetDescription,fatherName,fos,feedBack} = req.body;
  const existingRecord = await VehicleData.findOne({agreementNo:agreementNo});
  if(existingRecord){
    return res.status(409).json({ message: "Data For Given Agreement Number Is Already Exist" });
  }

  const newRecord = new VehicleData({
    agreementNo,
    customerName,
    regNo,
    bomBucket,
    settlement,
    emiOs,
    address,
    phone,
    reference1Name,
    reference1Phone,
    reference2Name,
    reference2Phone,
    assetDescription,
    fatherName,
    fos,
    feedBack
  });
  const savedRecord = await newRecord.save();
  return res.status(200).json({message:"Record Inserted Successfully!", data:savedRecord});
});

exports.getByAgreementNo = catchError(async(req, res) =>{
  const {agreementNo} = req.params;
  const data = await VehicleData.findOne({agreementNo:agreementNo});
  return res.status(200).json({data});
});


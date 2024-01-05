const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const util = require('util');
const appendFile = util.promisify(fs.appendFile);
const nodemailer = require('nodemailer');

function generateReceiptPdf(loanNo, customerName, amount, trasactionId, transactiondatetime, product, trasactionStatus) {
    const doc = new PDFDocument();

    doc.image('utils/images/logo.png', 50, 50, { width: 100 });

    // Set up the table structure
    const table = {
        headers: ['Key', 'Value'],
        rows: [
            ['Transaction ID:', trasactionId],
            ['Loan No:', loanNo],
            ['Customer Name:', customerName],
            ['Product:', product],
            ['Amount:', amount],
            ['Transaction Status:', trasactionStatus],
            ['Transaction Datetime:', transactiondatetime],
        ],
    };

    // Set the initial position for the table
    let yPosition = 200;

    // Draw the table
    table.headers.forEach((header, i) => {
        doc.text(header, i % 2 === 0 ? 50 : 250, yPosition, { continued: true, width: 150 });
        if (i % 2 !== 0) {
            yPosition += 20;
        }
    });

    // Draw the rows
    table.rows.forEach((row, i) => {
        doc.text(row[0], i % 2 === 0 ? 50 : 250, yPosition, { continued: true, width: 150 });
        doc.text(row[1], i % 2 === 0 ? 200 : 400, yPosition, { continued: true, width: 150 });
        if (i % 2 !== 0) {
            yPosition += 20;
        }
    });

    // Draw borders
    table.rows.forEach((row, i) => {
        if (i % 2 === 0) {
            doc.rect(50, yPosition - 10, 200, 20).stroke();
        } else {
            doc.rect(250, yPosition - 10, 200, 20).stroke();
        }
    })

    return new Promise((resolve, reject) => {
        let chunks = [];

        doc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        doc.on('end', () => {
            let pdfData = Buffer.concat(chunks);
            resolve(pdfData);
        });

        doc.on('error', (error) => {
            reject(error);
        });

        doc.end();
    });
};

exports.sendReceipt = async(req, res) =>{
    try {
        const {email,loanNo, customerName, amount, trasactionId, transactiondatetime, product, trasactionStatus} = req.body
        const pdfData = await generateReceiptPdf(loanNo, customerName, amount, trasactionId, transactiondatetime, product, trasactionStatus)
        await appendFile('receipt.pdf', pdfData);

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: "webienttechenv@gmail.com",
                pass: "ljxugdpijagtxeda",
            },
        });

        let info = await transporter.sendMail({
            from: 'webienttechenv@gmail.com',  // Replace with your email
            to: email,
            subject: 'Transaction Receipt', // Subject line
            text: 'Please find the attached transaction receipt.', // plain text body
            attachments: [
                {   // binary buffer as an attachment
                    filename: 'receipt.pdf',
                    content: pdfData
                }
            ]
        });

        console.log('Message sent successfully');
        console.log(info.messageId);
        return res.status(200).json("Message sent successfully");
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}


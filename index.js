const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { ErrorMiddleware } = require("./middlewares/Error");
const sls = require("serverless-http");
const cors = require('cors');

app.use('/backend/uploads', express.static('uploads'));
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://herofinecop.vercel.app"
          ],
          credentials: true,
    })
  );

app.use('/uploads', express.static('uploads'));
// load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 4000;

//middleware to parse json request body
app.use(express.json());
app.use(cookieParser());

//import routes
const route = require("./routes/route");

//mount the todo API routes
app.use("/backend/api/v1", route);

module.exports.handler = sls(app);

//start serve
app.listen(PORT, () =>{
    console.log(`Server started Successfully at ${PORT}`);
})

app.use(ErrorMiddleware);

const dbConnect = require("./config/database");
dbConnect();

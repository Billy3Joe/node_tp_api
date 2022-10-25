// Basic Lib Import
const express = require('express');
const router = require('./src/routes/api');
const app = new express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require("multer");
const  cookieParser = require('cookie-parser');

//App use 
app.use(bodyParser.json());

app.use(cookieParser());
//connect mongoDB
const URI  = "mongodb://localhost:27017/library";
mongoose.connect(URI,
    err => {
        if(err) throw err;
        console.log('connected to MongoDB')
    });

app.use(express.json());
// const URI  = "mongodb://localhost:27017/User_Profile";
// mongoose.connect(URI,{
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
//     },
//     err => {
//         if(err) throw err;
//         console.log('connected to MongoDB')
//     });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Static Image Url defined
// sample Url: http://localhost:5000/user/photo_1648757395684.jpg
app.use('/book', express.static('storage/images'))


//Base Route
app.use("/api/v1", router);


//Multer Error File Handling
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) { // Multer-specific errors
        return res.status(418).json({
            err_code: err.code,
            err_message: err.message,
        });
    } else { // Handling errors for any other cases from whole application
        return res.status(500).json({
            err_code: 409,
            err_message: "Something went wrong!"
        });
    }
});

//Undefined Route Implement
app.use('*', (req, res)=>{
    res.status(404).json({status:"fail", data:"Not Found"})
});


module.exports = app;


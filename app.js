// Basic Lib Import
const express = require('express');
const router = require('./src/routes/api');
const app = new express();
//La bibliothèque nody-parser permet de lire une URL
const bodyParser = require('body-parser');
//La bibliothèque cookie-parser permet de lire un cookie
const cookieParser = require('cookie-parser');
//dotenv permet de réccupérer tout ce qui se trouve dans le fichier .env qu'on passe directement comme variable d'environnement
require('dotenv').config({ path: './middleware/.env' });
//On appel nos fonctions checkUser et requireAuth dépuis le fichier auth.middleware.js
const { checkUser, requireAuth } = require('./middleware/auth.middleware');

const mongoose = require('mongoose');
const multer = require("multer");
const cors = require('cors');

//DEBUT LOGIN
//Cors options (Les autorisations de nos requêtes)
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//JWT
//* veut dire que si jamais une route correspond à n'imporquel route, tu déclanches checkUser qui va checker si l'utilisateur à bien le token qui correspond à un id
//A chaque fois qu'on va faire un requête, il va checker
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});

//FIN LOGIN

//App use 
app.use(bodyParser.json());


//connect mongoDB
const URI = "mongodb://127.0.0.1:27017/library";
mongoose.connect(URI,
    err => {
        if (err) throw err;
        console.log('connected to MongoDB')
    });

// const URI  = "mongodb://localhost:27017/User_Profile";
// mongoose.connect(URI,{
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
//     },
//     err => {
//         if(err) throw err;
//         console.log('connected to MongoDB')
//     });


//Static Image Url defined
// sample Url: http://localhost:5000/user/photo_1648757395684.jpg
//app.use('/user', express.static('storage/images'))


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
app.use('*', (req, res) => {
    res.status(404).json({ status: "fail", data: "Not Found" })
});


module.exports = app;
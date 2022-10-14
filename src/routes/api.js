const express = require('express');

//Routes générales
const authController = require("../controllers/AuthController");
const UserController = require('../controllers/UserController');
const BookController = require('../controllers/BookController');
const fileUpload = require('../utils/fileUpload');
const router = express.Router();

//Routes du model User
router.post('/create-user', UserController.createUser);
router.post('/login', authController.signIn);
router.get("/logout", authController.logout);
router.get('/all-user', UserController.allUser);
router.get('/single-user/:id', UserController.singleUser);
// router.put('/update-user/:id', fileUpload("./storage/images"), UserController.updateUser);
router.delete('/delete-user/:id', UserController.deleteUser);

//Routes du model Book
router.post('/create-book', fileUpload("./storage/images"), BookController.createBook);
router.get('/all-book', fileUpload("./storage/images"), BookController.allBook);
router.get('/single-book/:id', BookController.singleBook);
router.put('/update-book/:id', fileUpload("./storage/images"), BookController.updateBook);
router.delete('/delete-book/:id', fileUpload("./storage/images"), BookController.deleteBook);

module.exports = router;
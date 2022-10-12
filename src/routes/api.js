const express = require('express');
const authController = require("../controllers/AuthController");
const UserController = require('../controllers/UserController');
const BookController = require('../controllers/BookController');
const fileUpload = require('../utils/fileUpload');
const router = express.Router();

router.post('/create-user', UserController.createUser);
router.post('/login', authController.signIn);
router.get("/logout", authController.logout);
router.get('/all-user', UserController.allUser);
router.get('/single-user/:id', UserController.singleUser);
router.put('/update-user/:id', fileUpload("./storage/images"), UserController.updateUser);
router.delete('/delete-user/:id', UserController.deleteUser);
router.post('/create-book', fileUpload("./storage/images"), BookController.createBook);

module.exports = router;
const express = require('express');
const UserController = require('../controllers/UserController');
const BookController = require('../controllers/BookController');
const fileUpload = require('../utils/fileUpload');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

//USER
//inscription
router.post('/create-user', UserController.createUser);
//login
router.post('/login',UserController.login);
//Get All user
router.get('/all-user',auth, UserController.allUser);
//get user by Id
router.get('/single-user/:id', UserController.singleUser);
//update user
router.post('/update-user',auth, UserController.updateUser);
//supprimer un user
router.delete('/delete-user',auth,  UserController.deleteUser);



//BOOK
//creer un book
router.post('/create-book',auth,fileUpload("./storage/images"), BookController.createBook);
// get all book 
router.get('/all-book', BookController.allBook);
// get book by genre 
router.get('/genre/:genre', BookController.GenreBook);
// get book by id 
router.get('/single-book/:id', BookController.singleBook);
// update book by id 
router.put('/update-book/:id', auth,fileUpload("./storage/images"), BookController.updateBook);
//delete Book by id
router.delete('/delete-book/:id',auth,  BookController.deleteBook);
//add review
router.put('/add-review',auth,BookController.addReview)
//delete review
router.put('/delete-review/:idBook&:idReview',auth,  BookController.deleteReview);
module.exports = router;
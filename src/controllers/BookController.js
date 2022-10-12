const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");
const fs = require('fs');
const DIR = './';

module.exports = class BookController {

  //New User Create
  static createBook = async (req, res) => {
    let payload = req.body;
    console.log(payload);
    //Image check if have then include image into payload
    var imgUrl = "";
    if (req.file) var imgUrl = `storage/images/${req.file.filename}`;
    payload.image = imgUrl;

    try {
      const bookCreate = await new Book(payload).save();
      return res.status(200).json({
        code: 200,
        message: "book Create Successfully",
        data: bookCreate,
      });
    } catch (error) {
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  };


  //Single User Information
  static singleUser = async(req, res)=>{
    const id = req.params.id;

    try{
      const singleUserInfo = await User.findById(id);
      const {name, email, phone, avater} =singleUserInfo;
      var getImageName = avater.match(/\/([^\/?#]+)[^\/]*$/);

      //return console.log(getImageName);
      
      const singleuUserData ={
        name,
        email,
        phone,
        imageUrl: `http://localhost:5000/user/${getImageName[1]}`
      }
      return res.status(200).json({
        code: 200,
        message: "User Information",
        data: singleuUserData,
      });
      //return console.log(singleUserInfo)
    }
    catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  }
};
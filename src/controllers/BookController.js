const User = require("../models/User");
const Book = require("../models/Book");
const mongoose = require("mongoose");
const fs = require('fs');
const { find, findOneAndUpdate } = require("../models/Book");
const DIR = './';

module.exports = class BookController {

  //New book Create
  static createBook = async (req, res) => {
    const isAdmin=res.locals.isAdmin;
    
    

    try {
      if(isAdmin){
        let payload = req.body;
        console.log('file added',req.body);
        console.log('data ====>',payload)
       //Image check if have then include image into payload
        var imgUrl = "";
        if (req.file) var imgUrl = `storage/images/${req.file.filename}`;
        payload.image = imgUrl;
        var getImageName = payload.image.match(/\/([^\/?#]+)[^\/]*$/);

        const bookCreate = await new Book({
          title:payload.title,
          author:payload.author,
          categories:payload.categories,
          description:payload.description,
          price:payload.price,
          isbn:payload.isbn,
          nbr_pages:payload.nbr_pages,
          image:payload.image,
          imageURL:`http://localhost:5000/book/${getImageName[1]}`
        }).save();
        return res.status(200).json({
          code: 200,
          message: "book Create Successfully",
          data: bookCreate,
        });
      }else{res.status(401).json({
        code: 401,
        message: "you don't have access to add a book",
        error: true,
      });}
      
    } catch (error) {
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  };


  //Single book Information
  static singleBook = async(req, res)=>{
    const id = req.params.id;
    console.log(id)
    try{
      const singleBookInfo = await Book.findById(id);
      console.log(singleBookInfo);
      const {_id,title, author, categorie, description,price, isbn,review,nbr_pages,imageURL} =singleBookInfo;
      //var getImageName = image.match(/\/([^\/?#]+)[^\/]*$/);

      //return console.log(getImageName);
      
      const singleBookData ={
        _id,
        title, 
        author, 
        categorie, 
        description,
        price, 
        isbn,
        nbr_pages,
        review,
        imageURL
      }
      return res.status(200).json({
        code: 200,
        message: "User Information",
        data: singleBookData,
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

  //All Book information
  static allBook = async(req, res)=>{
    try{
      const allBookInfo = await Book.find().select("-image");
      

      //return console.log(singleUserInfo);
      return res.status(200).json({
        code: 200,
        message: "User Information",
        data: allBookInfo,
      });
    }
    catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  }



  //Book by genre
  static GenreBook = async(req, res)=>{
    const genre=req.params.genre
    try{
      const allBookInfo = await Book.find({categories:genre}).select("-image");
      

      //return console.log(singleUserInfo);
      return res.status(200).json({
        code: 200,
        message: "User Information",
        data: allBookInfo,
      });
    }
    catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  }

  //add review
  static addReview = async (req, res) => {
    let payload = req.body;

    try {
        if(res.locals.userId){
            const id = payload.bookId
            //console.log(payload.grade, payload.message)
            const BookExist = await Book.findOne({_id: payload.bookId})
            if(BookExist){
                //const reviewCreate = await new Review(payload).save();
                var avis = {UserId: res.locals.userId, grade: payload.grade, description: payload.message, idBook:payload.bookId}
                const updateItem = await Book.findOneAndUpdate( { _id: id }, {$push : {review: avis}});
                console.log(avis)
                return res.status(200).json({
                    code: 200, 
                    message: "review Create Successfully",
                    data: updateItem,
                });
            }else{
              res.status(401).json({
                code:401,
                message: "Book not exist",
                error: true,
              })
            }
        
    }else{console.log("no id")}
    } 
    catch (error) {
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  };

  //Delete Book by admin
  static deleteBook = async(req, res)=>{
    const id = req.params.id;
    const isAdmin=res.locals.isAdmin;
    const BookExist = await Book.findOne({_id: id})
    try{
        if(isAdmin){
          if(BookExist){
            const userDeleteinfo = await Book.findOneAndDelete({_id: id});
            const {image} = userDeleteinfo
        

            if(image){
              fs.unlinkSync(DIR + image);
            }
            return res.status(200).json({
              code: 200,
              message: "Book Delete Successfully",
              data: userDeleteinfo,
            }); 
          }else{
            res.status(401).json({
              code: 401,
              message: "Book not exist"
            }) 
          }
        }else{
          res.status(401).json({
            code: 401,
            message: "you don't have access to delete"
          })
        }
          
        
    }catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }
  }


  //Update Book by id
  static updateBook = async(req, res)=>{
      try{
        const id = req.params.id
        const isAdmin = res.locals.isAdmin
        var reqBody = req.body
        console.log(req)
        console.log(reqBody)
        var imgUrl = "";
        if (req.file){var imgUrl = `storage/images/${req.file.filename}`;
        reqBody.image = imgUrl;
        var getImageName = reqBody.image.match(/\/([^\/?#]+)[^\/]*$/);
        reqBody.imageURL = `http://localhost:5000/book/${getImageName[1]}`} 
        
          
        if (isAdmin){
          const updateItem = await Book.findOneAndUpdate( { _id: id }, reqBody );

          return res.status(200).json({
            code: 200,
            message: "Book Update Information Successfully",
            data: updateItem
          });

        }else{
          return res.status(501).json({
            code: 500,
            message: "auth required",
          });
        }
      }catch(error){
        res.status(501).json({
          code: 501,
          message: error.message,
          error: true,
        });
      }

    
    
  }



  //Delete review 
  static deleteReview = async(req, res)=>{
    const id= res.locals.userId;

    const idBook = req.params.idBook;
    const idReview= req.params.idReview;
    const isAdmin=res.locals.isAdmin;
    const BookExist = await Book.findOne({ _id: idBook}); 
    const rev = BookExist.review;
    var vrai = false
    rev.forEach(function(avis){
      if (avis.UserId==id){
        vrai= true
      }
    })

    
    
    

    try{
        if(isAdmin || vrai){
          if(BookExist){
            const userDeleteinfo = await Book.findOneAndUpdate({_id: idBook},{
              $pull: {
                  review: {_id: idReview},
              },
          });

            return res.status(200).json({
              code: 200,
              message: "Review Delete Successfully",
              data: userDeleteinfo,
            });
          }else{
            res.status(401).json({
              code: 401,
              message: "Book not exist"
            })
          }
        }else{
          res.status(401).json({
            code: 401,
            message: "you don't have access to delete"
          })
        }
          
        
    }catch(error){
      res.status(501).json({
        code: 501,
        message: error.message,
        error: true,
      });
    }

  }

};
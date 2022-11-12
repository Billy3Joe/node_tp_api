const mongoose = require('mongoose');
//const crypto = require('crypto')

const DataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        reqired: true
    },
    categories:{
        type: String,
        reqired: false
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: false,
    },
    isbn:{
        type:String,
        required: false
    },
    nbr_pages:{
        type:Number,
        required: false
    },
    review:[
        {
          UserId: String,
          grade: Number,
          description:String,
        },
    ],
    imageURL:{
        type:String
    },
    image:{
        type: String
    }
    
    
},{ timestamps: true, versionKey:false })


const Book = mongoose.model('Book', DataSchema, 'books');
module.exports = Book;
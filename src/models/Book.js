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
        reqired: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    isbn:{
        type:String,
        required: true
    },
    nbr_pages:{
        type:Number,
        required: true
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
        type: String,
        required: true
    }
    
    
},{ timestamps: true, versionKey:false })


const Book = mongoose.model('Book', DataSchema, 'books');
module.exports = Book;
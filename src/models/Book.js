const mongoose = require('mongoose');
//const crypto = require('crypto')

const DataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    },
    categories: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    isbn: {
        type: String,
        required: true
    },
    nbr_pages: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }


}, { timestamps: true, versionKey: false })


const BookModel = mongoose.model('Book', DataSchema, 'books');
module.exports = BookModel;
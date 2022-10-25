const mongoose = require('mongoose');
//const crypto = require('crypto')

const DataSchema = new mongoose.Schema({
    id_user: {
        type: mongose.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: String,
        default: Date.now()
    },
    id_prod: {
        type: mongose.Types.ObjectId,
        ref: "Book"
    },

    price: {
        type: Number,
        required: true,
    },

}, { timestamps: true, versionKey: false })


const Order = mongoose.model('Order', DataSchema, 'orders');
module.exports = Order;
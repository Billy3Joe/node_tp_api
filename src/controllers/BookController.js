// const UserModel = require("../models/User");
const BookModel = require("../models/Book");
const mongoose = require("mongoose");
const fs = require('fs');
const DIR = './';

module.exports = class BookController {

    //New Book Create
    static createBook = async(req, res) => {
        let payload = req.body;
        console.log(payload);
        //Image check if have then include image into payload
        var imgUrl = "";
        if (req.file) var imgUrl = `storage/images/${req.file.filename}`;
        payload.image = imgUrl;

        try {
            const bookCreate = await new BookModel(payload).save();
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

    //Get all Book
    //All User information
    static allBook = async(req, res) => {
        try {
            const allBookInfo = await BookModel.find();
            console.log(allBookInfo);
            return res.status(200).json({
                code: 200,
                message: "Book Information",
                data: allBookInfo,
                // .sort({ createdAt: -1 }) permet de ranger les posts su plus recents au plus anciens   
            }).sort({ createdAt: -1 });;
            //return console.log(singleBookInfo)
        } catch (error) {
            res.status(501).json({
                code: 501,
                message: error.message,
                error: true,
            });
        }
    }


    //Single Book Information
    static singleBook = async(req, res) => {
        const id = req.params.id;

        try {
            const singleBookInfo = await BookModel.findById(id);
            const { title, author, categories, description, price, isbn, nbr_pages, image } = singleBookInfo;
            var getImageName = image.match(/\/([^\/?#]+)[^\/]*$/);

            //return console.log(getImageName);

            const singleBookData = {
                title,
                author,
                categories,
                description,
                price,
                isbn,
                nbr_pages,
                image: `http://localhost:5000/book/${getImageName[1]}`
            }
            return res.status(200).json({
                code: 200,
                message: "Book Information",
                data: singleBookData,
            });
            //return console.log(singleUserInfo)
        } catch (error) {
            res.status(501).json({
                code: 501,
                message: error.message,
                error: true,
            });
        }
    }

    //Book Update by User Id
    static updateBook = async(req, res) => {
        const id = req.params.id;
        let reqBody = req.body;

        //If File have then push file into reqBody then process update
        var imgUrl = '';
        if (req.file) var imgUrl = `storage/images/${req.file.filename}`;
        reqBody.image = imgUrl;


        try {
            //Check user have photo/image. if had then first delete local file then database
            const BookInfo = await BookModel.findById(id);
            const bookPhotoInfo = BookInfo.image;
            if (bookPhotoInfo) {
                fs.unlinkSync(DIR + bookPhotoInfo);
            }

            const updateItem = await BookModel.findOneAndUpdate({ _id: id }, reqBody);
            return res.status(200).json({
                code: 200,
                message: "Book Update Information Successfully",
                data: updateItem,
            });


        } catch (error) {
            res.status(501).json({
                code: 501,
                message: error.message,
                error: true,
            });
        }

    }


    //Book Delete By Book Id
    static deleteBook = async(req, res) => {
        const id = req.params.id;
        //return console.log(id)
        try {

            const bookDeleteinfo = await BookModel.findOneAndDelete({ _id: id });
            // const { avater } = userDeleteinfo

            // if (avater) {
            //     fs.unlinkSync(DIR + avater);
            // }

            return res.status(200).json({
                code: 200,
                message: "Book Delete Successfully",
                data: bookDeleteinfo,
            });
        } catch (error) {
            res.status(501).json({
                code: 501,
                message: error.message,
                error: true,
            });
        }
    }
};
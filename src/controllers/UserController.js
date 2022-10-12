const UserModel = require("../models/User");
//On appel nos fonctions signUpErrors, signInErrors et de la gestion d'érreurs dépuis le dossier utils
const { signUpErrors, signInErrors } = require('../utils/errors.utils');
const mongoose = require("mongoose");
const fs = require('fs');
const DIR = './';

module.exports = class UserController {

    //New User Create (Signup)
    static createUser = async(req, res) => {
        let payload = req.body;
        console.log(payload.name);

        try {
            const userCreate = await new UserModel(payload).save();
            return res.status(200).json({
                code: 200,
                message: "User Create Successfully",
                data: userCreate,
            });
        } catch (err) {
            // res.status(501).json({
            //     code: 501,
            //     message: error.message,
            //     error: true,
            // });
            //signUpErrors est une fonction que nous avons crée dans le fichier errors.utils.js du dossier utils
            const errors = signUpErrors(err)
            res.status(200).send({ errors })
        }
    };

    //New User Create (Signin)
    static loginUser = async(req, res) => {
        const { email, password } = req.body

        try {
            const user = await UserModel.login(email, password);
            //On utilise notre token généré plus haut en passant en paramètre l'id de l'utilisateur qui retournera par la suite après la connexion le même id
            const token = createToken(user._id);
            //On met dans les cookie le nom du cookie ('jwt'), le token httpOnly qui est la sécurité du token et maxeAge qui est la durée de vie du cookie
            res.cookie('jwt', token, { httpOnly: true, maxAge });
            //On se fait un status 200 avec les infos pour dire que ça a marché
            res.status(200).json({ user: user._id })
        } catch (err) {
            //signInErrors est une fonction que nous avons crée dans le fichier errors.utils.js du dossier utils
            const errors = signInErrors(err)
                //On se fait un status 200 en renvoyant l'erreur si ça n'a pas marché
            res.status(200).json({ errors });

        }
    };


    //Single User Information
    static singleUser = async(req, res) => {
        const id = req.params.id;

        try {
            const singleUserInfo = await UserModel.findById(id);
            const { name, email, phone, role } = singleUserInfo;
            // const { name, email, phone, avater } = singleUserInfo;
            // var getImageName = avater.match(/\/([^\/?#]+)[^\/]*$/);

            //return console.log(getImageName);

            const singleuUserData = {
                name,
                email,
                phone,
                role
                // imageUrl: `http://localhost:5000/user/${getImageName[1]}`
            }
            return res.status(200).json({
                code: 200,
                message: "User Information",
                data: singleuUserData,
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


    //All User information
    static allUser = async(req, res) => {
        try {
            const allUserInfo = await UserModel.find().select("-password");;
            console.log(allUserInfo);
            return res.status(200).json({
                code: 200,
                message: "User Information",
                data: allUserInfo,
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


    //User Update by User Id
    static updateUser = async(req, res) => {
        const id = req.params.id;
        let reqBody = req.body;

        //If File have then push file into reqBody then process update
        var imgUrl = '';
        if (req.file) var imgUrl = `storage/images/${req.file.filename}`;
        reqBody.avater = imgUrl;


        try {
            //Check user have photo/image. if had then first delete local file then database
            const userInfo = await User.findById(id);
            const userPhotoInfo = userInfo.avater;
            if (userPhotoInfo) {
                fs.unlinkSync(DIR + userPhotoInfo);
            }

            const updateItem = await User.findOneAndUpdate({ _id: id }, reqBody);
            return res.status(200).json({
                code: 200,
                message: "User Update Information Successfully",
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


    //User Delete By User Id
    static deleteUser = async(req, res) => {
        const id = req.params.id;
        //return console.log(id)
        try {

            const userDeleteinfo = await User.findOneAndDelete({ _id: id });
            const { avater } = userDeleteinfo

            if (avater) {
                fs.unlinkSync(DIR + avater);
            }

            //const userDelete = await User.deleteOne({_id: id});
            return res.status(200).json({
                code: 200,
                message: "User Delete Successfully",
                data: userDeleteinfo,
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
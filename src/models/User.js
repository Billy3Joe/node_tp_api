const mongoose = require('mongoose');
//On appel isEmail(une fonction qui renvoit true ou false) de la bibliothèque validator pour controller l'email
const { isEmail } = require('validator');

//bcrypt permet de crypter le md^p en générant une serie de caractères
const bcrypt = require('bcrypt');


const DataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    email: {
        type: String,
        validate: [isEmail],
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        minlength: 10
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: Boolean,
        required: true,
        default: false
    },


}, { timestamps: true, versionKey: false });


// play function before save into display: 'block',
//Avant d'enregistrer les données dans la bd, je veux que tu cryptes le mdp
DataSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


//Lorsque l'utilisateur entre les informations pour se connecter, on réccupère son email et son password
DataSchema.statics.login = async function(email, password) {
    //this.findOne(email) correspond à l'email que l'utilisateur à passé. Il faut noté que haque email est unique
    const user = await this.findOne({ email });
    if (user) {
        //On compare le password entré par l'utilisateur avec celui inscrit dans la bd
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            //Si le deux passwords sont pareil, retourn l'utilisateur
            return user;
        }
        //Si les deux passwords sont différent, retourn l'erreur
        throw Error('incorrect password');
    }
    throw Error('incorrect email')
};

const UserModel = mongoose.model("user", DataSchema);

module.exports = UserModel;

const User = mongoose.model('User', DataSchema, 'users');
module.exports = User;
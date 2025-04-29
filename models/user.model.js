const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        unique : true,
        minlength : [3, "UserName must be atleast 3 characters long"]
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [13, "Email should be 13 characters long"]
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, "Password should be 8 characters long"]
    }
})


const user = mongoose.model('user', userSchema)

module.exports = user;
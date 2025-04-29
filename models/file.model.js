const mongoose = require('mongoose')


const fileSchema = new mongoose.Schema({
    path:{
        type:String,
        required: [true, 'Path is required'],     
    },
    originalName:{
        type:String,
        required: [true, 'OriginalName is required'],
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

const file = mongoose.model('file',fileSchema)

module.exports = file;
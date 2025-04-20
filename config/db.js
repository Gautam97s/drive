const mongoose = require('mongoose');

function dbconnect(){
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to db")
    });
}

module.exports = dbconnect;
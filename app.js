const express = require('express');
const UserRouter = require('./routes/user.routes');
const dotenv = require('dotenv');
dotenv.config();
const dbconnect = require('./config/db')
dbconnect();

const app = express();

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/user',UserRouter)


app.listen(3000, () => {
    console.log("Your server's running"); 
})
// ⚡ 1. Load environment variables FIRST
require('dotenv').config();

// 2. Then import other modules
const express = require('express');
const UserRouter = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
const dbconnect = require('./config/db');
const IndexRouter = require('./routes/index.routes');                                                                                                                                                                                                                                                                                           
const supabaseAdmin = require('./config/supabase.config');
const upload = require('./config/multer.config');

// 3. Connect to database
dbconnect();

// 4. Create app
const app = express();

// 5. Setup middlewares
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Setup routes
app.use('/', IndexRouter);
app.use('/user', UserRouter);

// 7. Start server
app.listen(3000, () => {
    console.log("Your server's running"); 
});

const express = require("express");
const router = express.Router();
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require("express-validator");
const { supabase } = require('../config/supabase.config'); // Make sure this exists
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Render register page
router.get("/register", (req, res) => {
    res.render("Register");
});

// Handle user registration
router.post(
    "/register",
    body("email").trim().isEmail().isLength({ min: 13 }),
    body("password").trim().isLength({ min: 8 }),
    body("username").trim().isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array(),
                message: "Invalid data"
            });
        }

        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: "User registered successfully", newUser });
    }
);

// Render login page
router.get("/login", (req, res) => {
    res.render("login");
});

// Handle user login
router.post(
    "/login",
    body("email").trim().isEmail().isLength({ min: 13 }),
    body("password").trim().isLength({ min: 8 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array(),
                message: "Invalid data"
            });
        }

        const { email, password } = req.body;
        
        // console.log("Login attempt for email:", email);
        // console.log("Provided password:", password);

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // console.log("Stored password hash:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        // console.log("Password match result:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET,
        );

        res.cookie('token', token)

        res.send("Logged in")
    }
);



module.exports = router;

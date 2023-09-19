const express = require("express");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "thisismysecret@key";

// ROUTE 1: Create a user using: POST "/api/auth/createuser" Login not required
router.post('/createuser', [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Enter valid password").isLength({ min: 5 })
]
    , async (req, res) => {
        // If errors, return bad request and errors.
        const errors = validationResult(req);
        let success = false;
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ errors: "Sorry a user with this email already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePass
        })
        // .then(user => res.json(user))
        // .catch(err => {
        //     console.log(err);
        //     res.json("Please enter a unique value.")
        // });
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    });

// ROUTE 2: Authenticate a user using: POST "/api/auth/login" Login not required
router.post('/login', [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
]
    , async (req, res) => {
        // If errors, return bad request and errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            let success = false;
            if (!user) {
                success = false;
                return res.status(400).json({ errors: "Please try to login with correct credentials." });
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success, errors: "Please try to login with correct credentials." });
            }
            const data = {
                user: {
                    id: user.id
                }
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error.");
        }
    });

// ROUTE 3: Get logged in user details using: POST "/api/auth/getuser" Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error.");
    }
});
module.exports = router;
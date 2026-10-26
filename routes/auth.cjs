
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email already exists
        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            email,
            password: hashedPassword
        });

        // Return user information without password
        res.status(201).json({
            id: user._id,
            email: user.email,
            role: user.role
        });

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        // Return the token
        res.json({ token });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;

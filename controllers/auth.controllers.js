const bcrypt = require('bcrypt');
const { generateToken } = require('./jwt');
const User = require('../models/user.model');

// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({ username, email, password: hashedPassword });

        // Generate a token
        const token = generateToken(user.id);

        return res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

// Login a user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if password matches
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = generateToken(user.id);

        return res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};



module.exports = { register, login };


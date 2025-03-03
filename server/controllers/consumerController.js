const Consumer = require('../models/Consumer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Consumer
exports.registerConsumer = async(req, res) => {
    try {
        console.log("Received Data:", req.body);
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const existingUser = await Consumer.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newConsumer = new Consumer({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newConsumer.save();
        return res.status(201).json({ message: 'User registered successfully' }); // 🔥 Added return to stop execution

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Login Consumer
exports.loginConsumer = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const consumer = await Consumer.findOne({ email });
        if (!consumer) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, consumer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: consumer._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, message: 'Consumer Login successfully', user: consumer });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Fetch Consumers
exports.getConsumers = async(req, res) => {
    try {
        const consumers = await Consumer.find({}, 'firstName lastName email');
        const formattedConsumers = consumers.map(consumer => ({
            _id: consumer._id,
            fullName: `${consumer.firstName} ${consumer.lastName}`,
            email: consumer.email
        }));

        return res.status(200).json(formattedConsumers); // ✅ Only one response
    } catch (error) {
        console.error('Error fetching consumers:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.getConsumerProfile = async(req, res) => {
    try {
        const user = await Consumer.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
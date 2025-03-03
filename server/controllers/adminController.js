const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Consumer = require('../models/Consumer');
const { message } = require('statuses');
const InterestedUser = require('../models/InterestedUser');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// @desc    Auth admin & get token
// @route   POST /api/admin/login
// access  Public
const loginAdmin = async(req, res) => {
    try {
        const { email, password } = req.body;
        // Find admin by email
        const admin = await Admin.findOne({ email });
        // Check if admin exists and password matches
        if (admin && (await admin.matchPassword(password))) {
            // Generate JWT token
            const token = generateToken(admin._id);
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: token,
                message: 'Admin login successfully'
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Register admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if admin already exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        // Create new admin
        const admin = await Admin.create({
            name,
            email,
            password,
        });

        if (admin) {
            // Generate token for new admin
            const token = generateToken(admin._id);
            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                token: token,
                message: 'Admin created successfully',
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addInterestedUser = async(req, res) => {
    try {
        console.log("Received Data:", req.body);
        const { userId, userName, email, phone, productId, product } = req.body;

        if (!userName || !phone) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newInterestedUser = new InterestedUser({
            userId,
            userName,
            email,
            phone,
            productId,
            product,
        });

        await newInterestedUser.save();
        res.status(201).json({ newInterestedUser, success: true, message: "Interested User added successfully" });
    } catch (error) {
        console.error("Error adding interested user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
const getInterestedUsers = async(req, res) => {
    try {
        const interestedUsers = await InterestedUser
            .find()
            .populate("productId", "productName")
            .lean();
        console.log(" fetch the user", interestedUsers);
        res.status(200).json(interestedUsers);
    } catch (error) {
        console.error('Database error', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    loginAdmin,
    registerAdmin,
    getInterestedUsers,
    addInterestedUser
};



// consumer side

exports.registerConsumer = async(req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await Consumer.findOne({ email });

        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newConsumer = new Consumer({ firstName, lastName, email, password: hashedPassword });

        await newConsumer.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginConsumer = async(req, res) => {
    try {
        const { email, password } = req.body;
        const consumer = await Consumer.findOne({ email });

        if (!consumer) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, consumer.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: consumer._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, message: 'Login successful' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
const Consumer = require('../models/Consumer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Consumer

// const bcrypt = require('bcrypt');
// const Consumer = require('../models/Consumer'); // Ensure correct path

exports.registerConsumer = async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            phoneNumber, 
            addressLine1, 
            addressLine2, 
            city, 
            country, 
            state, 
            zip 
        } = req.body;

        // Check for required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        // Check if user already exists
        const existingUser = await Consumer.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new consumer with all fields
        const newConsumer = new Consumer({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            addressLine1,
            addressLine2,
            city,
            country,
            state,
            zip
        });

        await newConsumer.save();

        console.log("New Consumer:", newConsumer); // Debugging line

        return res.status(201).json({ 
            message: "User registered successfully", 
            user: {
                _id: newConsumer._id,
                firstName: newConsumer.firstName,
                lastName: newConsumer.lastName,
                email: newConsumer.email,
                phoneNumber: newConsumer.phoneNumber
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// exports.registerConsumer = async(req, res) => {
//     try {
//         console.log("Received Data:", req.body);
//         const { firstName, lastName, email, password } = req.body;

//         if (!firstName || !lastName || !email || !password) {
//             return res.status(400).json({ message: "All required fields must be filled" });
//         }

//         const existingUser = await Consumer.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newConsumer = new Consumer({
//             firstName,
//             lastName,
//             email,
//             password: hashedPassword
//         });

//         await newConsumer.save();
//         return res.status(201).json({ message: 'User registered successfully' }); // 🔥 Added return to stop execution

//     } catch (error) {
//         console.error('Registration Error:', error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// };

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
        const consumers = await Consumer.find({}, 'firstName lastName email phoneNumber');
        console.log("Fetched Consumers:", consumers); // Debugging line
        const formattedConsumers = consumers.map(consumer => ({
            _id: consumer._id,
            fullName: `${consumer.firstName} ${consumer.lastName}`,
            email: consumer.email,
            phoneNumber: consumer.phoneNumber
        }));

        console.log("Formatted Consumers:", formattedConsumers);
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
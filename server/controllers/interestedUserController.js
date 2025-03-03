const InterestedUser = require("../models/InterestedUser");

// 📌 Add Interested User
exports.addInterestedUser = async(req, res) => {
    try {
        const { userName, email, phone, product } = req.body;

        if (!userName || !email || !phone || !product) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newUser = new InterestedUser({ userName, email, phone, product });
        await newUser.save();

        res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 📌 Get All Interested Users
exports.getInterestedUsers = async(req, res) => {
    try {
        const users = await InterestedUser.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
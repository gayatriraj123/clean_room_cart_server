const Contact = require('../models/Contact');
const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables
const axios = require("axios");

// Add a new contact request
exports.addContact = async(req, res) => {
    // console.log('hii');
    try {
        const { fullName, phone, email, orderNumber, companyName, comments } = req.body;

        const contact = new Contact({
            fullName,
            phone,
            email,
            orderNumber,
            companyName,
            comments,
        });

        await contact.save();

        // SMTP transporter setup
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Replace with your SMTP server
            port: 587, // or 465 if using SSL
            secure: false, // true for 465, false for other ports
            auth: {
                user: "gayatrirajguru2002@gmail.com", // SMTP email
                pass: "wnaamjfxlmktfizc" // SMTP password
            }
        });

        // Email options
        const mailOptions = {
            // from: "gayatrirajguru2002@gmail.com", // Sender email
            from: email,
            // to: "kiran899964@gmail.com", // Recipient email
            to: "gayatrirajguru2002@gmail.com",
            subject: "New Contact Request",
            text: `You have a new contact request from ${fullName}.
                   Email: ${email}
                   Phone: ${phone}
                   Order Number: ${orderNumber}
                   Company Name: ${companyName}
                   Comments: ${comments}`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");
        res.status(201).json({ message: "Contact request submitted successfully", contact });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// Get all contact requests
exports.getContacts = async(req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a contact request by ID
exports.getContactById = async(req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact request not found' });
        }
        res.json({ message: 'Contact request fetched successfully', contact });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a contact request
exports.deleteContact = async(req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) {
            return res.status(404).json({ message: 'Contact request not found' });
        }
        res.status(200).json({ message: 'Contact request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
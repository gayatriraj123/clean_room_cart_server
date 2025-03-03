const mongoose = require('mongoose');

const ConsumerSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    country: { type: String },
    state: { type: String },
    zip: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Consumer', ConsumerSchema);
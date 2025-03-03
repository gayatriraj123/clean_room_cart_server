const mongoose = require("mongoose");

const interestedUserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    firstName: { type: String }, // Changed to optional
    lastName: { type: String }, // Changed to optional
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, default: new Date().toLocaleString() },
});

module.exports = mongoose.model("InterestedUser", interestedUserSchema);
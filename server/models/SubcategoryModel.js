const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    detailedDescription: {
        type: String,
        required: true
    },
    image: {
        type: String, // Path to the uploaded image file
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
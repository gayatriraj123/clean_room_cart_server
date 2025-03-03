const mongoose = require("mongoose");
const SubCategory = require("../models/SubcategoryModel");
const Category = require("../models/CategoryModel");
const { message } = require("statuses");

// Add Subcategory to Database
const addSubCategory = async(req, res) => {
    try {
        const { categoryId, name, shortDescription, detailedDescription } = req.body;
        const image = req.file ? req.file.path : "";

        // Check for invalid categoryId
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            console.error("Invalid categoryId:", categoryId);
            return res.status(400).json({ message: "Invalid categoryId format" });
        }

        console.log("Received Data:", { categoryId, name, shortDescription, detailedDescription, image });

        const subCategory = new SubCategory({
            categoryId: new mongoose.Types.ObjectId(categoryId), // Convert to ObjectId
            name,
            shortDescription,
            detailedDescription,
            image
        });

        await subCategory.save();
        res.status(201).json({
            subCategory,
            message: "Subcategory added successfully",
        });
    } catch (error) {
        console.error("Backend Error:", error.message);
        res.status(500).json({ message: "Error adding subcategory", error: error.message });
    }
};

//  Get all Subcategories
const getSubCategories = async(req, res) => {
    try {
        const subCategories = await SubCategory.find();
        res.json({
            subCategories,
            message: "Subcategories fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategories", error });
    }
};

//  Get Subcategories by Category Id
const getSubcategories = async(req, res) => {
    const { categoryId } = req.params; // Get categoryId from route params
    try {
        const subcategories = await SubCategory.find({ categoryId });
        res.json({
            subcategories,
            message: "Subcategories fetched successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategories", error });
    }
};

const getSubcategoryById = async(req, res) => {
    try {
        const { subcategoryId } = req.params;
        // console.log("Fetching subcategory with ID:", subcategoryId); // Debugging

        const subcategory = await SubCategory.findById(subcategoryId);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.json({ subcategory, message: "Subcategory fetched successfully" });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({ message: "Error fetching subcategory", error });
    }
}



const deleteCategory = async(req, res) => {
    try {
        const subcategoryId = req.params.id;
        const subcategory = await SubCategory.findByIdAndDelete(subcategoryId);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting subcategory" });
    }
}

const updateCategory = async(req, res) => {
    try {
        const subcategoryId = req.params.id;
        const updatedData = req.body;

        // Validate input fields here if needed
        if (!updatedData.name || !updatedData.shortDescription || !updatedData.detailedDescription) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Update subcategory
        const updatedSubcategory = await SubCategory.findByIdAndUpdate(subcategoryId, updatedData, { new: true });

        if (!updatedSubcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        res.status(200).json({ message: "Subcategory updated successfully", subcategory: updatedSubcategory });
    } catch (error) {
        console.error("Error updating subcategory:", error); // More detailed error logging
        res.status(500).json({ message: "Error updating subcategory", error: error.message });
    }
};


// Export all functions
module.exports = { addSubCategory, getSubCategories, getSubcategories, getSubcategoryById, deleteCategory, updateCategory };
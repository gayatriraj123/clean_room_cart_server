const SubProduct = require("../models/subProductModel");

exports.addSubProduct = async(req, res) => {
    try {
        const { productId, name, price, size, color } = req.body;
        if (!productId || !name || price === undefined) {
            return res.status(400).json({ message: "Product ID, name, and price are required!" });
        }
        const newSubProduct = new SubProduct({ productId, name, price, size, color });
        await newSubProduct.save();
        res.status(201).json({ message: "Subproduct added successfully!", subProduct: newSubProduct });
    } catch (error) {
        console.error("Error adding subproduct:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getSubProducts = async(req, res) => {
    try {
        const subProducts = await SubProduct.find().populate("productId").lean();
        res.status(200).json(subProducts);
    } catch (error) {
        console.error("Error fetching subproducts:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getSubProductsByProductId = async(req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) return res.status(400).json({ message: "Product ID is required" });
        const subProducts = await SubProduct.find({ productId }).populate("productId").lean();
        res.status(200).json(subProducts);
    } catch (error) {
        console.error("Error fetching subproducts by product ID:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.deleteSubProduct = async(req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Subproduct ID is required" });
        const subProduct = await SubProduct.findById(id);
        if (!subProduct) return res.status(404).json({ message: "Subproduct not found" });
        await SubProduct.findByIdAndDelete(id);
        res.status(200).json({ message: "Subproduct deleted successfully!" });
    } catch (error) {
        console.error("Error deleting subproduct:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.updateSubProduct = async(req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Subproduct ID is required" });
        const updatedSubProduct = await SubProduct.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedSubProduct) return res.status(404).json({ message: "Subproduct not found" });
        res.status(200).json({ message: "Subproduct updated successfully!", subProduct: updatedSubProduct });
    } catch (error) {
        console.error("Error updating subproduct:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
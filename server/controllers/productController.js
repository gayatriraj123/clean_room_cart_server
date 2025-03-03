const Product = require("../models/ProductModel");
const multer = require("multer");
const path = require("path");

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, ""),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ✅ Add a Product
exports.addProduct = async(req, res) => {
    try {
        let { category, subcategory, productName, price, productCode, description, size } = req.body;

        if (!Array.isArray(size)) {
            size = typeof size === "string" ? size.split(",").map(s => s.trim()).filter(Boolean) : [];
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image upload failed" });
        }

        const newProduct = new Product({
            category,
            subcategory,
            productName,
            price,
            productCode,
            description,
            size,
            image: `/uploads/${req.file.filename}`
        });

        await newProduct.save();
        res.status(201).json({ success: true, newProduct, message: "Product added successfully" });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Error adding product" });
    }
};

// ✅ Get All Products with optional filtering
exports.getProducts = async(req, res) => {
    try {
        const filter = {};
        if (req.query.categoryId) filter.category = req.query.categoryId;
        if (req.query.subcategoryId) filter.subcategory = req.query.subcategoryId;

        const products = await Product.find(filter);
        res.status(200).json({ success: true, products, message: "Products fetched successfully" });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Get Product by Subcategory ID
exports.getProductBySubId = async(req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid Subcategory ID" });
        }

        const products = await Product.find({ subcategory: id });
        res.status(200).json({ success: true, products, message: "Products fetched successfully" });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Get Product by ID
exports.getById = async(req, res) => {
    try {
        const { productId } = req.params;
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product, message: "Product fetched successfully" });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Delete a Product
exports.deleteProduct = async(req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Update a Product
exports.updateProduct = async(req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }

        if (req.body.size && typeof req.body.size === "string") {
            req.body.size = req.body.size.split(",").map(s => s.trim()).filter(Boolean);
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ success: true, updatedProduct, message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Error updating product", error });
    }
};

// ✅ Search Products for Table View
exports.getProductsForTable = async(req, res) => {
    try {
        const filter = req.query.name ? { productName: { $regex: req.query.name, $options: "i" } } : {};
        const products = await Product.find(filter).select("productName price productCode");
        res.status(200).json({ success: true, products, message: "Products fetched successfully" });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products", error });
    }
};
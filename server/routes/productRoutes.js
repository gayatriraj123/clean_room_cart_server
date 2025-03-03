const express = require("express");
const multer = require("multer");
const path = require("path");
const {
    addProduct,
    getProducts,
    getProductBySubId,
    getById,
    deleteProduct,
    updateProduct,
    getProductsForTable
} = require("../controllers/productController");

const router = express.Router();

// Multer storage setup (Ensuring correct storage path)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads")); // Store in 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Route to add a product (with image upload)
router.post("/add", upload.single("image"), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        req.body.image = req.file.filename; // ✅ Only store unique filename, not full path

        await addProduct(req, res); // Call controller function
    } catch (error) {
        res.status(500).json({ error: "Error uploading product", details: error.message });
    }
});

// Other product routes
router.get("/get", getProducts);
router.get("/get/:id", getProductBySubId);
router.get("/get-by/:productId", getById);
router.delete("/delete/:id", deleteProduct);
router.put("/update/:id", updateProduct);
router.get("/search", getProductsForTable);

module.exports = router;
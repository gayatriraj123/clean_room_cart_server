const express = require("express");
const multer = require("multer");
const path = require("path");
const { getSubcategories, addSubCategory, getSubCategories, getSubcategoryById, deleteCategory, updateCategory } = require("../controllers/subCategoryController");

// Initialize multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Path to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Add Subcategory Route
router.post("/add", upload.single("image"), addSubCategory);

// Get Subcategories Route
router.get("/get", getSubCategories);

// Get Subcategories by Category Id
router.get("/get/:categoryId", getSubcategories);

router.get("/:subcategoryId", getSubcategoryById);

router.delete("/delete/:id", deleteCategory);

router.put('/update/:id', updateCategory)




module.exports = router;
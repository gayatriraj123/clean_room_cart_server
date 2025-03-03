const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    addCategory,
    getCategories,
    getCategoryById,
    deleteCategory,
    updatedCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../uploads')); // ✅ Correct path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// Route to add a category (with file upload)
router.post('/add', upload.single('image'), async(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imagePath = `/uploads/${req.file.filename}`; // ✅ Store accessible URL
        req.body.image = imagePath; // Attach correct path

        await addCategory(req, res); // Call controller
    } catch (error) {
        res.status(500).json({ error: 'Error uploading category' });
    }
});

// Other routes
router.get('/get', getCategories);
router.get('/:id', getCategoryById);
router.delete('/delete/:id', deleteCategory);
router.put('/update/:id', updatedCategory);

module.exports = router;
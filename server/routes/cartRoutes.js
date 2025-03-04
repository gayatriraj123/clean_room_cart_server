const express = require("express");
const { addCart, getCart, updateQuantity, deleteCart } = require('../controllers/cartController')

const router = express.Router();

// Add cart
router.post("/add", addCart);

// Get cart
router.get("/get/:userId", getCart);

// Update quantity
router.put("/update/:userId/:productId/:size/:color", updateQuantity);

// Delete cart item
router.delete("/remove/:userId/:productId", deleteCart);

module.exports = router;
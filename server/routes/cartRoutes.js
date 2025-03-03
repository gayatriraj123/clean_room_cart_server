const express = require("express");
const { addCart, getCart, deleteCart } = require('../controllers/cartController')

const router = express.Router();

//add cart
router.post("/add", addCart);

//get cart 
router.get("/get", getCart);

//delete cart item
router.delete("/remove/:userId/:productId", deleteCart);

module.exports = router;
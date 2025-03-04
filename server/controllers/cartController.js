const express = require("express");
const Cart = require("../models/CartModel");

const router = express.Router();

// ✅ Add item to cart
exports.addCart = async(req, res) => {
    try {
        const { userId, productId, name, image, price, quantity, size, color } = req.body;

        const cart = (await Cart.findOne({ userId })) || new Cart({ userId, items: [] });

        const existingItem = cart.items.find(item => item.productId.toString() === productId && item.size === size && item.color === color);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, name, image, price, quantity, size, color });
        }

        await cart.save();
        res.status(201).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get user's cart items
exports.getCart = async(req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).json({ message: "User ID is required" });

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        return res.status(200).json(cart.items);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update quantity
exports.updateQuantity = async(req, res) => {
    try {
        const { userId, productId, size, color } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.size === size && item.color === color);
        if (itemIndex === -1) return res.status(404).json({ message: "Item not found in cart" });

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Remove item from cart
exports.deleteCart = async(req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => !(item.productId.toString() === productId));
        await cart.save();

        res.status(200).json({ success: true, cart, message: 'Delete cart item successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
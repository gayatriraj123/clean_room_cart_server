// routes/subProductRoutes.js
const express = require("express");
const {
    addSubProduct,
    getSubProducts,
    getSubProductsByProductId,
    deleteSubProduct,
    updateSubProduct
} = require("../controllers/subProductController");

const router = express.Router();

router.post("/add", addSubProduct);
router.get("/get", getSubProducts);
router.get("/product/:productId", getSubProductsByProductId);
router.delete("/delete/:id", deleteSubProduct);
router.put("/update/:id", updateSubProduct);

module.exports = router;
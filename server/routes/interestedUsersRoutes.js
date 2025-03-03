const express = require("express");
const router = express.Router();
const { addInterestedUser, getInterestedUsers } = require("../controllers/interestedUserController");

// 📌 Route to add interested user
router.post("/add", addInterestedUser);

// 📌 Route to get all interested users
router.get("/", getInterestedUsers);

module.exports = router;
const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getInterestedUsers, addInterestedUser } = require('../controllers/adminController');

router.post('/register', registerAdmin);

router.post('/login', loginAdmin);

router.get("/get/interested-users", getInterestedUsers);

router.post("/add/interested-users", addInterestedUser);
module.exports = router;
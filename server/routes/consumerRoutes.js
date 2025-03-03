const express = require('express');
const { registerConsumer, loginConsumer, getConsumers } = require('../controllers/consumerController');

const router = express.Router();

router.post('/signup', registerConsumer);
router.post('/login', loginConsumer);
router.get('/list', getConsumers); // ✅ New route to fetch consumers

module.exports = router;
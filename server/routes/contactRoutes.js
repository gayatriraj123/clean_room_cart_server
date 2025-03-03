const express = require('express');
const { addContact, getContacts, getContactById, deleteContact } = require('../controllers/contactController');

const router = express.Router();

// Route to submit a contact query
router.post('/submit', addContact); // 🔹 Changed submitQuery → addContact

// Route to get all submitted queries
router.get('/get', getContacts); // 🔹 Changed getAllQueries → getContacts

// Route to get a single contact query by ID
router.get('/:id', getContactById);

// Route to delete a contact query
router.delete('/:id', deleteContact);

module.exports = router;
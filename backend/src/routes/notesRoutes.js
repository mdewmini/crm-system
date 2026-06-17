const express = require('express');
const router = express.Router();
const { deleteNote } = require('../controllers/notesController');
const authMiddleware = require('../middleware/auth');

router.delete('/:id', authMiddleware, deleteNote);

module.exports = router;
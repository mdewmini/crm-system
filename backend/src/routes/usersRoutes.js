const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/usersController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getUsers);

module.exports = router;
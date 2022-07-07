const express = require('express');
const { login, signup, logout } = require('../controllers/userController');

const router = express.Router();

module.exports = router;

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);

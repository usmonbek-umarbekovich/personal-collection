const express = require('express');
const { login, signup, logout } = require('../controllers/authController');

const router = express.Router();

module.exports = router;

router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/logout').post(logout);

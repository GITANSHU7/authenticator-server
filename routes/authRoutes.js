const express = require('express');
const router = express.Router();

const authController = require('../controller/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/signout', authController.signout);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
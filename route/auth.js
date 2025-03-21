const express = require('express');
const validate = require('../middleware/validate');
const authValidation = require('../validation/auth');
const authController = require('../controller/auth/AuthController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);

module.exports = router;
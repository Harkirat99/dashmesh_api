const express = require('express');
const validate = require('../middleware/validate');
const customerValidation = require('../validation/customer');
const customerController = require('../controller/customer/CustomerController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(customerValidation.create), customerController.create);
router.get('/', auth(), customerController.index);
router.get('/:id', auth(), customerController.detail);

module.exports = router;

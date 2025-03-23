const express = require('express');
const validate = require('../middleware/validate');
const transactionValidation = require('../validation/transaction');
const transactionController = require('../controller/transaction/TransactionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(transactionValidation.create), transactionController.create);
// router.get('/', auth(), transactionController.index);

module.exports = router;
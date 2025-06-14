const express = require('express');
const validate = require('../middleware/validate');
const transactionValidation = require('../validation/transaction');
const transactionController = require('../controller/transaction/TransactionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(transactionValidation.create), transactionController.create);
router.get('/', auth(), transactionController.index);
router.get('/global', auth(), transactionController.globalTransactions);
router.patch('/:transactionId', auth(), validate(transactionValidation.update), transactionController.update);
router.delete('/:transactionId', auth(), validate(transactionValidation.deleteTransaction), transactionController.remove);

module.exports = router;
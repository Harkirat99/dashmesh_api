const express = require('express');
const validate = require('../middleware/validate');
const expenseValidation = require('../validation/expense');
const ExpenseController = require('../controller/expenses/ExpenseController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(expenseValidation.create), ExpenseController.create);
router.get('/', auth(), ExpenseController.index);

module.exports = router;
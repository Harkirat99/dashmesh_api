const express = require('express');
const validate = require('../middleware/validate');
const stockValidation = require('../validation/stock');
const StockController = require('../controller/stock/StockController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(stockValidation.create), StockController.create);
router.get('/', auth(), StockController.index);

module.exports = router;
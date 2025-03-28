const express = require('express');
const validate = require('../middleware/validate');
const orderValidation = require('../validation/order');
const OrderController = require('../controller/order/OrderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(orderValidation.create), OrderController.create);

router.get('/', auth(), OrderController.index);
router.get('/global', auth(), OrderController.globalOrders);

module.exports = router;
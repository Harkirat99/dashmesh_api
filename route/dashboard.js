const express = require('express');
const statsController = require('../controller/dashboard/StatsController');
const ChartsController = require('../controller/dashboard/ChartsController');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth(), statsController.stats);
router.get('/orders', auth(), ChartsController.orders);

module.exports = router;
const express = require('express');
const statsController = require('../controller/dashboard/StatsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth(), statsController.stats);

module.exports = router;
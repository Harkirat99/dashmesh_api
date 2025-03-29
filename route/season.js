const express = require('express');
const validate = require('../middleware/validate');
const seasonValidation = require('../validation/season');
const SeasonController = require('../controller/season/SeasonController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(seasonValidation.create), SeasonController.create);
router.get('/', auth(), SeasonController.index);

module.exports = router;
const express = require('express');
const validate = require('../middleware/validate');
const productValidation = require('../validation/product');
const ProductController = require('../controller/products/ProductController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(productValidation.create), ProductController.create);
router.get('/', auth(), ProductController.index);
router.get('/dropdown', auth(), ProductController.dropdown);

module.exports = router;
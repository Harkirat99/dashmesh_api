const express = require('express');
const validate = require('../middleware/validate');
const productValidation = require('../validation/product');
const ProductController = require('../controller/products/ProductController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(productValidation.create), ProductController.create);
router.get('/', auth(), ProductController.index);
router.get('/dropdown', auth(), ProductController.dropdown);
router.patch('/:productId', auth(), validate(productValidation.update), ProductController.update);
router.delete('/:productId', auth(), validate(productValidation.deleteProduct), ProductController.remove);

module.exports = router;
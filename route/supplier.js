const express = require('express');
const validate = require('../middleware/validate');
const supplierValidation = require('../validation/supplier');
const SupplierController = require('../controller/supplier/SupplierController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth(), validate(supplierValidation.create), SupplierController.create);
router.get('/', auth(), SupplierController.index);
router.patch('/:id', auth(), validate(supplierValidation.update), SupplierController.update);
router.get('/:id', auth(), SupplierController.detail);

module.exports = router;
const express = require('express');
const { addSupplier, updateSupplier, getSuppliers } = require('../controllers/supplierController');
const router = express.Router();

router.post('/', addSupplier);
router.put('/:id', updateSupplier);
router.get('/', getSuppliers);

module.exports = router;

const express = require('express');
const { addSupplier, updateSupplier, getSuppliers } = require('../controllers/supplierController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

//protected
router.post('/',protect,addSupplier);
router.put('/:id', protect,updateSupplier);

//public
router.get('/', getSuppliers);

module.exports = router;

const express = require('express');
const { addSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

//protected
router.post('/',protect,addSupplier);
router.put('/:id', protect,updateSupplier);
router.delete('/:id', protect, deleteSupplier);

module.exports = router;

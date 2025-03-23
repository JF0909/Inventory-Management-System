const express = require('express');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

//public
router.get('/', getProducts); 
router.get('/:id', getProductById); 
//protected
router.post('/', protect, addProduct); 
router.put('/:id',protect, updateProduct); 
router.delete('/:id', protect, deleteProduct);

module.exports = router;

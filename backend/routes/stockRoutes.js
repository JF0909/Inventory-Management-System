const express = require('express');
const { createStockLevel, getStockLevels, getStockByProductId, updateStockLevel, deleteStock } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect,getStockLevels);
router.get('/:productId',protect, getStockByProductId);
router.post('/', protect, createStockLevel); 
router.put('/:productId', protect,updateStockLevel);
router.delete('/:productId', protect,deleteStock);

module.exports = router;

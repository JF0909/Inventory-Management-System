const express = require('express');
const { getStockLevels, getStockByProductId, updateStockLevel, deleteStock } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getStockLevels);
router.get('/:productId', getStockByProductId);

//protected
router.put('/:productId', protect,updateStockLevel);
router.delete('/:productId', protect,deleteStock);

module.exports = router;

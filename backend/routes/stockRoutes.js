const express = require('express');
const { getStockLevels, getStockByProductId, updateStockLevel, deleteStock } = require('../controllers/stockController');

const router = express.Router();

router.get('/', getStockLevels);
router.get('/:productId', getStockByProductId);
router.put('/:productId', updateStockLevel);
router.delete('/:productId', deleteStock);

module.exports = router;

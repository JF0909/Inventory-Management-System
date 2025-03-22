const Stock = require('../models/Stock');

// Get all stock levels
// match Jira user story 4 track stock levels
const getStockLevels = async (req, res) => {
    try {
        const stockLevels = await Stock.find();
        res.status(200).json(stockLevels);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Get stock level by product ID
const getStockByProductId = async (req, res) => {
    try {
        const stock = await Stock.findOne({ productId: req.params.productId });
        if (!stock) {
            return res.status(404).json({ message: "Stock not found for this product" });
        }
        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Update stock level
const updateStockLevel = async (req, res) => {
    try {
        const { quantity } = req.body;
        const stock = await Stock.findOne({ productId: req.params.productId });

        if (!stock) {
            return res.status(404).json({ message: "Stock not found for this product" });
        }

        stock.quantity = quantity || stock.quantity;
        await stock.save();
        res.status(200).json({ message: "Stock level updated", stock });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Delete stock entry (if a product is removed)
const deleteStock = async (req, res) => {
    try {
        const stock = await Stock.findOne({ productId: req.params.productId });
        if (!stock) return res.status(404).json({ message: "Stock not found" });

        await stock.deleteOne();
        res.status(200).json({ message: "Stock entry deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

module.exports = { getStockLevels, getStockByProductId, updateStockLevel, deleteStock };

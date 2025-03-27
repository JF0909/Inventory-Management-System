const Stock = require('../models/Stock');

//create stocklevel
const createStockLevel = async (req, res) => {
    const { product, supplier,quantity, reorderLevel } = req.body;
  
    try {
      const newStockLevel = new Stock({
        product,
        supplier,
        quantity,
        reorderLevel
      });
  
      
      await newStockLevel.save();
  
      res.status(201).json({ message: 'Stocklevel created successfully', newStockLevel });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Get all stock levels
const getStockLevels = async (req, res) => {
    try {
        const stockLevels = await Stock.find().populate('product supplier');
        res.status(200).json(stockLevels);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Get stock level by product ID
const getStockByProductId = async (req, res) => {
    try {
        const stock = await Stock.find({ product: req.params.productId }).populate('supplier');
        if (!stock || stock.length === 0) {
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
    const stock = await Stock.findById(req.params.id);
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Update stocklevel
    stock.quantity = req.body.quantity;
    stock.reorderLevel = req.body.reorderLevel;
    await stock.save();
    
    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete stock entry (if a product is removed)
const deleteStock = async (req, res) => {
    try {
        const stock = await Stock.findOne({ product: req.params.productId });
        if (!stock) return res.status(404).json({ message: "Stock not found" });

        await stock.deleteOne();
        res.status(200).json({ message: "Stock entry deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

module.exports = { createStockLevel, getStockLevels, getStockByProductId, updateStockLevel, deleteStock };

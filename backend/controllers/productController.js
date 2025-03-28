const Product = require('../models/Product');

//Add Product
const addProduct = async (req,res) => {
    const { name, category, price, stockLevel} = req.body;
    try{
        const product = await Product.create({ userId: req.user.id, name, category, price, stockLevel });
        res.status(201).json(product);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ userId: req.user.id });
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: "Error: " + error.message });
    }
};


// Get the specific product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error: " + error.message });
    }
};


// Update product info
const updateProduct = async (req, res) => {
    const { name, category, price, stockLevel} = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Update 
        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.stockLevel = stockLevel || product.stockLevel;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error: " + error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        
        await product.remove();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };



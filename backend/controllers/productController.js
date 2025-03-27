const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
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


const addProduct = async (req,res) => {
    try{
        const { name, category, price, stockLevel} = req.body;
        if(!name || ! category || !price || !stockLevel){
            return res.status(400).json({ message: "fields are required "});
        }
        
        const product = new Product ({ name, category, price, stockLevel});
        await product.save();
        res.status(201).json({ message: "Successfully created the product", product});

    }catch (error) {
        res.status(500).json({ message: "Error" + error.message });
    }
}

// Update product info
const updateProduct = async (req, res) => {
    try {
        const { name, category, price, stockLevel} = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update 
        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.stockLevel = stockLevel || product.stockLevel;

        await product.save();
        res.status(200).json({ message: "Successfully updated the product", product });
    } catch (error) {
        res.status(500).json({ message: "Error: " + error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await product.deleteOne();
        res.status(200).json({ message: "Successfully deleted the product." });
    } catch (error) {
        res.status(500).json({ message: "Error: " + error.message });
    }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };



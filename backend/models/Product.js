const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stockLevel: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);

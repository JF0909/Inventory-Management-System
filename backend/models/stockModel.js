const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    reorderLevel: { type: Number, required: true }
});

module.exports = mongoose.model('Stock', stockSchema);

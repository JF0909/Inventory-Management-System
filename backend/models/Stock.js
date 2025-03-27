const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true }, // ✅ 关联供应商
    quantity: { type: Number, required: true },
    reorderLevel: { type: Number, required: true }  
});

module.exports = mongoose.model('Stock', stockSchema);

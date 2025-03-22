const Supplier = require('../models/Supplier');

// Get all suppliers
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Get supplier by ID
const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Add a new supplier
const addSupplier = async (req, res) => {
    try {
        const { name, contactPerson, phone, email, address } = req.body;

        if (!name || !contactPerson || !phone || !email || !address) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const supplier = new Supplier({ name, contactPerson, phone, email, address });
        await supplier.save();
        res.status(201).json({ message: "Supplier added successfully", supplier });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Update supplier details
const updateSupplier = async (req, res) => {
    try {
        const { name, contactPerson, phone, email, address } = req.body;
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        supplier.name = name || supplier.name;
        supplier.contactPerson = contactPerson || supplier.contactPerson;
        supplier.phone = phone || supplier.phone;
        supplier.email = email || supplier.email;
        supplier.address = address || supplier.address;

        await supplier.save();
        res.status(200).json({ message: "Supplier updated successfully", supplier });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Delete a supplier
const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: "Supplier not found" });

        await supplier.deleteOne();
        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

module.exports = { getSuppliers, getSupplierById, addSupplier, updateSupplier, deleteSupplier };

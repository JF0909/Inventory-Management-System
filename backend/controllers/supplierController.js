const Supplier = require('../models/Supplier');

//add supplier
const addSupplier = async(req,res) => {
  const {name,contact,address} = req.body
  try {
    const supplier = new Supplier({ 
      name, 
      contact, 
      address, 
    });
    await supplier.save();
    res.status(201).json(supplier);  
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};
  

//updatesupplier
const updateSupplier = async (req, res) => {
  const {name,contact,address} = req.body
  try{
    const supplier = await Supplier.findById(req.params.id);
    if(!supplier){
      return res.status(404).json({mesage:"Supplier not found"});
    }
    supplier.name = name || supplier.name;
    supplier.contact = contact || supplier.contact;
    supplier.address = address || supplier.address;

    await supplier.save();
    res.status(200).json(supplier);
  }catch (error) {
    res.status(500).josn({ message: error.message});
  }
}

//delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    await supplier.remove();
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addSupplier, updateSupplier, deleteSupplier };

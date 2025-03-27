const Supplier = require('../models/Supplier');

//add supplier
const addSupplier = async(req,res) => {
  const {title,description} = req.body
  try{
    const supplier = new Supplier({ title, description, userId:req.user.id,})
    await supplier.save();
    res.status(201).json(supplier);
  }catch (error){
    res.status(500).json({message: error.message });
  }

};

//updatesupplier
const updateSupplier = async (req, res) => {
  const{title,description,} = req.body;
  try{
    const supplier = await Supplier.findById(req.params.id);
    if(!supplier){
      return res.status(404).json({mesage:"Supplier not found"});
    }
    supplier.title = title || supplier.title;
    supplier.description = description || supplier.description;

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

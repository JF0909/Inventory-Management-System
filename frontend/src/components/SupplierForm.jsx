import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const SupplierForm = ({ editingSupplier, setEditingSupplier, setSuppliers, suppliers }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    phone: '',
  });

  useEffect(() => {
    if (editingSupplier) {
      setFormData({
        name: editingSupplier.name,
        contactEmail: editingSupplier.contactEmail,
        phone: editingSupplier.phone,
      });
    }
  }, [editingSupplier]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingSupplier) {
        await axiosInstance.put(`/api/suppliers/${editingSupplier._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSuppliers(suppliers.map((supplier) =>
          supplier._id === editingSupplier._id ? { ...supplier, ...formData } : supplier
        ));
        alert('Supplier updated successfully');
      } else {
        const response = await axiosInstance.post('/api/suppliers', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSuppliers([...suppliers, response.data]);
        alert('Supplier added successfully');
      }
      setEditingSupplier(null);
      setFormData({ name: '', contactEmail: '', phone: '' });
    } catch (error) {
      alert('Failed to save supplier');
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Supplier Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Contact Email"
          value={formData.contactEmail}
          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </form>
    </div>
  );
};

export default SupplierForm;



import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StockLevelForm = ({ editingStockLevel, setEditingStockLevel, setStockLevels, stockLevels, products }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
  });

  useEffect(() => {
    if (editingStockLevel) {
      setFormData({
        product: editingStockLevel.product._id,
        quantity: editingStockLevel.quantity,
      });
    }
  }, [editingStockLevel]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStockLevel) {
        await axiosInstance.put(`/api/stocklevels/${editingStockLevel._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStockLevels(stockLevels.map((stockLevel) =>
          stockLevel._id === editingStockLevel._id ? { ...stockLevel, ...formData } : stockLevel
        ));
        alert('Stock Level updated successfully');
      } else {
        const response = await axiosInstance.post('/api/stocklevels', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStockLevels([...stockLevels, response.data]);
        alert('Stock Level added successfully');
      }
      setEditingStockLevel(null);
      setFormData({ product: '', quantity: '' });
    } catch (error) {
      alert('Failed to save stock level');
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{editingStockLevel ? 'Edit Stock Level' : 'Add Stock Level'}</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>{product.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {editingStockLevel ? 'Update Stock Level' : 'Add Stock Level'}
        </button>
      </form>
    </div>
  );
};

export default StockLevelForm;
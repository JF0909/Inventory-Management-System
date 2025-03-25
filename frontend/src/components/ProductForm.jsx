//add or delete product
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ProductForm = ({ editingProduct, setEditingProduct, setProducts, products }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
      });
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await axiosInstance.put(`/api/products/${editingProduct._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts(products.map((product) => (product._id === editingProduct._id ? { ...product, ...formData } : product)));
        alert('Product updated successfully');
      } else {
        const response = await axiosInstance.post('/api/products', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts([...products, response.data]);
        alert('Product added successfully');
      }
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '' });
    } catch (error) {
      alert('Failed to save product');
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
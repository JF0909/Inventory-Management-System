import { useState, useEffect } from 'react';
//import axiosInstance from '../axiosConfig';
import StockLevelForm from '../components/StockLevelForm';
import StockLevelList from '../components/StockLevelList';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StockPage = () => {
  const { user } = useAuth();
  const [stockLevels, setStockLevels] = useState([]);
  const [editingStockLevel, setEditingStockLevel] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchStockLevels = async () => {
      try {
        const response = await axiosInstance.get('/api/stocklevels', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setStockLevels(response.data);
      } catch (error) {
        alert('Failed to fetch stock levels');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts(response.data);
      } catch (error) {
        alert('Failed to fetch products');
      }
    };

    fetchStockLevels();
    fetchProducts();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <StockLevelForm
        editingStockLevel={editingStockLevel}
        setEditingStockLevel={setEditingStockLevel}
        setStockLevels={setStockLevels}
        stockLevels={stockLevels}
        products={products}
      />
      <StockLevelList
        stockLevels={stockLevels}
        setStockLevels={setStockLevels}
        setEditingStockLevel={setEditingStockLevel}
      />
    </div>
  );
};

export default StockPage;
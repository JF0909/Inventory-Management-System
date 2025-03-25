import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StockLevelList = ({ stockLevels, setStockLevels, setEditingStockLevel }) => {
  const { user } = useAuth();

  const handleDelete = async (stockLevelId) => {
    try {
      await axiosInstance.delete(`/api/stocklevels/${stockLevelId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStockLevels(stockLevels.filter((stockLevel) => stockLevel._id !== stockLevelId));
    } catch (error) {
      alert('Failed to delete stock level.');
    }
  };

  return (
    <div>
      {stockLevels.map((stockLevel) => (
        <div key={stockLevel._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{stockLevel.product.name}</h2>
          <p>Current Stock: {stockLevel.quantity}</p>
          <p className="text-sm text-gray-500">Last Updated: {new Date(stockLevel.updatedAt).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingStockLevel(stockLevel)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(stockLevel._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockLevelList;
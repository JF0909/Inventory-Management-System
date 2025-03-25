import { createContext, useState, useContext } from 'react';
import axiosInstance from '../axiosConfig';
const StockContext = createContext();

export const useStock = () => useContext(StockContext);

export const StockProvider = ({ children }) => {
  const [stock, setStock] = useState([]);

  const fetchStock = async () => {
    try {
      const response = await axiosInstance.get('/api/stock');
      setStock(response.data);
    } catch (error) {
      console.error('Error fetching stock:', error);
    }
  };

  return (
    <StockContext.Provider value={{ stock, fetchStock }}>
      {children}
    </StockContext.Provider>
  );
};

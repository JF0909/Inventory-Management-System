// src/context/SupplierContext.js
import React, { createContext, useState, useContext } from 'react';

const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);

  // Function to add suppliers (you can expand this as needed)
  const addSupplier = (supplier) => {
    setSuppliers([...suppliers, supplier]);
  };

  return (
    <SupplierContext.Provider value={{ suppliers, addSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => useContext(SupplierContext);
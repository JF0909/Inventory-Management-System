import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import SupplierForm from '../components/SupplierForm';
import SupplierList from '../components/SupplierList';
import { useAuth } from '../context/AuthContext';

const SuppliersPage = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axiosInstance.get('/api/suppliers', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSuppliers(response.data);
      } catch (error) {
        alert('Failed to fetch suppliers');
      }
    };

    fetchSuppliers();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <SupplierForm
        suppliers={suppliers}
        setSuppliers={setSuppliers}
        editingSupplier={editingSupplier}
        setEditingSupplier={setEditingSupplier}
      />
      <SupplierList
        suppliers={suppliers}
        setSuppliers={setSuppliers}
        setEditingSupplier={setEditingSupplier}
      />
    </div>
  );
};

export default SuppliersPage;
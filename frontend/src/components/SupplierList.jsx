import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const SupplierList = ({ suppliers, setSuppliers, setEditingSupplier }) => {
  const { user } = useAuth();

  const handleDelete = async (supplierId) => {
    try {
      await axiosInstance.delete(`/api/suppliers/${supplierId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuppliers(suppliers.filter((supplier) => supplier._id !== supplierId));
    } catch (error) {
      alert('Failed to delete supplier.');
    }
  };

  return (
    <div>
      {suppliers.map((supplier) => (
        <div key={supplier._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{supplier.name}</h2>
          <p>{supplier.contactEmail}</p>
          <p className="text-sm text-gray-500">Phone: {supplier.phone}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingSupplier(supplier)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(supplier._id)}
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

export default SupplierList;
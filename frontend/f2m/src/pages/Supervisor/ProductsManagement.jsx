import { useEffect, useState } from "react";
import { getAllProducts, updateProductVolume, deleteProduct } from "../../services/ProductsService";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [volumeUpdates, setVolumeUpdates] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadProducts() {
      const data = await getAllProducts();
      setProducts(data);
    }
    loadProducts();
  }, []);

  const handleVolumeChange = (id, value) => {
    setVolumeUpdates(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (id) => {
    await updateProductVolume(id, volumeUpdates[id]);
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, volume: volumeUpdates[id] } : p
      )
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ✅ Search filter
  const filteredProducts = products.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {/* ✅ Search Input */}
      <input
        type="text"
        placeholder="Search by product name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>Name</th>
            <th>Volume</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={volumeUpdates[p.id] ?? p.volume}
                  onChange={e => handleVolumeChange(p.id, e.target.value)}
                  className="border p-1 w-20"
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleUpdate(p.id)}
                  className="bg-blue-500 text-white px-2 rounded"
                >
                  Update
                </button>
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
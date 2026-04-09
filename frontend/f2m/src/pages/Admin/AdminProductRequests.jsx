import { useEffect, useState } from "react";
import {
  getAllPendingProducts,
  updateProductStatus
} from "../../services/api";

export default function AdminProductRequests() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getAllPendingProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const handleApprove = async (id) => {
    await updateProductStatus(id, "APPROVED");
    loadData();
  };

  const handleReject = async (id) => {
    await updateProductStatus(id, "REJECTED");
    loadData();
  };

  // ✅ Search filter (name + category)
  const filteredProducts = products.filter(p =>
    (p.productName || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.productCategory || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Pending Product Requests
      </h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by product or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-6 border rounded 
        bg-white text-black border-gray-300
        dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      {/* 📊 Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border border-gray-300 dark:border-gray-700">

          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border dark:border-gray-700">Name</th>
              <th className="px-4 py-2 border dark:border-gray-700">Category</th>
              <th className="px-4 py-2 border dark:border-gray-700">Price (₹/kg)</th>
              <th className="px-4 py-2 border dark:border-gray-700">Quantity</th>
              <th className="px-4 py-2 border dark:border-gray-700">Status</th>
              <th className="px-4 py-2 border dark:border-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.id}
                className="text-center border-t dark:border-gray-700 
                hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 border dark:border-gray-700">
                  {p.productName}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  {p.productCategory}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  ₹ {p.pricePerKg}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  {p.quantityAvailable}
                </td>

                {/* ✅ Status Badge */}
                <td className="px-4 py-2 border dark:border-gray-700 font-semibold">
                  {p.status}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700 space-x-2">
                  <button
                    onClick={() => handleApprove(p.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 text-gray-500 dark:text-gray-400 text-center"
                >
                  No pending products found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
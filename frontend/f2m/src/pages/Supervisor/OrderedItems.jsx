import { useEffect, useState } from "react";
import { getPendingItems, approveItem, rejectItem } from "../../services/api";

export default function OrderedItems() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getPendingItems();
      setItems(data || []);
    } catch (err) {
      console.error("Error loading items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to approve item");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to reject item");
    }
  };

  const filteredItems = items.filter(i =>
    (i.productName || "").toLowerCase().includes(search.toLowerCase()) ||
    (i.farmName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition">

      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Pending Order Items (Supervisor)
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search product or farmer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 
                   text-gray-800 dark:text-gray-200
                   p-2 mb-4 w-full rounded 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* LOADING */}
      {loading && (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredItems.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300">No pending items</p>
      )}

      {/* TABLE */}
      {!loading && filteredItems.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">

            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr className="text-gray-800 dark:text-gray-200">
                <th className="p-3 border border-gray-300 dark:border-gray-700">Order ID</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Product</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Farmer</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Qty</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Price</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map(item => (
                <tr
                  key={item.id}
                  className="text-center border border-gray-300 dark:border-gray-700 
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >

                  <td className="p-3 text-gray-800 dark:text-gray-200">{item.orderId}</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">{item.productName}</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">{item.farmName}</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">{item.quantity}</td>
                  <td className="p-3 text-gray-800 dark:text-gray-200">₹ {item.price}</td>

                  <td className="p-3 flex gap-2 justify-center">

                    <button
                      onClick={() => handleApprove(item.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Reject
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}
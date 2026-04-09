import { useEffect, useState } from "react";
import {
  getOrderedItems,
  completeItem,
  cancelItem
} from "../../../services/api";

export default function OrderedItemRequests() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getOrderedItems();
      setItems(data);
    } catch (err) {
      console.error("Failed to load items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    setActionLoading(id);
    try {
      await completeItem(id);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    setActionLoading(id);
    try {
      await cancelItem(id);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Search filter
  const filteredItems = items.filter(i =>
    (i.productName || "").toLowerCase().includes(search.toLowerCase()) ||
    (i.farmName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Ordered Item Requests
      </h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by product or farm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-6 border rounded 
        bg-white text-black border-gray-300
        dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      {/* 📊 Table */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filteredItems.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No ordered items
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border border-gray-300 dark:border-gray-700">

            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 border dark:border-gray-700">ID</th>
                <th className="px-4 py-2 border dark:border-gray-700">Order ID</th>
                <th className="px-4 py-2 border dark:border-gray-700">Product</th>
                <th className="px-4 py-2 border dark:border-gray-700">Farm</th>
                <th className="px-4 py-2 border dark:border-gray-700">Quantity</th>
                <th className="px-4 py-2 border dark:border-gray-700">Price</th>
                <th className="px-4 py-2 border dark:border-gray-700">Status</th>
                <th className="px-4 py-2 border dark:border-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="text-center border-t dark:border-gray-700 
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-2 border dark:border-gray-700">{item.id}</td>
                  <td className="px-4 py-2 border dark:border-gray-700">{item.orderId}</td>
                  <td className="px-4 py-2 border dark:border-gray-700">{item.productName}</td>
                  <td className="px-4 py-2 border dark:border-gray-700">{item.farmName}</td>
                  <td className="px-4 py-2 border dark:border-gray-700">{item.quantity}</td>
                  <td className="px-4 py-2 border dark:border-gray-700">₹ {item.price}</td>

                  {/* ✅ Status Badge */}
                  <td className="px-4 py-2 border dark:border-gray-700 font-semibold">
                    {item.status}
                  </td>

                  <td className="px-4 py-2 border dark:border-gray-700 space-x-2">

                    {item.status === "ORDERED" ? (
                      <>
                        <button
                          onClick={() => handleComplete(item.id)}
                          disabled={actionLoading === item.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          {actionLoading === item.id ? "Processing..." : "Complete"}
                        </button>

                        <button
                          onClick={() => handleCancel(item.id)}
                          disabled={actionLoading === item.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                        >
                          {actionLoading === item.id ? "Processing..." : "Cancel"}
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        No Action
                      </span>
                    )}

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
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/order-items";

export default function AdminOrderRequests() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");

  // ✅ AUTH HEADERS
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // ✅ FETCH PENDING ORDERS
  const fetchPendingOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/admin/pending-items`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setOrders(data);

    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ APPROVE
  const handleApprove = async (id) => {
    setActionLoading(id);

    try {
      const res = await fetch(`${API_URL}/${id}/approve`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Approve failed");

      fetchPendingOrders();

    } catch (err) {
      console.error(err);
      alert("Error approving order");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ REJECT
  const handleReject = async (id) => {
    setActionLoading(id);

    try {
      const res = await fetch(`${API_URL}/${id}/reject`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Reject failed");

      fetchPendingOrders();

    } catch (err) {
      console.error(err);
      alert("Error rejecting order");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // ✅ Search filter
  const filteredOrders = orders.filter(o =>
    (o.productName || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.farmName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Pending Order Requests
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
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No pending requests
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border border-gray-300 dark:border-gray-700">

            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 border dark:border-gray-700">Order ID</th>
                <th className="px-4 py-2 border dark:border-gray-700">Product</th>
                <th className="px-4 py-2 border dark:border-gray-700">Farm</th>
                <th className="px-4 py-2 border dark:border-gray-700">Quantity</th>
                <th className="px-4 py-2 border dark:border-gray-700">Status</th>
                <th className="px-4 py-2 border dark:border-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((item) => (
                <tr
                  key={item.id}
                  className="text-center border-t dark:border-gray-700 
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-2 border dark:border-gray-700">
                    {item.orderId}
                  </td>

                  <td className="px-4 py-2 border dark:border-gray-700">
                    {item.productName}
                  </td>

                  <td className="px-4 py-2 border dark:border-gray-700">
                    {item.farmName}
                  </td>

                  <td className="px-4 py-2 border dark:border-gray-700">
                    {item.quantity}
                  </td>

                  <td className="px-4 py-2 border dark:border-gray-700 font-semibold">
                    {item.status}
                  </td>

                  <td className="px-4 py-2 border dark:border-gray-700 space-x-2">

                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={actionLoading === item.id}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      {actionLoading === item.id ? "Processing..." : "Approve"}
                    </button>

                    <button
                      onClick={() => handleReject(item.id)}
                      disabled={actionLoading === item.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      {actionLoading === item.id ? "Processing..." : "Reject"}
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
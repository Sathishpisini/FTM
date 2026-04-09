import { useEffect, useState } from "react";
import { getSupervisorPendingProducts, updateProductStatus } from "../../services/api";

export default function ProductRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadRequests() {
      const data = await getSupervisorPendingProducts();
      setRequests(data);
    }
    loadRequests();
  }, []);

  const handleApprove = async (id) => {
    await updateProductStatus(id, "APPROVED");
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleReject = async (id) => {
    await updateProductStatus(id, "REJECTED");
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  // ✅ SEARCH (farmer farmName + productName)
  const filteredRequests = requests.filter(r => {
    
    const productName = r.productName || "";

    return (
      
      productName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Product Requests
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by product name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 
                   text-gray-800 dark:text-gray-200
                   p-2 mb-4 w-full rounded 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">

          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border text-gray-800 dark:text-gray-200">
                Farmer ID
              </th>

              <th className="px-4 py-2 border text-gray-800 dark:text-gray-200">
                Product Name
              </th>

              <th className="px-4 py-2 border text-gray-800 dark:text-gray-200">
                Quantity Available
              </th>

              <th className="px-4 py-2 border text-gray-800 dark:text-gray-200">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No requests found
                </td>
              </tr>
            ) : (
              filteredRequests.map(r => (
                <tr key={r.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition">

                  {/* Farmer Id */}
                  <td className="border px-4 py-2 text-gray-800 dark:text-gray-200">
                    {r.farmerId || "N/A"}
                  </td>

                  {/* Product Name */}
                  <td className="border px-4 py-2 text-gray-800 dark:text-gray-200">
                    {r.productName || "N/A"}
                  </td>

                  {/* Quantity */}
                  <td className="border px-4 py-2 text-gray-800 dark:text-gray-200">
                    {r.quantityAvailable ?? "N/A"}
                  </td>

                  {/* Actions */}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(r.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
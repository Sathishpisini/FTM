import { useEffect, useState } from "react";
import { getPendingBuyers, updateBuyerStatus } from "../../services/api";

export default function CompanyRequest() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");

  // ✅ Load pending company requests
  useEffect(() => {
    async function loadRequests() {
      try {
        if (role !== "ADMIN") {
          alert("Access denied");
          return;
        }

        const data = await getPendingBuyers();
        setRequests(data);
      } catch (err) {
        console.error("Failed to fetch company requests:", err);
      }
    }

    loadRequests();
  }, []);

  // ✅ Approve
  const handleApprove = async (id) => {
    try {
      await updateBuyerStatus(id, "APPROVED");
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Approve failed:", err);
      alert("Failed to approve request");
    }
  };

  // ✅ Reject
  const handleReject = async (id) => {
    try {
      await updateBuyerStatus(id, "REJECTED");
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Failed to reject request");
    }
  };

  // ✅ Search by company + address
  const filteredRequests = requests.filter(r =>
    (r.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.address || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <h2 className="text-2xl font-bold mb-6 text-center">
        Pending Company Requests
      </h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by company or address..."
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
              <th className="px-4 py-2 border dark:border-gray-700">Company</th>
              <th className="px-4 py-2 border dark:border-gray-700">Address</th>
              <th className="px-4 py-2 border dark:border-gray-700">Status</th>
              <th className="px-4 py-2 border dark:border-gray-700">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map((r) => (
              <tr
                key={r.id}
                className="text-center border-t dark:border-gray-700 
                hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 border dark:border-gray-700">
                  {r.companyName}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  {r.address}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700 font-semibold">
                  {r.status}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700 space-x-2">

                  <button
                    onClick={() => handleApprove(r.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
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
            ))}

            {filteredRequests.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="py-6 text-gray-500 dark:text-gray-400 text-center"
                >
                  No pending requests found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}
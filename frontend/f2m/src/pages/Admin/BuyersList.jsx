// src/pages/Admin/BuyersList.jsx

import { useEffect, useState } from "react";
import { getApprovedBuyers, deleteBuyer } from "../../services/api";

export default function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [search, setSearch] = useState("");

  const loadBuyers = async () => {
    try {
      const data = await getApprovedBuyers();
      setBuyers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load approved buyers");
    }
  };

  useEffect(() => {
    loadBuyers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this buyer?")) return;

    try {
      await deleteBuyer(id);
      loadBuyers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // 🔍 SEARCH BY COMPANY + ADDRESS
  const filtered = buyers.filter((b) =>
    (b.companyName || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (b.address || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">

      <h2 className="text-2xl font-semibold mb-4">
        Approved Buyers
      </h2>

      {/* 🔍 Search */}
      <input
        className="border p-2 mb-4 w-full rounded
                   bg-white text-black border-gray-300
                   dark:bg-gray-800 dark:text-white dark:border-gray-600"
        placeholder="Search by company or address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📊 Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-700">

          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border dark:border-gray-700">Company</th>
              <th className="px-4 py-2 border dark:border-gray-700">Address</th>
              <th className="px-4 py-2 border dark:border-gray-700">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((b) => (
              <tr
                key={b.id}
                className="text-center border-t dark:border-gray-700
                           hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 border dark:border-gray-700">
                  {b.companyName || "N/A"}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  {b.address || "N/A"}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded
                               hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="3" className="py-4 text-gray-500 dark:text-gray-400 text-center">
                  No approved buyers
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
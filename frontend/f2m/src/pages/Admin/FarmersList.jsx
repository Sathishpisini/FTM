import { useEffect, useState } from "react";
import {
  getApprovedFarmers,
  getSupervisorFarmers,
  deleteFarmer
} from "../../services/api";

export default function FarmersList() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  // ✅ Load farmers based on role
  const loadFarmers = async () => {
    try {
      let data = [];

      if (role === "ADMIN") {
        data = await getApprovedFarmers();
      } else if (role === "SUPERVISOR") {
        data = await getSupervisorFarmers();
      } else {
        alert("Access denied");
        return;
      }

      setFarmers(data);
    } catch (err) {
      console.error("Failed to fetch farmers:", err);
      alert("Failed to load farmers.");
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  // ✅ Delete (Admin only)
  const handleDelete = async (id) => {
    if (!isAdmin) return;

    if (!window.confirm("Are you sure you want to delete this farmer?")) return;

    try {
      await deleteFarmer(id);
      loadFarmers();
    } catch (err) {
      console.error("Failed to delete farmer:", err);
      alert("Failed to delete farmer.");
    }
  };

  // ✅ Search filter
  const filtered = farmers.filter(f =>
    (f.userName || f.user?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (f.village || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6
                    bg-white text-black
                    dark:bg-gray-900 dark:text-white
                    min-h-screen">

      <h2 className="text-2xl font-semibold mb-4">
        {isAdmin ? "Approved Farmers (All)" : "My Approved Farmers"}
      </h2>

      {/* 🔍 Search Box */}
      <input
        type="text"
        placeholder="Search by name or village"
        className="border p-2 mb-4 w-full rounded
                   bg-white text-black border-gray-300
                   dark:bg-gray-800 dark:text-white dark:border-gray-600"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📊 Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300
                          dark:border-gray-700">

          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border dark:border-gray-700">Name</th>
              <th className="px-4 py-2 border dark:border-gray-700">Village</th>
              <th className="px-4 py-2 border dark:border-gray-700">Supervisor</th>
              {isAdmin && (
                <th className="px-4 py-2 border dark:border-gray-700">Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filtered.map((f) => (
              <tr
                key={f.id}
                className="text-center border-t
                           dark:border-gray-700
                           hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 border dark:border-gray-700">
                  {f.userName || f.user?.name || "N/A"}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  {f.village}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  {f.supervisorName || "N/A"}
                </td>

                {isAdmin && (
                  <td className="px-4 py-2 border dark:border-gray-700">
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded
                                 hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={isAdmin ? 4 : 3}
                  className="py-4 text-gray-500 dark:text-gray-400 text-center"
                >
                  No approved farmers found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
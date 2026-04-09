// src/pages/Admin/SupervisorsList.jsx
import { useEffect, useState } from "react";
import { getAllSupervisors, deleteSupervisor } from "../../services/api";

export default function SupervisorsList() {
  const [supervisors, setSupervisors] = useState([]);
  const [search, setSearch] = useState("");

  // Load all supervisors
  const loadSupervisors = async () => {
    try {
      const data = await getAllSupervisors();
      setSupervisors(data);
    } catch (err) {
      console.error("Failed to fetch supervisors:", err);
      alert("Failed to load supervisors.");
    }
  };

  useEffect(() => {
    loadSupervisors();
  }, []);

  // Delete supervisor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supervisor?")) return;

    try {
      await deleteSupervisor(id);
      loadSupervisors();
    } catch (err) {
      console.error("Failed to delete supervisor:", err);
      alert("Failed to delete supervisor.");
    }
  };

  // 🔍 Search (name + village)
  const filtered = supervisors.filter(s =>
    (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.village || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">

      <h2 className="text-2xl font-semibold mb-4">
        Supervisors
      </h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name or village"
        className="border p-2 mb-4 w-full rounded
                   bg-white text-black border-gray-300
                   dark:bg-gray-800 dark:text-white dark:border-gray-600"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* 📊 Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-700">

          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border dark:border-gray-700">Name</th>
              <th className="px-4 py-2 border dark:border-gray-700">Phone</th>
              <th className="px-4 py-2 border dark:border-gray-700">Village</th> {/* ✅ NEW */}
              <th className="px-4 py-2 border dark:border-gray-700">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(s => (
              <tr
                key={s.id}
                className="text-center border-t dark:border-gray-700
                           hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 border dark:border-gray-700">
                  {s.name || "N/A"}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  {s.phone || "N/A"}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  {s.village || "N/A"} {/* ✅ NEW */}
                </td>

                <td className="px-4 py-2 border dark:border-gray-700">
                  <button
                    onClick={() => handleDelete(s.id)}
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
                <td colSpan="4" className="py-4 text-gray-500 dark:text-gray-400 text-center">
                  No supervisors found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
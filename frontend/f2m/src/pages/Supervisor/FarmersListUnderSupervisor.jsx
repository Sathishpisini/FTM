import { useEffect, useState } from "react";

export default function FarmersListUnderSupervisor() {

  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (token?.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }
    return token;
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = getAuthToken();

      if (!user?.id) {
        console.error("No supervisor found");
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/farmers/supervisor`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("❌ API ERROR:", err);
        return;
      }

      const data = await res.json();
      setFarmers(data || []);

    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this farmer?")) return;

    try {
      await fetch(`http://localhost:8080/api/farmers/${id}`, {
        method: "DELETE",
      });

      setFarmers(prev => prev.filter(f => f.id !== id));

    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filtered = farmers.filter(f =>
    (f.userName || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.farmName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Farmers Under Supervisor
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by farmer or farm..."
        value={search}
        onChange={e => setSearch(e.target.value)}
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
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                Farmer Name
              </th>

              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                Farm Name
              </th>

              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {filtered.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No farmers found
                </td>
              </tr>
            ) : (
              filtered.map(f => (
                <tr
                  key={f.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >

                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                    {f.userName}
                  </td>

                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-800 dark:text-gray-200">
                    {f.farmName || "No Farm"}
                  </td>

                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Delete
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
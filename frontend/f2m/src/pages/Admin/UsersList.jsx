import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../services/api";
import SearchBar from "../../components/Sections/SearchBar";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user.");
    }
  };

  const filtered = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Users
      </h2>

      <SearchBar value={search} onChange={setSearch} />

      <div className="overflow-x-auto mt-4">
        <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                ID
              </th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                Name
              </th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                Role
              </th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr
                key={u.id}
                className="text-center bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.id}
                </td>

                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.name}
                </td>

                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {u.role}
                </td>

                <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
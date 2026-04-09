import { useEffect, useState } from "react";
import { getMyPendingProducts } from "../../services/api";

export default function FarmerProductRequests() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getMyPendingProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition">

      <div className="max-w-6xl mx-auto mt-10 p-6">

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          My Pending Product Requests
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No pending requests
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">

              {/* HEADER */}
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr className="text-gray-800 dark:text-gray-200">
                  <th className="p-3 border border-gray-300 dark:border-gray-700">Name</th>
                  <th className="p-3 border border-gray-300 dark:border-gray-700">Category</th>
                  <th className="p-3 border border-gray-300 dark:border-gray-700">Price (₹)</th>
                  <th className="p-3 border border-gray-300 dark:border-gray-700">Quantity</th>
                  <th className="p-3 border border-gray-300 dark:border-gray-700">Status</th>
                </tr>
              </thead>

              <tbody>

                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="text-center border border-gray-300 dark:border-gray-700 
                               hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >

                    {/* NAME */}
                    <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">
                      {p.productName}
                    </td>

                    {/* CATEGORY */}
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {p.productCategory}
                    </td>

                    {/* PRICE */}
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      ₹ {p.pricePerKg}
                    </td>

                    {/* QUANTITY */}
                    <td className="p-3 text-gray-800 dark:text-gray-200">
                      {p.quantityAvailable}
                    </td>

                    {/* STATUS */}
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                          ${
                            p.status === "PENDING"
                              ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-500 dark:text-black"
                              : p.status === "APPROVED"
                              ? "bg-green-200 text-green-800 dark:bg-green-500 dark:text-black"
                              : "bg-red-200 text-red-800 dark:bg-red-500 dark:text-black"
                          }
                        `}
                      >
                        {p.status}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}
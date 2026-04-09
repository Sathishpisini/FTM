import { useEffect, useState } from "react";
import { getToken } from "../../services/AuthService";

export default function FarmerProductsDashboard() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchProducts() {
      let token = getToken();

      if (token?.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
      }

      if (!token) {
        alert("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:8080/api/products/farmer-products",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch farmer products");
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Fetch Error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-700 dark:text-gray-300">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition">

      <div className="max-w-6xl mx-auto mt-10 p-6">

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          My Products
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">

            {/* HEADER */}
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr className="text-gray-800 dark:text-gray-200">
                <th className="p-3 border border-gray-300 dark:border-gray-700">Image</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Product Name</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Farm</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Price (₹)</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700">Quantity</th>
              </tr>
            </thead>

            <tbody>

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6 text-gray-600 dark:text-gray-300"
                  >
                    No Products Found
                  </td>
                </tr>
              )}

              {products.map((item) => (
                <tr
                  key={item.id}
                  className="text-center border border-gray-300 dark:border-gray-700 
                             hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >

                  {/* IMAGE */}
                  <td className="p-3">
                    {item.imageUrl ? (
                      <img
                        src={
                          item.imageUrl.startsWith("http")
                            ? item.imageUrl
                            : `http://localhost:8080/${item.imageUrl}`
                        }
                        alt="product"
                        className="h-16 w-16 object-cover mx-auto rounded-lg shadow"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/64";
                        }}
                      />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">No Image</span>
                    )}
                  </td>

                  {/* NAME */}
                  <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">
                    {item.productName ?? "N/A"}
                  </td>

                  {/* FARM */}
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {item.farmName ?? "N/A"}
                  </td>

                  {/* PRICE */}
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    ₹ {item.pricePerKg ?? 0}
                  </td>

                  {/* QUANTITY */}
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    {item.quantityAvailable ?? 0} kg
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}
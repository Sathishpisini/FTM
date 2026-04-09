import { useEffect, useState } from "react";
import { getCompletedItems } from "../../../services/api";

export default function CompletedItemRequests() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getCompletedItems();
      setItems(data || []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 dark:text-green-400";
      case "PENDING":
        return "text-yellow-600 dark:text-yellow-400";
      case "CANCELLED":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-300";
    }
  };

  return (
    <div className="px-4">

      <h2 className="
        text-2xl font-bold mb-6
        text-gray-900 dark:text-gray-100
      ">
        Completed Order Items
      </h2>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-700 dark:text-gray-300">
          Loading...
        </p>
      )}

      {/* EMPTY */}
      {!loading && items.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400">
          No completed items
        </p>
      )}

      {/* TABLE */}
      {!loading && items.length > 0 && (
        <div className="overflow-x-auto">

          <table className="
            w-full text-sm text-left
            border border-gray-200
            dark:border-gray-700
          ">

            <thead className="
              bg-gray-100 text-gray-700
              dark:bg-gray-800 dark:text-gray-200
            ">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Product</th>
                <th className="p-3">Farm</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>

              {items.map((item) => (
                <tr
                  key={item.id}
                  className="
                    border-t
                    border-gray-200
                    dark:border-gray-700
                    hover:bg-gray-50
                    dark:hover:bg-gray-800
                  "
                >

                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.orderId}</td>
                  <td className="p-3 font-medium">{item.productName}</td>
                  <td className="p-3">{item.farmName}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">₹ {item.price}</td>

                  <td className={`p-3 font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
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
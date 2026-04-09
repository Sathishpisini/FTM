import { useEffect, useState } from "react";

export const Dashboard = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Clean token
  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (token?.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }
    return token;
  };

  const fetchOrders = async () => {

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));
      const token = getAuthToken();

      if (!user?.id || !token) {
        setLoading(false);
        return;
      }

      // ✅ STEP 1: GET BUYER
      const buyerRes = await fetch(
        `http://localhost:8080/api/buyers/users/${user.id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!buyerRes.ok) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const buyerData = await buyerRes.json();

      const buyers = Array.isArray(buyerData)
        ? buyerData
        : buyerData ? [buyerData] : [];

      if (buyers.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // ✅ STEP 2: FETCH ORDERS
      let allOrders = [];

      for (let buyer of buyers) {

        const orderRes = await fetch(
          `http://localhost:8080/api/orders/buyer/${buyer.id}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!orderRes.ok) continue;

        const orderData = await orderRes.json();

        if (Array.isArray(orderData)) {

          const ordersWithCompany = orderData.map(order => ({
            ...order,
            companyName: buyer.companyName || buyer.name || "Unknown Company"
          }));

          allOrders = [...allOrders, ...ordersWithCompany];
        }
      }

      setOrders(allOrders);

    } catch (err) {
      console.error("Dashboard Error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ONLY LOAD ON FIRST RENDER (NO LOOP)
  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-800 dark:text-gray-200">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 
                    bg-white dark:bg-gray-900 
                    text-gray-800 dark:text-gray-100 
                    rounded shadow">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          My Orders
        </h2>

        {/* ✅ MANUAL REFRESH ONLY */}
        <button
          onClick={fetchOrders}
          className="bg-blue-500 hover:bg-blue-600 
                     dark:bg-blue-600 dark:hover:bg-blue-700 
                     text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-700">

          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Company</th>
              <th className="p-2">Product Name</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Payment</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>

            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500 dark:text-gray-400">
                  No Orders Found
                </td>
              </tr>
            )}

            {orders.map((order) =>
              order.items?.map((item) => (
                <tr
                  key={`${order.id}-${item.id}`}
                  className="text-center border 
                             border-gray-200 dark:border-gray-700 
                             hover:bg-gray-100 dark:hover:bg-gray-800"
                >

                  <td className="p-2">{order.id}</td>

                  <td className="p-2">
                    {order.companyName || "N/A"}
                  </td>

                  <td className="p-2">
                    {item.productName || "Unknown Product"}
                  </td>

                  <td className="p-2">
                    {item.quantity || 0}
                  </td>

                  <td className="p-2">
                    {order.paymentMethod || "Cash on Delivery"}
                  </td>

                  <td className="p-2 font-semibold text-yellow-600 dark:text-yellow-400">
                    {item.status || "PENDING"}
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
};
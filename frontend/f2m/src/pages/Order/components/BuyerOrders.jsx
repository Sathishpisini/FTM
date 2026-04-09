import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/AuthService";

export default function BuyerOrders() {

  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ TOKEN CLEANER
  const getAuthToken = () => {
    let token = getToken();
    if (token?.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }
    return token;
  };

  // ================= FETCH BUYERS =================
  useEffect(() => {

    const fetchBuyers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return navigate("/login");

        const token = getAuthToken();
        if (!token) return navigate("/login");

        const res = await fetch(
          `http://localhost:8080/api/buyers/users/${user.id}`,
          {
            headers: { "Authorization": `Bearer ${token}` }
          }
        );

        if (!res.ok) {
          setBuyers([]);
          return;
        }

        const data = await res.json();

        const buyersList = Array.isArray(data) ? data : [data];

        setBuyers(buyersList);

        if (buyersList.length > 0) {
          setSelectedBuyer(buyersList[0].id);
        }

      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchBuyers();

  }, []);

  // ================= FETCH ORDERS =================
  useEffect(() => {

    if (!selectedBuyer) return;

    const fetchOrders = async () => {

      try {
        setLoading(true);

        const token = getAuthToken();
        if (!token) return navigate("/login");

        const res = await fetch(
          `http://localhost:8080/api/orders/buyer/${selectedBuyer}`,
          {
            headers: { "Authorization": `Bearer ${token}` }
          }
        );

        if (!res.ok) {
          setOrders([]);
          return;
        }

        const data = await res.json();

        setOrders(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

  }, [selectedBuyer]);

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600";
      case "ORDERED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">

      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {/* ================= COMPANY SELECT ================= */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          Select Company
        </label>

        <select
          value={selectedBuyer}
          onChange={(e) => setSelectedBuyer(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select Company --</option>

          {buyers.length > 0 ? (
            buyers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.companyName || `Company ${b.id}`}
              </option>
            ))
          ) : (
            <option disabled>No companies found</option>
          )}
        </select>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="text-center">Loading orders...</div>
      )}

      {/* ================= NO ORDERS ================= */}
      {!loading && orders.length === 0 && (
        <p>No Orders Found</p>
      )}

      {/* ================= ORDERS ================= */}
      {!loading && orders.map((order) => (

        <div key={order.id} className="border p-4 mb-6 rounded shadow">

          {/* HEADER */}
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">
              Order #{order.id}
            </h3>

            <span className={`font-bold ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* ITEMS */}
          <table className="w-full text-sm border mt-2">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th> {/* ✅ NEW */}
              </tr>
            </thead>

            <tbody>

              {order.items?.length > 0 ? (
                order.items.map((item) => (
                  <tr key={item.id} className="text-center border">

                    <td className="p-2">
                      {item.productName || "N/A"}
                    </td>

                    <td className="p-2">
                      {item.quantity || 0}
                    </td>

                    <td className="p-2">
                      ₹ {item.price || 0}
                    </td>

                    <td className="p-2">
                      ₹ {(item.price || 0) * (item.quantity || 0)}
                    </td>

                    {/* ✅ ITEM STATUS */}
                    <td className={`p-2 font-semibold ${getStatusColor(item.status)}`}>
                      {item.status || "PENDING"}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-2 text-center">
                    No items found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

          {/* TOTAL */}
          <div className="text-right mt-2 font-bold">
            Total: ₹ {order.totalAmount || 0}
          </div>

        </div>

      ))}

    </div>
  );
}
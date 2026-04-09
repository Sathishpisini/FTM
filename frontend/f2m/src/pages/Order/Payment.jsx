import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { getToken } from "../../services/AuthService";

export const Payment = () => {

  const navigate = useNavigate();
  const { cartList, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  const getAuthToken = () => {
    let token = getToken();
    if (token?.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }
    return token;
  };

  useEffect(() => {

    const fetchCompanies = async () => {

      try {

        const userString = localStorage.getItem("user");
        if (!userString) return navigate("/login");

        const user = JSON.parse(userString);
        if (!user?.id) return navigate("/login");

        const token = getAuthToken();
        if (!token) return navigate("/login");

        const res = await fetch(
          `http://localhost:8080/api/buyers/users/${user.id}/approved`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!res.ok) throw new Error("No companies found");

        const data = await res.json();

        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          setCompanies([data]);
        }

      } catch (err) {
        console.error(err);
        alert("Failed to load companies");
      }
    };

    fetchCompanies();

  }, [navigate]);

  const handleOrder = async () => {

    try {

      setLoading(true);

      if (paymentMethod !== "cod") {
        alert("Only Cash On Delivery is available");
        return;
      }

      if (!selectedCompany) {
        alert("Please select a company");
        return;
      }

      if (!cartList || cartList.length === 0) {
        alert("Cart is empty");
        return;
      }

      const token = getAuthToken();
      if (!token) return navigate("/login");

      const items = cartList.map(item => ({
        productId: item.id,
        productName: item.productName || item.name,
        quantity: item.quantity || 1,
        price: item.pricePerKg || item.price
      }));

      const totalAmount = items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      const orderData = {
        buyerId: selectedCompany,
        status: "PENDING",
        totalAmount: totalAmount,
        items: items
      };

      const response = await fetch(
        "http://localhost:8080/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        }
      );

      if (!response.ok) {
        throw new Error("Order failed");
      }

      clearCart();
      navigate("/order-success");

    } catch (err) {
      console.error(err);
      alert(err.message);
      navigate("/order-failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">

      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Payment & Order Summary
        </h2>

        {/* Company Selection */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Select Company
          </label>

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Company --</option>

            {companies.length === 0 ? (
              <option disabled>No companies found</option>
            ) : (
              companies.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.companyName || comp.name || "Unnamed Company"}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Payment Method */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Payment Method
          </label>

          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash On Delivery
          </label>
        </div>

        {/* Order Summary */}
        <div className="mb-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">
            Order Summary
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {cartList.map((item, index) => {
              const name = item.productName || item.name;
              const price = item.pricePerKg || item.price;
              const quantity = item.quantity || 1;

              return (
                <div key={index} className="flex justify-between text-sm text-gray-700 dark:text-gray-200">
                  <span>{name}</span>
                  <span>₹ {price} × {quantity}</span>
                </div>
              );
            })}
          </div>

          <hr className="my-3 border-gray-300 dark:border-gray-600" />

          <div className="flex justify-between font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>
              ₹ {cartList.reduce((sum, item) => {
                const price = item.pricePerKg || item.price;
                const quantity = item.quantity || 1;
                return sum + (price * quantity);
              }, 0)}
            </span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleOrder}
          disabled={loading || !selectedCompany}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>

      </div>
    </div>
  );
};
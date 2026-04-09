import { useCart } from "../../../Context/CartContext";
import { useNavigate } from "react-router-dom";

export const Checkout = () => {

  const { cartList } = useCart();
  const navigate = useNavigate();

  console.log("CART LIST:", cartList); // ✅ DEBUG

  // ✅ HANDLE BOTH pricePerKg AND price
  const subtotal = cartList.reduce((total, item) => {
    const price = item.pricePerKg || item.price || 0;
    const qty = item.quantity || 0;
    return total + price * qty;
  }, 0);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePayment = () => {

    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login");
      return;
    }

    if (cartList.length === 0) {
      alert("Cart is empty");
      return;
    }

    // ✅ Prepare order data correctly
    const orderData = {
      totalAmount: total,
      items: cartList.map(item => ({
        productId: item.id,
        quantity: item.quantity || 0,
        price: item.pricePerKg || item.price || 0
      }))
    };

    console.log("ORDER DATA:", orderData);

    localStorage.setItem("orderData", JSON.stringify(orderData));

    navigate("/payment");
  };

  return (

    <div className="bg-white p-6 rounded shadow text-black">

      <h2 className="text-xl font-semibold mb-4">
        Order Summary
      </h2>

      {/* EMPTY CART */}
      {cartList.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Tax (10%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <hr className="my-3"/>

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePayment}
            className="mt-5 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Proceed To Payment
          </button>
        </>
      )}

    </div>
  );
};
import { useCart } from "../../../Context/CartContext";

export const CartCard = ({ product }) => {

  const { addToCart, decreaseQty, removeFromCart } = useCart();

  // ✅ SUPPORT BOTH DATA STRUCTURES
  const name = product.productName || product.name;
  const price = product.pricePerKg || product.price;
  const image = product.imageUrl || product.image;
  const quantity = product.quantity || 0;
  const available = product.quantityAvailable || 0;
  const unit = product.unit || "";

  const stockReached = quantity >= available;

  console.log("Cart Product:", product); // ✅ DEBUG

  return (

    <div className="flex justify-between items-center bg-white p-4 rounded shadow">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        <img
          src={image || "https://via.placeholder.com/80"}
          alt={name || "product"}
          className="w-20 h-20 rounded"
        />

        <div>
          <h2 className="font-semibold text-black">
            {name || "No Name"}
          </h2>

          <p className="text-black">
            ₹{price || 0} {unit && `/ ${unit}`}
          </p>

          <p className="text-sm text-gray-500">
            Total: ₹{(price || 0) * quantity}
          </p>
        </div>

      </div>

      {/* QUANTITY */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => decreaseQty(product)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          -
        </button>

        <span className="font-bold text-black">
          {quantity}
        </span>

        <button
          onClick={() => addToCart(product)}
          disabled={stockReached}
          className={`px-3 py-1 rounded text-white 
          ${stockReached ? "bg-gray-400" : "bg-green-500"}`}
        >
          +
        </button>

      </div>

      {/* REMOVE */}
      <button
        onClick={() => removeFromCart(product)}
        className="bg-gray-700 text-white px-3 py-2 rounded"
      >
        Remove
      </button>

    </div>

  );
};
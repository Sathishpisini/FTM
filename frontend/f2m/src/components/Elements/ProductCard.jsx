import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";

export const ProductCard = ({ product, role }) => {
  const navigate = useNavigate();

  const { cartList, addToCart, removeFromCart } = useCart();
  const [inCart, setInCart] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isBuyer = user?.role === "BUYER";
  const isAdmin = role === "ADMIN";

  const API_URL = "http://localhost:8080/api";

  const {
    id,
    productName,
    description,
    pricePerKg,
    imageUrl,
    quantityAvailable,
    unit,
    variety,
    latitude,     // ✅ ADDED
    longitude 
  } = product;

  const inStock = quantityAvailable > 0;

  useEffect(() => {
    const productInCart = cartList.find((item) => item.id === id);
    setInCart(!!productInCart);
  }, [cartList, id]);

  const openMap = () => {
    if (!latitude || !longitude) {
      alert("Location not available");
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
  };
  // ✅ Add to cart
  const handleAddToCart = () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!isBuyer) {
      alert("Only BUYERS can add to cart");
      return;
    }

    if (!inStock) {
      alert("Product is out of stock");
      return;
    }

    const cartProduct = {
      id: id,
      name: productName,
      price: pricePerKg,
      image: imageUrl,
      quantityAvailable: quantityAvailable,
      unit: unit
    };

    addToCart(cartProduct);
  };

  // ✅ Delete product (Admin)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      window.location.reload(); // simple refresh
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // ✅ Update product (Admin)
  const handleUpdate = () => {
    navigate(`/admin/update-product/${id}`);
  };

  return (
    <div className="max-w-sm bg-white dark:bg-slate-800 border rounded-lg p-4 shadow-lg m-4">

      <Link to={`/products/${id}`} className="block">
        <img
          className="w-full h-64 object-cover rounded-lg"
          src={imageUrl}
          alt={productName}
        />
      </Link>

      <div className="pt-4">
        {/* ✅ Product ID Badge */}
        <div className="text-xs text-gray-500 mb-1">
          ID: {id}
        </div>
        <Link to={`/products/${id}`}>
          <h5 className="text-xl font-semibold">
            {productName}
          </h5>
        </Link>

        <p className="text-sm mt-2 truncate">
          {description}
        </p>

        {variety && (
          <p className="text-sm text-gray-500">
            Variety: {variety}
          </p>
        )}

        <p className={`text-sm font-semibold ${inStock ? "text-green-600" : "text-red-600"}`}>
          {inStock ? "In Stock" : "Out of Stock"} | Qty: {quantityAvailable} {unit}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-2xl font-bold">
            ₹{pricePerKg} / {unit}
          </span>
        </div>

        {/* ✅ MAP BUTTON */}
        <button
          onClick={openMap}
          className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          📍 View Farm Location
        </button>
        {/* ✅ ADMIN BUTTONS */}
        {isAdmin && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleUpdate}
              className="w-1/2 bg-blue-600 text-white px-3 py-2 rounded"
            >
              Update
            </button>

            <button
              onClick={handleDelete}
              className="w-1/2 bg-red-600 text-white px-3 py-2 rounded"
            >
              Delete
            </button>
          </div>
        )}

        {/* ✅ BUYER CART BUTTONS */}
        {!isAdmin && (
          !inCart ? (
            <button
              onClick={handleAddToCart}
              disabled={!isBuyer || !inStock}
              className={`mt-3 px-4 py-2 w-full rounded text-white 
              ${isBuyer && inStock ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
            >
              Add to Cart
            </button>
          ) : (
            <button
              onClick={() => removeFromCart({ id })}
              className="mt-3 w-full bg-red-600 text-white px-4 py-2 rounded"
            >
              Remove from Cart
            </button>
          )
        )}

      </div>
    </div>
  );
};
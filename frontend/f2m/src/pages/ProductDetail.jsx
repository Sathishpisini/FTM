import { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import { getFeaturedProduct, getProduct } from "../services/ProductsService";
import { useCart } from "../Context/CartContext";
import { useTitle } from "../hooks/UseTitle";

export const ProductDetail = () => {

  const { cartList, addToCart, removeFromCart } = useCart();
  const [inCart, setInCart] = useState(false);
  const [product, setProduct] = useState({});
  const { id } = useParams();

  useTitle(product.productName);

  useEffect(() => {
    async function fetchProducts() {
      let data = null;

      try {
        data = await getFeaturedProduct(id);
      } catch (err) {
        data = null;
      }

      if (!data || Object.keys(data).length === 0) {
        data = await getProduct(id);
      }

      setProduct(data);
    }

    fetchProducts();
  }, [id]);

  useEffect(() => {
    const productInCart = cartList.find(item => item.id === product.id);
    setInCart(!!productInCart);
  }, [cartList, product]);

  return (
    <main className="pt-24 px-8 bg-gray-50 dark:bg-gray-900">

      <section className="w-full min-h-screen">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-4">
          {product.productName}
        </h1>

        <p className="text-center mb-6">
          {product.description}
        </p>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              className="rounded-lg shadow-md"
              src={product.imageUrl}
              alt={product.productName}
            />
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2">

            <p className="text-3xl font-bold mb-3">
              ₹{product.pricePerKg}
            </p>

            <p className="mb-2">
              Available: {product.quantityAvailable} {product.unit}
            </p>

            <p className="mb-2">
              Variety: {product.variety}
            </p>

            <p className={`font-semibold ${product.quantityAvailable > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.quantityAvailable > 0 ? "In Stock" : "Out of Stock"}
            </p>

          </div>
          {/* ✅ NEW SUPERVISOR SECTION */}
          <div className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
            <h3 className="font-semibold text-lg mb-2">
              Supervisor Details
            </h3>

            <p>
              Name: {product.supervisorName || "Not Available"}
            </p>

            <p>
              Phone: {product.supervisorPhone || "Not Available"}
            </p>
          </div>

        </div>

      </section>
    </main>
  );
};
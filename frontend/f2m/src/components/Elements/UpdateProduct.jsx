import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    pricePerKg: "",
    quantityAvailable: "",
  });

  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8080/api/products";

  // ✅ Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const found = data.find((p) => p.id === parseInt(id));

        if (found) {
          setProduct(found);

          setFormData({
            description: found.description || "",
            pricePerKg: found.pricePerKg || "",
            quantityAvailable: found.quantityAvailable || "",
          });
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ PATCH UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Product updated successfully");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-2xl p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Update Product
        </h2>

        {/* ✅ READ ONLY INFO */}
        <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-700 p-5 rounded-xl">
          {[
            ["Product ID", product.id],
            ["Product Name", product.productName],
            ["Category", product.productCategory],
            ["Unit", product.unit],
            ["Variety", product.variety],
            ["Organic", product.organic ? "Yes" : "No"],
            ["Seasonal", product.seasonal ? "Yes" : "No"],
          ].map(([label, value], index) => (
            <div key={index}>
              <p className="text-gray-400 text-sm">{label}</p>
              <p className="font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* ✅ FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Description */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Price per Kg
            </label>
            <input
              type="number"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              Quantity Available
            </label>
            <input
              type="number"
              name="quantityAvailable"
              value={formData.quantityAvailable}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
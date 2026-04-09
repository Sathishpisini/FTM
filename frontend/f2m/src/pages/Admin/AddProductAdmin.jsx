import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/AuthService";

export default function AddProductAdmin() {
  const navigate = useNavigate();

  const productTypes = [
    "VEGETABLES",
    "FRUITS",
    "GRAINS",
    "DAIRY",
    "POULTRY",
    "SPICES",
    "OTHERS"
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    productType: "",
    variety: "",
    seasonal: false,
    organic: false,
    status: "AVAILABLE"
  });

  const [imageFile, setImageFile] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let token = getToken();

    console.log("Raw token from storage:", token);

    if (token && token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    console.log("Final token used:", token);

    if (!token) {
      alert("User not authenticated. Please login.");
      return;
    }

    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    const data = new FormData();
    data.append("productName", formData.name);
    data.append("productCategory", formData.productType);
    data.append("description", formData.description);
    data.append("pricePerKg", String(formData.price));
    data.append("quantityAvailable", String(formData.quantity));
    data.append("unit", "kg");
    data.append("variety", formData.variety || "NA");
    data.append("latitude", "0");
    data.append("longitude", "0");

    data.append("seasonal", formData.seasonal);
    data.append("organic", formData.organic);
    data.append("status", formData.status);

    data.append("image", imageFile);

    try {
      console.log("Sending request to backend...");

      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      console.log("Response status:", res.status);

      if (res.ok) {
        alert("Product added successfully");
        navigate("/products-list");
      } else {
        const errText = await res.text();
        console.error("Backend error response:", errText);
        alert(errText);
      }
    } catch (err) {
      console.error("Request error:", err);
      alert("Something went wrong");
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Add Product (Admin)
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price per Kg"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity Available"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="productType"
          value={formData.productType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Product Type</option>
          {productTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="variety"
          placeholder="Variety"
          value={formData.variety}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="seasonal"
            checked={formData.seasonal}
            onChange={handleChange}
          />
          Seasonal
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="organic"
            checked={formData.organic}
            onChange={handleChange}
          />
          Organic
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="ORDERED">ORDERED</option>
          <option value="SOLD">SOLD</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <input
          type="file"
          onChange={e => setImageFile(e.target.files[0])}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
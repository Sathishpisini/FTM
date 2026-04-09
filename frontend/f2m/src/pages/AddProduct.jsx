import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/AuthService";

function getUserRole() {
  const token = getToken();
  if (!token) return null;

  try {
    const cleanToken = token.startsWith("Bearer ")
      ? token.replace("Bearer ", "")
      : token;

    const payload = JSON.parse(atob(cleanToken.split(".")[1]));
    return payload.role || payload.roles || payload.authorities;
  } catch {
    return null;
  }
}

export default function AddProduct() {
  const navigate = useNavigate();
  const role = getUserRole();

  const PRODUCT_TYPES = [
    "VEGETABLES",
    "FRUITS",
    "GRAINS",
    "DAIRY",
    "POULTRY",
    "SPICES",
    "OTHERS"
  ];

  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [farmSearch, setFarmSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const [status, setStatus] = useState("PENDING");

  const [formDataState, setFormDataState] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    productType: "",
    variety: "",
    organic: false,
    seasonal: false
  });

  const [imageFile, setImageFile] = useState(null);

  const dropdownRef = useRef();

  const prepareToken = () => {
    let token = getToken();
    return token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
  };

  // FETCH FARMS
  useEffect(() => {
    const token = prepareToken();

    const url =
      role === "ADMIN"
        ? "http://localhost:8080/api/farmers/admin/farms"
        : "http://localhost:8080/api/farmers/my-farms";

    fetch(url, {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        const farms = Array.isArray(data) ? data : data?.data || [];
        setFarmers(farms);
        setFilteredFarmers(farms);
      })
      .catch(() => alert("Failed to load farms"));
  }, [role]);

  // FILTER FARM SEARCH
  useEffect(() => {
    const filtered = farmers.filter(f => {
      const farmName = f?.name || f?.farmName || f?.farm?.name || "";
      return farmName.toLowerCase().includes(farmSearch.toLowerCase());
    });

    setFilteredFarmers(filtered);
  }, [farmSearch, farmers]);

  // CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormDataState(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = prepareToken();

    if (!selectedFarmer) {
      alert("Select farm");
      return;
    }

    const formData = new FormData();

    formData.append("productName", formDataState.name);
    formData.append("productCategory", formDataState.productType);
    formData.append("description", formDataState.description);
    formData.append("pricePerKg", formDataState.price);
    formData.append("quantityAvailable", formDataState.quantity);
    formData.append("unit", "kg");
    formData.append("variety", formDataState.variety || "NA");
    formData.append("organic", formDataState.organic);
    formData.append("seasonal", formDataState.seasonal);

    formData.append("status", role === "ADMIN" ? status : "PENDING");
    formData.append("farmerId", selectedFarmer.id);

    if (imageFile) formData.append("image", imageFile);

    const res = await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { Authorization: token },
      body: formData
    });

    if (res.ok) {
      alert("Product added successfully");
      navigate("/my-products");
    } else {
      alert("Failed to add product");
    }
  }

  const inputStyle =
    "w-full p-2 rounded border " +
    "bg-white dark:bg-gray-800 " +
    "text-gray-900 dark:text-white " +
    "placeholder-gray-400 dark:placeholder-gray-500 " +
    "border-gray-300 dark:border-gray-600 " +
    "focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 rounded-2xl shadow-lg
                    bg-white dark:bg-gray-900
                    border border-gray-200 dark:border-gray-700">

      <h2 className="text-2xl mb-4 font-semibold text-gray-800 dark:text-white">
        Add Product
      </h2>

      {/* FARM DROPDOWN */}
      <div className="relative mb-3" ref={dropdownRef}>
        <div
          className="w-full p-2 border rounded cursor-pointer
                     bg-white dark:bg-gray-800
                     text-gray-900 dark:text-white
                     border-gray-300 dark:border-gray-600"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedFarmer
            ? (selectedFarmer.name ||
               selectedFarmer.farmName ||
               selectedFarmer.farm?.name)
            : "Select Farm"}
        </div>

        {showDropdown && (
          <div className="absolute w-full border rounded mt-1
                          bg-white dark:bg-gray-800
                          max-h-60 overflow-y-auto z-10
                          border-gray-300 dark:border-gray-600">

            <input
              type="text"
              placeholder="Search farm..."
              value={farmSearch}
              onChange={(e) => setFarmSearch(e.target.value)}
              className={inputStyle}
            />

            {filteredFarmers.map(f => {
              const farmName =
                f?.name || f?.farmName || f?.farm?.name || "Unnamed Farm";

              return (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedFarmer(f);
                    setShowDropdown(false);
                    setFarmSearch("");
                  }}
                  className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {farmName}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className={inputStyle}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className={inputStyle}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          className={inputStyle}
          required
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          onChange={handleChange}
          className={inputStyle}
          required
        />

        <select
          name="productType"
          onChange={handleChange}
          className={inputStyle}
          required
        >
          <option value="">Select Product Type</option>
          {PRODUCT_TYPES.map(type => (
            <option key={type} value={type} className="text-black">
              {type}
            </option>
          ))}
        </select>

        <input
          name="variety"
          placeholder="Variety"
          onChange={handleChange}
          className={inputStyle}
        />

        <label className="flex items-center gap-2 text-gray-800 dark:text-gray-300">
          <input type="checkbox" name="organic" onChange={handleChange} />
          Organic
        </label>

        <label className="flex items-center gap-2 text-gray-800 dark:text-gray-300">
          <input type="checkbox" name="seasonal" onChange={handleChange} />
          Seasonal
        </label>

        <input
          type="file"
          onChange={e => setImageFile(e.target.files[0])}
          className="w-full p-2 rounded border
                     bg-white dark:bg-gray-800
                     text-gray-900 dark:text-white
                     border-gray-300 dark:border-gray-600"
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded">
          Add Product
        </button>
      </form>

      {/* STATUS (ADMIN ONLY) */}
      {role === "ADMIN" && (
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className={inputStyle + " mt-3"}
        >
          <option>PENDING</option>
          <option>APPROVED</option>
          <option>REJECTED</option>
          <option>SOLD</option>
          <option>ORDERED</option>
        </select>
      )}
    </div>
  );
}
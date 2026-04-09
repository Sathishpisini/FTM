// src/pages/Register/RegisterUser.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/AuthService";

export default function RegisterUser() {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [villages, setVillages] = useState([]); // 🔥 villages state

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    village: "",
    farmName: "",
    farmSize: "",
    companyName: "",
    address: "",
    latitude: null,
    longitude: null
  });

  // 🔥 FETCH VILLAGES FROM BACKEND
  useEffect(() => {
    async function fetchVillages() {
      try {
        const res = await fetch("http://localhost:8080/api/supervisors/villages");

        if (res.ok) {
          const data = await res.json();
          setVillages(data);
        } else {
          console.error("Failed to fetch villages");
        }
      } catch (err) {
        console.error("Error fetching villages:", err);
      }
    }

    fetchVillages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "farmSize" ? Number(value) : value
    }));
  };

  // 📍 Live location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      },
      () => alert("Unable to fetch location")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!role) {
      alert("Please select a role");
      return;
    }

    let token = getToken();
    if (token?.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    if (!token) {
      alert("Admin not authenticated. Please login.");
      return;
    }

    // ✅ CLEAN PAYLOAD
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: role,

      latitude: formData.latitude,
      longitude: formData.longitude,

      ...(role === "FARMER" && {
        village: formData.village,
        farmName: formData.farmName,
        farmSize: formData.farmSize
      }),

      ...(role === "SUPERVISOR" && {
        village: formData.village
      }),

      ...(role === "BUYER" && {
        companyName: formData.companyName,
        address: formData.address
      })
    };

    try {
      const res = await fetch("http://localhost:8080/api/admin/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(`${role} registered successfully`);
        navigate("/");
      } else {
        const text = await res.text();
        alert(`Error: ${text}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Register User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ROLE */}
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setFormData((prev) => ({ ...prev, village: "" })); // 🔥 reset village
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="FARMER">Farmer</option>
          <option value="SUPERVISOR">Supervisor</option>
          <option value="BUYER">Buyer</option>
        </select>

        {/* COMMON */}
        <input name="name" placeholder="Name" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input name="phone" placeholder="Phone" onChange={handleChange} required className="w-full p-2 border rounded" />

        {/* FARMER */}
        {role === "FARMER" && (
          <>
            {/* 🔥 DROPDOWN INSTEAD OF INPUT */}
            <select
              name="village"
              value={formData.village}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Village</option>
              {villages.map((village, index) => (
                <option key={index} value={village}>
                  {village}
                </option>
              ))}
            </select>

            <input name="farmName" placeholder="Farm Name" onChange={handleChange} required className="w-full p-2 border rounded" />
            <input type="number" name="farmSize" placeholder="Farm Size (acres)" onChange={handleChange} required className="w-full p-2 border rounded" />
          </>
        )}

        {/* SUPERVISOR */}
        {role === "SUPERVISOR" && (
          <input name="village" placeholder="Village" onChange={handleChange} required className="w-full p-2 border rounded" />
        )}

        {/* BUYER */}
        {role === "BUYER" && (
          <>
            <input name="companyName" placeholder="Company Name" onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="address" placeholder="Address" onChange={handleChange} required className="w-full p-2 border rounded" />
          </>
        )}

        {/* LOCATION */}
        <button
          type="button"
          onClick={handleGetLocation}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Get Live Location
        </button>

        {formData.latitude && formData.longitude && (
          <p className="text-sm text-gray-600">
            Location: {formData.latitude}, {formData.longitude}
          </p>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
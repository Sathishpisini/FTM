import { useState } from "react";

export default function AddCompany() {

  const [company, setCompany] = useState({
    companyName: "",
    address: "",
    latitude: null,
    longitude: null
  });

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value
    });
  };

  // 📍 Fetch location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCompany((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        alert("Location fetched successfully");
      },
      (error) => {
        console.error("Location error:", error);
        alert("Unable to fetch location");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (!userId) {
      alert("User not found");
      return;
    }

    if (!company.latitude || !company.longitude) {
      alert("Please fetch location first");
      return;
    }

    const payload = {
      userId: Number(userId),
      companyName: company.companyName,
      address: company.address,
      latitude: Number(company.latitude),
      longitude: Number(company.longitude)
    };

    const res = await fetch("http://localhost:8080/api/buyers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.text();

    if (res.ok) {
      alert("Company added successfully");
      window.location.href = "/my-companies";
    } else {
      alert("Error: " + data);
    }
  };

  return (
    <div className="
      max-w-xl mx-auto mt-10 p-6 rounded shadow
      bg-white text-gray-900
      dark:bg-gray-900 dark:text-gray-100
    ">

      <h2 className="text-2xl font-bold mb-4">
        Add Company
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* COMPANY NAME */}
        <input
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
          className="
            w-full border p-2 rounded
            border-gray-300
            bg-white text-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-500

            dark:border-gray-700
            dark:bg-gray-800 dark:text-gray-100
          "
          required
        />

        {/* ADDRESS */}
        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="
            w-full border p-2 rounded
            border-gray-300
            bg-white text-gray-900
            focus:outline-none focus:ring-2 focus:ring-blue-500

            dark:border-gray-700
            dark:bg-gray-800 dark:text-gray-100
          "
          required
        />

        {/* 📍 LOCATION BUTTON */}
        <button
          type="button"
          onClick={getLocation}
          className="
            w-full py-2 rounded font-semibold
            bg-blue-600 text-white
            hover:bg-blue-700 transition

            dark:bg-blue-500 dark:hover:bg-blue-600
          "
        >
          Get Location
        </button>

        {/* LATITUDE */}
        <input
          value={company.latitude || ""}
          placeholder="Latitude"
          readOnly
          className="
            w-full border p-2 rounded
            bg-gray-100 border-gray-300 text-gray-700

            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300
          "
        />

        {/* LONGITUDE */}
        <input
          value={company.longitude || ""}
          placeholder="Longitude"
          readOnly
          className="
            w-full border p-2 rounded
            bg-gray-100 border-gray-300 text-gray-700

            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300
          "
        />

        {/* SUBMIT */}
        <button
          className="
            w-full py-2 rounded font-semibold
            bg-green-600 text-white
            hover:bg-green-700 transition

            dark:bg-green-500 dark:hover:bg-green-600
          "
        >
          Add Company
        </button>

      </form>
    </div>
  );
}
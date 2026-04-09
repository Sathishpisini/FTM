import { useEffect, useState } from "react";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = storedUser?.id;

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  // ✅ API CALL
  const safeFetchJson = async (url) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  };

  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      return;
    }

    safeFetchJson(`http://localhost:8080/api/users/${userId}`)
      .then((data) => {
        const farmer = data?.farmers?.[0] || {};
        const buyer = data?.buyers?.[0] || {};

        setForm({
          name: data?.name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          role: data?.role || "",

          village: farmer?.village || "N/A",
          supervisorName: farmer?.supervisorName || "N/A",
          supervisorPhone: farmer?.supervisorPhone || "N/A",

          companyName: buyer?.companyName || "N/A",
          address: buyer?.address || "N/A",
        });
      })
      .catch((err) => {
        console.error("❌ User fetch error:", err);
        setError("Failed to load profile");
      });
  }, [userId]);

  // UI STATES
  if (error) {
    return (
      <p className="text-red-500 dark:text-red-400">{error}</p>
    );
  }

  if (!form) {
    return (
      <p className="text-gray-800 dark:text-gray-200">Loading...</p>
    );
  }

  return (
    <div className="
      max-w-xl mx-auto mt-10 p-6 rounded shadow
      bg-white text-gray-900
      dark:bg-gray-900 dark:text-gray-100
    ">

      <h2 className="text-2xl mb-4 font-semibold">
        Profile
      </h2>

      {/* BASIC DETAILS */}
      <div className="
        border p-2 rounded mb-2
        border-gray-300
        dark:border-gray-700
      ">
        <b>Name:</b> {form.name}
      </div>

      <div className="
        border p-2 rounded mb-2
        bg-gray-100 border-gray-300
        dark:bg-gray-800 dark:border-gray-700
      ">
        <b>Email:</b> {form.email}
      </div>

      <div className="
        border p-2 rounded mb-2
        bg-gray-100 border-gray-300
        dark:bg-gray-800 dark:border-gray-700
      ">
        <b>Phone:</b> {form.phone}
      </div>

      {/* FARMER */}
      {form.role === "FARMER" && (
        <>
          <div className="
            border p-2 rounded mb-2
            border-gray-300
            dark:border-gray-700
          ">
            <b>Village:</b> {form.village}
          </div>

          <div className="
            border p-2 rounded mb-2
            bg-gray-100 border-gray-300
            dark:bg-gray-800 dark:border-gray-700
          ">
            <b>Supervisor Name:</b> {form.supervisorName}
          </div>

          <div className="
            border p-2 rounded mb-2
            bg-gray-100 border-gray-300
            dark:bg-gray-800 dark:border-gray-700
          ">
            <b>Supervisor Phone:</b> {form.supervisorPhone}
          </div>
        </>
      )}

      {/* BUYER */}
      {form.role === "BUYER" && (
        <>
          <div className="
            border p-2 rounded mb-2
            border-gray-300
            dark:border-gray-700
          ">
            <b>Company:</b> {form.companyName}
          </div>

          <div className="
            border p-2 rounded mb-2
            border-gray-300
            dark:border-gray-700
          ">
            <b>Address:</b> {form.address}
          </div>
        </>
      )}
    </div>
  );
}
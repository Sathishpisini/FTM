import { useState } from "react";

export default function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role
    };

    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();

        localStorage.setItem("user", JSON.stringify(data));

        alert("Registered successfully");

        if (data.role === "FARMER") {
          window.location.href = "/add-farm";
        } else {
          window.location.href = "/add-company";
        }

      } else {
        const err = await res.text();
        alert(err);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 rounded shadow
                    bg-white text-black
                    dark:bg-gray-900 dark:text-white">

      <h2 className="text-2xl mb-4 font-semibold text-center">
        Register
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full border p-2 rounded
                     bg-white text-black border-gray-300
                     dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 rounded
                     bg-white text-black border-gray-300
                     dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full border p-2 rounded
                     bg-white text-black border-gray-300
                     dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2 rounded
                     bg-white text-black border-gray-300
                     dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full border p-2 rounded
                     bg-white text-black border-gray-300
                     dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full border p-2 rounded
                     bg-white text-black border-gray-300
                     dark:bg-gray-800 dark:text-white dark:border-gray-600"
          required
        >
          <option value="">Select Role</option>
          <option value="FARMER">Farmer</option>
          <option value="BUYER">Buyer</option>
        </select>

        <button className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded transition">
          Register
        </button>

      </form>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/AuthService";

export const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    emailOrPhone: "",
    password: ""
  });

  // clear old data
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        emailOrPhone: user.emailOrPhone,
        password: user.password
      });

      const token = response.token;

      if (!token) {
        throw new Error("Token not found in response");
      }

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          role: response.role
        })
      );

      localStorage.setItem("role", response.role);

      alert("Login Successful");
      navigate("/");

    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center min-h-screen 
                    bg-gray-100 dark:bg-gray-900">

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 
                   text-gray-800 dark:text-gray-100
                   p-6 shadow-lg rounded w-80"
      >

        <h2 className="text-2xl mb-4 text-center font-bold">
          Login
        </h2>

        {/* EMAIL OR PHONE */}
        <input
          type="text"
          name="emailOrPhone"
          value={user.emailOrPhone}
          placeholder="Email or Phone"
          className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700
                     text-gray-800 dark:text-gray-100
                     p-2 mb-3 w-full rounded focus:outline-none"
          onChange={handleChange}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          value={user.password}
          placeholder="Password"
          className="border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700
                     text-gray-800 dark:text-gray-100
                     p-2 mb-3 w-full rounded focus:outline-none"
          onChange={handleChange}
          required
        />

        {/* LOGIN BUTTON */}
        <button
          className="bg-green-600 hover:bg-green-700 
                     text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>

        <div className="text-center my-3 text-gray-500 dark:text-gray-400">
          OR
        </div>

        {/* REGISTER */}
        <div className="text-center mt-2">
          <p className="text-sm mb-2">
            Don't have an account?
          </p>

          <button
            type="button"
            onClick={handleRegister}
            className="bg-blue-600 hover:bg-blue-700 
                       text-white px-4 py-2 rounded w-full"
          >
            Register
          </button>
        </div>

        {/* OPTIONAL GOOGLE LOGIN */}
        {/*
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full mt-3"
        >
          Login with Google
        </button>
        */}
      </form>
    </div>
  );
};
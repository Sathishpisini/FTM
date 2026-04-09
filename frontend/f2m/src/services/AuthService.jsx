const API = "http://localhost:8080/api/users";

/**
 * REGISTER USER
 */
export const registerUser = async (user) => {
  const response = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  return response.json();
};

/**
 * LOGIN USER
 */
export const loginUser = async (user) => {
  const response = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("Backend returned non-JSON:", text);
    throw new Error(text);
  }

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

/**
 * GET TOKEN
 */
export const getToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  // ✅ Always return with Bearer prefix
  return `Bearer ${token}`;
};

/**
 * LOGOUT
 */
export const logout = () => {
  localStorage.removeItem("token");
};
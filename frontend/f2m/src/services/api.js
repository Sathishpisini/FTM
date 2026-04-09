// src/services/api.js

const API_URL = "http://localhost:8080/api";

/** -------------------- TOKEN HELPER -------------------- **/
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/** -------------------- USERS -------------------- **/
export const getAllUsers = async () => {
  const res = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const getUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.text();
};

/** -------------------- SUPERVISORS -------------------- **/
export const getAllSupervisors = async () => {
  const res = await fetch(`${API_URL}/supervisors`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch supervisors");
  return res.json();
};

export const getSupervisor = async (id) => {
  const res = await fetch(`${API_URL}/supervisors/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch supervisor");
  return res.json();
};

export const addSupervisor = async (supervisor) => {
  const res = await fetch(`${API_URL}/supervisors`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(supervisor),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to add supervisor: ${text}`);
  }

  return res.json();
};

export const deleteSupervisor = async (id) => {
  const res = await fetch(`${API_URL}/supervisors/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete supervisor");
  return res.text();
};

/** -------------------- FARMERS -------------------- **/
export const getAllFarmers = async () => {
  const res = await fetch(`${API_URL}/farmers`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch farmers");
  return res.json();
};

export const getFarmer = async (id) => {
  const res = await fetch(`${API_URL}/farmers/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch farmer");
  return res.json();
};

export const addFarmer = async (farmer) => {
  const res = await fetch(`${API_URL}/farmers`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(farmer),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to add farmer: ${text}`);
  }

  return res.json();
};

export const deleteFarmer = async (id) => {
  const res = await fetch(`${API_URL}/farmers/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    let errorMessage = "Failed to delete farmer";

    try {
      const data = await res.clone().json(); // clone before reading
      errorMessage = data?.message || errorMessage;
    } catch {
      try {
        const text = await res.clone().text();
        errorMessage = text || errorMessage;
      } catch {
        // ignore
      }
    }

    throw new Error(errorMessage);
  }

  return true;
};

/** -------------------- BUYERS -------------------- **/
export const getAllBuyers = async () => {
  const res = await fetch(`${API_URL}/buyers`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch buyers");
  return res.json();
};

export const getBuyer = async (id) => {
  const res = await fetch(`${API_URL}/buyers/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch buyer");
  return res.json();
};
export const getBuyerCompaniesByUser = async (userId) => {
  const res = await fetch(`${API_URL}/buyers/user/${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch buyer companies");

  return res.json();
};

export const deleteBuyer = async (id) => {
  const res = await fetch(`${API_URL}/buyers/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete buyer");
  return res.text();
};

// ✅ Admin → all approved farmers
export const getApprovedFarmers = async () => {
  const res = await fetch(`${API_URL}/farmers?status=APPROVED`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch approved farmers");

  return res.json();
};
export const getApprovedBuyers = async () => {
  const res = await fetch(`${API_URL}/buyers?status=APPROVED`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch approved buyers");
  return res.json();
};
export const getPendingBuyers = async () => {
  const res = await fetch(`${API_URL}/buyers?status=PENDING`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch pending buyers"); // ✅ FIXED
  return res.json();
};


export const getSupervisorFarmers = async () => { 
  const res = await fetch(`${API_URL}/farmers/supervisor`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch supervisor farmers");

  return res.json();
};
/** -------------------- FARM REQUESTS -------------------- **/
export const getFarmRequests = async (status) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:8080/api/farmers?status=${status}`,
    {
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );

  return res.json();
};

// comany request
export const updateBuyerStatus = async (id, status) => {
  const res = await fetch(
    `${API_URL}/buyers/${id}/status?status=${status}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) throw new Error("Failed to update buyer status");

  return res.text();
};
// ✅ Farmer → My Pending Products
export const getMyPendingProducts = async () => {
  const res = await fetch(`${API_URL}/products/pending/my`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch my pending products");
  return res.json();
};

// ✅ Admin → All Pending Products
export const getAllPendingProducts = async () => {
  const res = await fetch(`${API_URL}/products/pending/all`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch pending products");
  return res.json();
};
export const getSupervisorPendingProducts = async () => {
  const res = await fetch(`${API_URL}/products/supervisor/pending`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch supervisor requests");
  return res.json();
};
// ✅ Update product status
export const updateProductStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/products/${id}/status?status=${status}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to update product status");
  return res.json();
};

// SUPERVISOR → only his farmers
export const getSupervisorFarmRequests = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:8080/api/farmers/supervisor/pending`,
    {
      headers: { Authorization: "Bearer " + token }
    }
  );

  return res.json();
};
// ✅ GET PENDING ITEMS
export const getPendingItems = async () => {
  const res = await fetch(
    `${API_URL}/order-items/supervisor/pending-items`,
    {
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) throw new Error("Failed to fetch pending items");

  return res.json();
};
// ✅ Get Completed Items
export const getCompletedItems = async () => {
  const res = await fetch(
    `${API_URL}/order-items/completed-items`,
    {
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) throw new Error("Failed to fetch completed items");

  return res.json();
};
export const getAdminPendingOrders = async () => {
  const response = await fetch(`${API_URL}/admin/pending-items`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin pending orders");
  }

  return response.json();
};
// ✅ APPROVE ITEM
export const approveItem = async (itemId) => {
  const res = await fetch(
    `${API_URL}/order-items/${itemId}/approve`,
    {
      method: "PATCH",
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) throw new Error("Approve failed");

  return res.text();
};

// ✅ REJECT ITEM
export const rejectItem = async (itemId) => {
  const res = await fetch(
    `${API_URL}/order-items/${itemId}/reject`,
    {
      method: "PATCH",
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) throw new Error("Reject failed");

  return res.text();
};
export const getOrderedItems = async () => {
  const res = await fetch(
    `${API_URL}/order-items/ordered-items`,
    {
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) throw new Error("Failed to fetch ordered items");

  return res.json();
};

// ✅ Complete Order Item
export const completeItem = async (itemId) => {
  const res = await fetch(
    `${API_URL}/order-items/${itemId}/complete`,
    {
      method: "PATCH",
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) throw new Error("Failed to complete order");

  return res.text();
};

// ✅ Cancel Order Item
export const cancelItem = async (itemId) => {
  const res = await fetch(
    `${API_URL}/order-items/${itemId}/cancel`,
    {
      method: "PATCH",
      headers: getAuthHeaders()
    }
  );

  if (!res.ok) throw new Error("Failed to cancel order");

  return res.text();
};

export const updateFarmRequestStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  await fetch(
    `http://localhost:8080/api/farmers/${id}/status?status=${status}`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );
};
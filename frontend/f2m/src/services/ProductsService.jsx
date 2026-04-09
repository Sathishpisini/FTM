const API_URL = "http://localhost:8080/api";

export const getAllProducts = async () => {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};
export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};
export const getFeaturedProduct = async (id) => {
  const response = await fetch(`${API_URL}/featuredProducts/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export const getSeasonalProducts = async () => {
  const response = await fetch(`${API_URL}/products/seasonal`);

  if (!response.ok) {
    throw new Error("Failed to fetch seasonal products");
  }

  return response.json();
};


export const getAllFeaturedProducts = async () => {
  const response = await fetch(`${API_URL}/featuredProducts`);

  if (!response.ok) {
    throw new Error("Failed to fetch Featured products");
  }

  return response.json();
};
export const getProductRequests = async () => {
  const response = await fetch(`${API_URL}/product-requests`);

  if (!response.ok) {
    throw new Error("Failed to fetch product requests");
  }

  return response.json();
};

export const updateProductRequestStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/product-requests/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update product request: ${text}`);
  }

  return response.json();
};


/** -------------------- ORDERED ITEMS -------------------- **/

// Get all ordered items
export const getOrderedItems = async () => {
  const response = await fetch(`${API_URL}/ordered-items`);

  if (!response.ok) {
    throw new Error("Failed to fetch ordered items");
  }

  return response.json();
};

// Optional: Get single ordered item (if needed later)
export const getOrderedItem = async (id) => {
  const response = await fetch(`${API_URL}/ordered-items/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch ordered item");
  }

  return response.json();
};

export const getFreshProducts = async () => {
  const response = await fetch(`${API_URL}/products/fresh`);

  if (!response.ok) {
    throw new Error("Failed to fetch fresh products");
  }

  return response.json();
};

export const getOrganicProducts = async () => {
  const response = await fetch(`${API_URL}/products/organic`);

  if (!response.ok) {
    throw new Error("Failed to fetch organic products");
  }

  return response.json();
};

// Update product volume
export const updateProductVolume = async (id, volume) => {
  const response = await fetch(`${API_URL}/products/${id}/volume`, {
    method: "PUT", // or PATCH depending on backend
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ volume }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update product volume: ${text}`);
  }

  return response.json();
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return response.json();
};
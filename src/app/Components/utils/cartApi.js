const API_BASE = "http://localhost:5000/api/cart";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const cartApi = {
  // Get cart
  getCart: async () => {
    const response = await fetch(API_BASE, {
      method: "GET",
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Add to cart
  addToCart: async (productId, quantity) => {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ productId, quantity }),
    });
    return response.json();
  },

  // Update item quantity
  updateItem: async (productId, quantity) => {
    const response = await fetch(`${API_BASE}/item`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify({ productId, quantity }),
    });
    return response.json();
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    const response = await fetch(`${API_BASE}/item`, {
      method: "DELETE",
      headers: getAuthHeader(),
      body: JSON.stringify({ productId }),
    });
    return response.json();
  },

  // Clear cart
  clearCart: async () => {
    const response = await fetch(`${API_BASE}/clear`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

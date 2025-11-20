const API_URL = process.env.API_BASE;

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
    const response = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: getAuthHeader(),
    });
    return response.json();
  },

  // Add to cart
  addToCart: async (productId, quantity) => {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ productId, quantity }),
    });
    return response.json();
  },

  // Update item quantity
  updateItem: async (productId, quantity) => {
    const response = await fetch(`${API_URL}/cart/item`, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify({ productId, quantity }),
    });
    return response.json();
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    const response = await fetch(`${API_URL}/cart/item`, {
      method: "DELETE",
      headers: getAuthHeader(),
      body: JSON.stringify({ productId }),
    });
    return response.json();
  },

  // Clear cart
  clearCart: async () => {
    const response = await fetch(`${API_URL}/cart/clear`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    return response.json();
  },
};

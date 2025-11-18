export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired, clear storage and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/pages/auth/login";
  }

  return response;
};

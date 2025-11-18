/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = "http://localhost:5000/api";

export default function MyAccountPage() {
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [orders, setOrders] = useState([]);

  // Fetch user profile and orders on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        setLoading(true);

        // Fetch user profile
        const userRes = await fetch(`${API_BASE}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
            pincode: userData.pincode || "",
          });
        }

        // Fetch user's orders
        const ordersRes = await fetch(`${API_BASE}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        setError("");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load account data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        city: updatedUser.city || "",
        state: updatedUser.state || "",
        pincode: updatedUser.pincode || "",
      });

      setEditable(false);
      setSuccessMessage("✓ Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 text-gray-800 md:px-20">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
        My Account
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Profile Info Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {/* Name */}
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">Full Name *</span>
              <input
                type="text"
                name="name"
                disabled={!editable}
                onChange={handleChange}
                value={user.name}
                className={`border rounded px-4 py-2 transition ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>

            {/* Email */}
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">
                Email Address *
              </span>
              <input
                type="email"
                name="email"
                disabled={!editable}
                onChange={handleChange}
                value={user.email}
                className={`border rounded px-4 py-2 transition ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>

            {/* Phone */}
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">
                Phone Number *
              </span>
              <input
                type="tel"
                name="phone"
                disabled={!editable}
                onChange={handleChange}
                value={user.phone}
                placeholder="+91XXXXXXXXXX"
                className={`border rounded px-4 py-2 transition ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>

            {/* Address */}
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">Address</span>
              <input
                type="text"
                name="address"
                disabled={!editable}
                onChange={handleChange}
                value={user.address}
                placeholder="Street address"
                className={`border rounded px-4 py-2 transition ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>

            {/* City */}
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">City</span>
              <input
                type="text"
                name="city"
                disabled={!editable}
                onChange={handleChange}
                value={user.city}
                placeholder="City"
                className={`border rounded px-4 py-2 transition ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>

            {/* State */}
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">State</span>
              <input
                type="text"
                name="state"
                disabled={!editable}
                onChange={handleChange}
                value={user.state}
                placeholder="State"
                className={`border rounded px-4 py-2 transition ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>

            {/* Pincode */}
            <label className="flex flex-col">
              <span className="mb-1 font-medium text-gray-700">Pincode</span>
              <input
                type="text"
                name="pincode"
                disabled={!editable}
                onChange={handleChange}
                value={user.pincode}
                placeholder="Pincode"
                className={`border rounded px-4 py-2 transition ${
                  editable
                    ? "border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    : "border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            {!editable ? (
              <button
                onClick={() => setEditable(true)}
                className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition font-semibold"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditable(false)}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                  className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </section>

        {/* Order History Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Order History</h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
              <Link
                href="/product"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                      Order ID
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                      Date
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 border-b border-gray-300">
                      Status
                    </th>
                    <th className="py-3 px-6 text-right text-sm font-medium text-gray-600 border-b border-gray-300">
                      Total
                    </th>
                    <th className="py-3 px-6 text-center text-sm font-medium text-gray-600 border-b border-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order._id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                    >
                      <td className="py-3 px-6 text-sm text-gray-800 font-mono">
                        {order._id?.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 px-6 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold text-xs ${
                            order.orderStatus === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.orderStatus === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.orderStatus === "processing"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.orderStatus?.charAt(0).toUpperCase() +
                            order.orderStatus?.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm text-right font-semibold">
                        ₹{order.totalPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <Link
                          href={`/order-confirmation/${order._id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

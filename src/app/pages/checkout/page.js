/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.API_BASE;

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "card",
  });

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Load cart items and user from backend AND localStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        setUser(userData);

        // Pre-fill email and phone if user is logged in
        if (userData.email) {
          setFormData((prev) => ({
            ...prev,
            email: userData.email,
            phone: userData.phone || "",
          }));
        }

        // Try to fetch cart from backend first
        if (token) {
          try {
            const response = await fetch(`${API_BASE}/cart`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const backendCart = await response.json();
              if (backendCart.items && backendCart.items.length > 0) {
                setCartItems(backendCart.items);
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            console.error("Error fetching backend cart:", err);
          }
        }

        // Fallback to localStorage cart if backend cart is empty
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(localCart);
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/pages/auth/login");
        return;
      }

      if (cartItems.length === 0) {
        setError("Your cart is empty");
        setOrderLoading(false);
        return;
      }

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );
      const shipping = subtotal > 500 ? 0 : 50;
      const tax = subtotal * 0.18;
      const totalPrice = subtotal + shipping + tax;

      // Prepare order data
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product?._id || item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: totalPrice,
      };

      // Send order to backend
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to place order"
        );
      }

      const order = await response.json();

      // Clear both carts
      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutCart");

      // Show success message
      alert(
        `✓ Order placed successfully!\n\nOrder ID: ${order._id}\nEmail and SMS notifications have been sent.`
      );

      // Redirect to order confirmation page
      router.push(`/order-confirmation/${order._id}`);
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-6">
            Add some products before checkout
          </p>
          <Link
            href="/product"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-tr text-gray-800 from-blue-50 via-white to-orange-50">
      <div className="max-w-5xl mx-auto px-2 py-12">
        {/* Progress steps */}
        <div className="w-full mb-8">
          <div className="flex flex-wrap justify-center items-center gap-2 px-2 sm:gap-4 md:gap-6">
            <span className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 p-2 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base">
              1
            </span>
            <span className="font-semibold text-blue-700 text-xs sm:text-sm md:text-base">
              Shipping
            </span>
            <span className="w-6 sm:w-8 md:w-10 border-t-2 border-blue-200"></span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 p-2 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base">
              2
            </span>
            <span className="font-semibold text-blue-700 text-xs sm:text-sm md:text-base">
              Payment
            </span>
            <span className="w-6 sm:w-8 md:w-10 border-t-2 border-blue-200"></span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 p-2 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm md:text-base">
              3
            </span>
            <span className="font-semibold text-gray-400 text-xs sm:text-sm md:text-base">
              Confirmation
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 xl:grid-cols-3 gap-10"
        >
          {/* Left: Info */}
          <div className="xl:col-span-2 space-y-10">
            {/* Cart Preview Mobile */}
            <div className="block xl:hidden mb-4">
              <h2 className="text-xl font-bold mb-2 text-blue-700">
                Order Items
              </h2>
              <ul className="space-y-3">
                {cartItems.map((item) => (
                  <li
                    key={item.product?._id || item._id || item.id}
                    className="flex items-center gap-4 bg-white rounded-lg p-3 shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-blue-700 font-bold text-lg min-w-max">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Form */}
            <div className="bg-white rounded-lg shadow-lg p-7">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">
                1. Shipping Details
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91XXXXXXXXXX"
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-lg p-7 flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">
                2. Choose Payment
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleChange}
                    className="mr-3 accent-blue-600"
                  />
                  <span className="font-semibold text-gray-800">
                    Credit / Debit Card
                  </span>
                </label>
                <label className="flex items-center p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === "upi"}
                    onChange={handleChange}
                    className="mr-3 accent-blue-600"
                  />
                  <span className="font-semibold text-gray-800">UPI</span>
                </label>
                <label className="flex items-center p-5 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="mr-3 accent-blue-600"
                  />
                  <span className="font-semibold text-gray-800">
                    Cash on Delivery
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400 text-white rounded-3xl shadow-xl p-8 sticky top-24 flex flex-col gap-5">
              <h2 className="text-2xl font-extrabold mb-3">Summary</h2>

              {/* Desktop Cart Summary */}
              <div className="hidden xl:block mb-3 max-h-64 overflow-y-auto">
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li
                      key={item.product?._id || item._id || item.id}
                      className="flex items-center gap-3 bg-white/10 rounded-lg p-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-xs truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-blue-100">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-yellow-200 font-semibold text-xs min-w-max">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span>Subtotal</span>
                <span className="font-semibold">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (18%)</span>
                <span className="font-semibold">
                  ₹
                  {tax.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="border-t border-blue-300 my-2"></div>
              <div className="flex justify-between text-xl font-extrabold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={orderLoading}
                className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-blue-900 py-3 rounded-xl font-extrabold shadow transition"
              >
                {orderLoading ? "Processing Order..." : "Place Order"}
              </button>

              <p className="text-xs text-blue-100 mt-2 text-center">
                ✓ Secured payment & encrypted checkout
                <br />
                ✓ Email & SMS confirmation will be sent
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

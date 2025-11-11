/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
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

  // Load cart items from localStorage
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(localCart);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order submitted:", formData, cartItems);
    // Handle POST here
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-linear-to-tr from-blue-50 via-white to-orange-50">
      <div className="max-w-5xl mx-auto px-2 py-12">

        {/* Progress steps */}
        <div className="w-full mb-8">
          <div className="
    flex flex-wrap justify-center items-center gap-2 px-2
    sm:gap-4 md:gap-6
  ">
            <span className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 p-2 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base">1</span>
            <span className="font-semibold text-blue-700 text-xs sm:text-sm md:text-base">Shipping</span>
            <span className="w-6 sm:w-8 md:w-10 border-t-2 border-blue-200"></span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 p-2 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base">2</span>
            <span className="font-semibold text-blue-700 text-xs sm:text-sm md:text-base">Payment</span>
            <span className="w-6 sm:w-8 md:w-10 border-t-2 border-blue-200"></span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 p-2 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm md:text-base">3</span>
            <span className="font-semibold text-gray-400 text-xs sm:text-sm md:text-base">Confirmation</span>
          </div>
        </div>


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 xl:grid-cols-3 gap-10"
        >
          {/* Left: Info */}
          <div className="xl:col-span-2 space-y-10">
            {/* Cart Preview Mobile */}
            <div className="block xl:hidden mb-4">
              <h2 className="text-xl font-bold mb-2 text-blue-700">Order Items</h2>
              {cartItems.length === 0 ? (
                <p className="text-gray-600 mb-2">Your cart is empty.</p>
              ) : (
                <ul className="space-y-3">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-4 bg-white rounded-lg p-3 shadow"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-blue-700 font-bold text-lg min-w-max">
                        ₹{item.price}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Shipping Form */}
            <div className="bg-white rounded-lg shadow-lg p-7">
              <h2 className="text-2xl font-bold text-blue-700 mb-6">
                1. Shipping Details
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">First Name *</label>
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
                  <label className="block text-gray-700 font-semibold mb-2">Last Name *</label>
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
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
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
                  <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Address *</label>
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
                  <label className="block text-gray-700 font-semibold mb-2">City *</label>
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
                  <label className="block text-gray-700 font-semibold mb-2">State *</label>
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
                  <label className="block text-gray-700 font-semibold mb-2">Pincode *</label>
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
                  <span className="font-semibold text-gray-800 flex items-center">
                    Credit / Debit Card
                    <img src="/mastercard.webp" alt="Mastercard" className="ml-2 w-8 h-5" />
                    <img src="/visa.webp" alt="Visa" className="ml-1 w-8 h-5" />
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
                  <span className="font-semibold text-gray-800 flex items-center">
                    UPI
                    <img src="/gpay.webp" alt="UPI" className="ml-2 w-8 h-8" />
                    <img src="/phonepe.webp" alt="UPI" className="ml-1 w-8 h-8" />
                  </span>
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
                  <span className="font-semibold text-gray-800">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>
          {/* Right: Order Card */}
          <div className="xl:col-span-1">
            <div className="bg-linear-to-tr from-blue-600 via-blue-500 to-blue-400 text-white rounded-3xl shadow-xl p-8 sticky top-24 flex flex-col gap-5">
              <h2 className="text-2xl font-extrabold mb-3">Summary</h2>
              {/* Desktop Cart Summary */}
              <div className="hidden xl:block mb-3">
                <ul className="space-y-4">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 bg-white/10 rounded-lg p-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-white text-xs truncate">{item.name}</p>
                        <p className="text-xs text-blue-100">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-yellow-200 font-semibold text-xs min-w-max">
                        ₹{item.price}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
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
                  ₹{tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-blue-300 my-2"></div>
              <div className="flex justify-between text-xl font-extrabold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 py-3 rounded-xl font-extrabold shadow transition"
              >
                Place Order
              </button>
              <p className="text-xs text-blue-100 mt-2 text-center">Secured payment & encrypted checkout</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

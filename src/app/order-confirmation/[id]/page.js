/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function OrderConfirmation() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/orders/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Order not found");
        setOrder(await res.json());
      } catch (err) {
        setError("Unable to load order details");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Order not found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't fetch your order details.
          </p>
          <Link
            href="/product"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ================= STATUS ================= */
  const statusMap = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  };

  const status = statusMap[order.orderStatus] || statusMap.pending;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-10">

        {/* ================= SUCCESS HEADER ================= */}
        <section className="bg-white rounded-3xl shadow p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">✓</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Order Confirmed
          </h1>

          <p className="text-gray-600 mt-2">
            Thank you for shopping with us. Your order has been placed successfully.
          </p>

          <p className="mt-4 text-indigo-600 font-bold text-lg">
            Order ID: {order._id}
          </p>

          <span
            className={`inline-block mt-4 px-5 py-2 rounded-full text-sm font-semibold ${status.color}`}
          >
            {status.label}
          </span>
        </section>

        {/* ================= MAIN GRID ================= */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* ITEMS */}
            <section className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-6">Order Items</h2>

              <div className="space-y-4">
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 border rounded-xl p-4 hover:shadow transition"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SHIPPING */}
            <section className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <p className="font-semibold">
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} –{" "}
                {order.shippingAddress.pincode}
              </p>
              <p className="text-gray-600 mt-2">
                📧 {order.shippingAddress.email}
              </p>
              <p className="text-gray-600">
                📞 {order.shippingAddress.phone}
              </p>
            </section>
          </div>

          {/* RIGHT */}
          <div className="bg-indigo-600 text-white rounded-3xl shadow-xl p-8 h-fit sticky top-24">
            <h2 className="text-2xl font-extrabold mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {order.shippingPrice === 0
                    ? "FREE"
                    : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{order.taxPrice.toLocaleString()}</span>
              </div>
              <div className="border-t border-indigo-400 my-3" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-indigo-100 mt-6 text-center">
              ✓ Secure payment • ✓ Order confirmation sent via Email & SMS
            </p>
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/product"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>

          <button
            onClick={() => window.print()}
            className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function OrderConfirmation() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/pages/auth/login");
          return;
        }

        const response = await fetch(`${API_BASE}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Order not found");
        }

        const orderData = await response.json();
        setOrder(orderData);
        setError("");
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <svg
              className="mx-auto w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 0v2m0-12V7m0 4V9"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error || "Unable to load order details"}</p>
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

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusIcon = {
    pending: "⏳",
    processing: "📦",
    shipped: "🚚",
    delivered: "✓",
    cancelled: "✗",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Thank you for your order. A confirmation email and SMS have been sent to you.
          </p>
          <p className="text-2xl font-bold text-blue-600">
            Order ID: {order._id}
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Status</h2>
          <div className="flex items-center gap-4">
            <div
              className={`px-6 py-3 rounded-full font-semibold text-lg ${
                statusColor[order.orderStatus] || "bg-gray-100 text-gray-800"
              }`}
            >
              {statusIcon[order.orderStatus]} {order.orderStatus?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-gray-600">
                {order.orderStatus === "pending" &&
                  "Your order is pending confirmation. We'll process it shortly."}
                {order.orderStatus === "processing" &&
                  "Your order is being prepared for shipment."}
                {order.orderStatus === "shipped" &&
                  "Your order is on its way to you!"}
                {order.orderStatus === "delivered" && "Your order has been delivered!"}
                {order.orderStatus === "cancelled" &&
                  "Your order has been cancelled."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Details
            </h2>

            <div className="space-y-4">
              <div className="border-b pb-3">
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="border-b pb-3">
                <p className="text-gray-600 text-sm">Payment Method</p>
                <p className="text-gray-900 font-semibold capitalize">
                  {order.paymentMethod}
                </p>
              </div>

              <div className="border-b pb-3">
                <p className="text-gray-600 text-sm">Payment Status</p>
                <p className="text-gray-900 font-semibold">
                  {order.isPaid ? (
                    <span className="text-green-600">✓ Paid</span>
                  ) : (
                    <span className="text-yellow-600">⏳ Pending</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-600 text-sm">Delivery Status</p>
                <p className="text-gray-900 font-semibold">
                  {order.isDelivered ? (
                    <span className="text-green-600">✓ Delivered</span>
                  ) : (
                    <span className="text-blue-600">📦 In Transit</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Shipping Address
            </h2>

            <div className="space-y-2">
              <p className="text-gray-900 font-semibold">
                {order.shippingAddress?.firstName}{" "}
                {order.shippingAddress?.lastName}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress?.address}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.pincode}
              </p>
              <p className="text-gray-600 mt-4">
                <span className="font-semibold">Email:</span>{" "}
                {order.shippingAddress?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Phone:</span>{" "}
                {order.shippingAddress?.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order Items
          </h2>

          <div className="space-y-4">
            {order.orderItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{item.price?.toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Total: ₹{(item.price * item.quantity)?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-8 pt-8 border-t space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{order.itemsPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.shippingPrice === 0
                  ? "FREE"
                  : `₹${order.shippingPrice?.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (18%)</span>
              <span>₹{order.taxPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
              <span>Total Amount</span>
              <span className="text-blue-600">
                ₹{order.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Next?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-1">1.</span>
              <span>
                You'll receive a confirmation email with your order details
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-1">2.</span>
              <span>
                An SMS will be sent when your order is dispatched with tracking details
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-1">3.</span>
              <span>
                Sit back and wait for your order to arrive at your doorstep
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold mt-1">4.</span>
              <span>Share feedback or rate your purchase</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <Link
            href="/product"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}

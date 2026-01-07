/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  /* =========================
     LOAD CART (GUEST + USER)
  ========================== */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("checkoutCart") || "{}");
    if (!stored.items || !stored.items.length) {
      router.push("/pages/carts");
      return;
    }

    setItems(stored.items);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.email) {
      setForm((f) => ({
        ...f,
        email: user.email,
        phone: user.phone || "",
      }));
    }

    setLoading(false);
  }, [router]);

  /* =========================
     PRICE CALCULATION
  ========================== */
  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  /* =========================
     HANDLERS
  ========================== */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        orderItems: items.map((i) => ({
          product: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        shippingAddress: form,
        paymentMethod: form.paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
        isGuest: !token,
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Order failed");

      const order = await res.json();

      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutCart");

      router.push(`/order-confirmation/${order._id}`);
    } catch (err) {
      setError("Unable to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* HEADER */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Secure Checkout
        </h1>

        {error && (
          <div className="mb-6 bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={placeOrder}
          className="grid lg:grid-cols-3 gap-10"
        >
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2 space-y-10">
            {/* SHIPPING */}
            <section className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-xl font-bold mb-4">
                Shipping Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  ["firstName", "First Name"],
                  ["lastName", "Last Name"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                  ["city", "City"],
                  ["state", "State"],
                  ["pincode", "Pincode"],
                ].map(([name, label]) => (
                  <input
                    key={name}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={label}
                    required
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  />
                ))}
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Full Address"
                  required
                  className="md:col-span-2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </section>

            {/* PAYMENT */}
            <section className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-xl font-bold mb-4">
                Payment Method
              </h2>

              {[
                ["cod", "Cash on Delivery"],
                ["razorpay", "UPI / Card / NetBanking"],
              ].map(([val, label]) => (
                <label
                  key={val}
                  className="flex items-center gap-3 border rounded-xl p-4 mb-3 cursor-pointer hover:border-indigo-600"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={val}
                    checked={form.paymentMethod === val}
                    onChange={handleChange}
                    className="accent-indigo-600"
                  />
                  <span className="font-semibold">{label}</span>
                </label>
              ))}

              <p className="text-sm text-gray-500 mt-2">
                🔒 Payments are 100% secure & encrypted
              </p>
            </section>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="bg-indigo-600 text-white rounded-3xl p-8 shadow-xl sticky top-24 h-fit">
            <h2 className="text-2xl font-extrabold mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping ? `₹${shipping}` : "FREE"}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-indigo-400 my-3" />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              disabled={placingOrder}
              className="w-full mt-6 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 py-3 rounded-xl font-extrabold transition"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>

            <p className="text-xs text-indigo-100 mt-4 text-center">
              ✓ Secure checkout<br />
              ✓ Instant confirmation via Email/SMS
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

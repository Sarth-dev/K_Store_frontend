/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cartApi } from "../../Components/utils/cartApi";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD CART
  ========================== */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/pages/auth/login");
          return;
        }

        const data = await cartApi.getCart();
        setCart({
          items: data.items || [],
          totalPrice: data.totalPrice || 0,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load cart");
        setCart({ items: [], totalPrice: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  /* =========================
     UPDATE QUANTITY
  ========================== */
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await handleRemoveItem(productId);
        return;
      }
      const updatedCart = await cartApi.updateItem(productId, quantity);
      setCart({
        items: updatedCart.items || [],
        totalPrice: updatedCart.totalPrice || 0,
      });
    } catch {
      setError("Failed to update cart");
    }
  };

  /* =========================
     REMOVE ITEM
  ========================== */
  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = await cartApi.removeFromCart(productId);
      setCart({
        items: updatedCart.items || [],
        totalPrice: updatedCart.totalPrice || 0,
      });
    } catch {
      setError("Failed to remove item");
    }
  };

  /* =========================
     CHECKOUT
  ========================== */
  const handleCheckout = () => {
    if (!cart.items.length) {
      setError("Cart is empty");
      return;
    }

    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    router.push("/pages/checkout");
  };

  /* =========================
     LOADING
  ========================== */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        Shopping Cart
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!cart.items.length ? (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg mb-6">
            Your cart is empty
          </p>
          <Link
            href="/product"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product?._id || item._id}
                className="flex gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg bg-slate-50"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-indigo-600 font-bold">
                    ₹{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product?._id || item._id,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 border rounded-lg hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="min-w-[32px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.product?._id || item._id,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 border rounded-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end">
                  <p className="font-bold text-lg text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() =>
                      handleRemoveItem(item.product?._id || item._id)
                    }
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 text-white p-8 rounded-3xl shadow-xl sticky top-24">
            <h2 className="text-2xl font-extrabold mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-200 font-semibold">FREE</span>
              </div>

              <div className="border-t border-indigo-300 my-3"></div>

              <div className="flex justify-between text-xl font-extrabold">
                <span>Total</span>
                <span>₹{cart.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-indigo-100 mt-4">
              Prices are inclusive of all applicable taxes
            </p>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 text-indigo-900 py-3 rounded-xl font-extrabold transition"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/product"
              className="block text-center mt-4 text-sm text-indigo-100 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

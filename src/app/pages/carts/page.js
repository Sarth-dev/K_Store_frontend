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
  const [user, setUser] = useState(null);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token) {
          router.push("/pages/auth/login");
          return;
        }

        if (userData) {
          setUser(JSON.parse(userData));
        }

        const data = await cartApi.getCart();
        // Ensure items is always an array
        setCart({
          items: data.items || [],
          totalPrice: data.totalPrice || 0,
        });
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Failed to load cart");
        // Set default empty cart on error
        setCart({ items: [], totalPrice: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

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
    } catch (err) {
      setError("Failed to update cart");
      console.error(err);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = await cartApi.removeFromCart(productId);
      setCart({
        items: updatedCart.items || [],
        totalPrice: updatedCart.totalPrice || 0,
      });
    } catch (err) {
      setError("Failed to remove item");
      console.error(err);
    }
  };

  const handleCheckout = () => {
    if (cart.items && cart.items.length > 0) {
      // Store cart in localStorage for checkout page
      localStorage.setItem("checkoutCart", JSON.stringify(cart));
      router.push("/pages/checkout");
    } else {
      setError("Cart is empty");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center  justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl  mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!cart.items || cart.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4 text-lg">Your cart is empty</p>
          <Link 
            href="/product" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product?._id || item._id}
                  className="flex gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      ₹{item.price?.toLocaleString()}
                    </p>

                    {/* Quantity Control */}
                    <div className="flex items-center text-gray-800 gap-2 mt-3">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product?._id || item._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 bg-gray-100 rounded min-w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product?._id || item._id,
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="text-right flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-lg text-blue-600">
                        ₹{(item.price * item.quantity)?.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveItem(item.product?._id || item._id)
                      }
                      className="text-red-600 hover:text-red-800 font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    ₹{cart.totalPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18%):</span>
                  <span className="font-medium">
                    ₹{(cart.totalPrice * 0.18)?.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Total:</span>
                <span className="text-blue-600">
                  ₹{(cart.totalPrice + cart.totalPrice * 0.18)?.toLocaleString(
                    undefined,
                    { maximumFractionDigits: 0 }
                  )}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/product"
                className="block w-full text-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

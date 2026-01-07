/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function ProductCard({ product }) {
  const router = useRouter();

  const imageUrl =
    product?.images?.length ? product.images[0] : product?.image || "";

  const discountPercent =
    product.originalPrice && product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?._id) return;

    const token = localStorage.getItem("token");

    // ✅ LOGGED-IN → BACKEND CART
    if (token) {
      await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });
    }
    // ✅ GUEST → LOCAL STORAGE CART
    else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((i) => i._id === product._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: imageUrl,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    }

    // optional UX improvement
    router.push("/pages/carts");
  };

  return (
    <div className="group relative bg-white rounded-2xl 
      border border-gray-100 overflow-hidden
      transition hover:shadow-xl hover:-translate-y-0.5">

      <Link href={`/product/${product._id}`} className="block h-full">
        {/* IMAGE */}
        <div className="relative h-[180px] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 
              bg-indigo-600 text-white text-xs font-bold 
              px-3 py-1 rounded-full shadow">
              {discountPercent}% OFF
            </span>
          )}

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-[150px] object-contain 
                transition-transform duration-300 
                group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-1">
            {product.description || "Premium quality product"}
          </p>

          {/* PRICE */}
          <div className="flex items-end justify-between mt-3">
            <div>
              <div className="text-lg font-extrabold text-indigo-700">
                ₹{product.price?.toLocaleString()}
              </div>
              {product.originalPrice && (
                <div className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice?.toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="px-4 py-1.5 text-xs font-bold rounded-full
                border border-indigo-600 text-indigo-700
                hover:bg-indigo-600 hover:text-white transition"
              tabIndex={-1}
            >
              ADD
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

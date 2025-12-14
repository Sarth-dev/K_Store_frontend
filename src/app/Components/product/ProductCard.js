/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product || !product._id) {
      alert("Invalid product");
      return;
    }

    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item) => item._id === product._id
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Added to cart!");
    router.push("/pages/carts");
  };

  const imageUrl = product?.images?.length
    ? product.images[0]
    : product?.image || "";

  const discountPercent =
    product.originalPrice && product.price
      ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
      : 0;

  return (
    <div className="group bg-white rounded-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden h-full">
      <Link href={`/product/${product._id}`} className="flex flex-col h-full">

        {/* Image */}
        <div className="relative h-[150px] sm:h-[170px] md:h-[190px] bg-slate-50 flex items-center justify-center">
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold">
              {discountPercent}% OFF
            </span>
          )}

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="object-contain max-h-full max-w-full transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <span className="text-gray-400 text-xs">No Image</span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-2.5 py-2 sm:px-3 sm:py-3 gap-1">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 min-h-[2.3em]">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-1">
            {product.description || "No description"}
          </p>

          {/* Price + CTA */}
          <div className="mt-auto flex items-center justify-between pt-1">
            <div>
              <div className="text-sm sm:text-base font-bold text-indigo-700">
                ₹{product.price?.toLocaleString()}
              </div>

              {product.originalPrice && (
                <div className="text-[11px] text-gray-400 line-through">
                  ₹{product.originalPrice?.toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="text-[11px] sm:text-xs px-2.5 py-1 rounded-sm font-semibold
                     text-indigo-700 border border-indigo-600
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

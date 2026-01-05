/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product || !product._id) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const index = cart.findIndex((i) => i._id === product._id);

    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/pages/carts");
  };

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

  return (
    <div className="group bg-white rounded-xl border border-gray-100 
      hover:shadow-lg transition-all duration-300 
      flex flex-col overflow-hidden h-full">

      <Link
        href={`/product/${product._id}`}
        className="flex flex-col h-full overflow-hidden"
      >
        {/* IMAGE */}
        <div className="relative h-[150px] sm:h-[170px] md:h-[190px] 
          bg-slate-50 flex items-center justify-center 
          overflow-hidden">

          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 z-10
              bg-indigo-600 text-white text-[10px] px-2 py-0.5 
              rounded font-semibold">
              {discountPercent}% OFF
            </span>
          )}

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain 
                transition-transform duration-200 
                group-hover:scale-105"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <span className="text-gray-400 text-xs">No Image</span>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 px-3 py-3 gap-1 overflow-hidden">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 
            line-clamp-2 min-h-[2.4em]">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-1">
            {product.description || "No description"}
          </p>

          {/* PRICE + CTA */}
          <div className="mt-auto flex items-center justify-between pt-2 gap-2">
            <div className="overflow-hidden">
              <div className="text-sm sm:text-base font-bold text-indigo-700 truncate">
                ₹{product.price?.toLocaleString()}
              </div>

              {product.originalPrice && (
                <div className="text-[11px] text-gray-400 line-through truncate">
                  ₹{product.originalPrice?.toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="shrink-0 text-[11px] sm:text-xs 
                px-3 py-1 rounded font-semibold
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

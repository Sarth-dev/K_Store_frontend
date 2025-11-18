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
    <div className="group bg-white rounded-xl shadow-md flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/product/${product._id}`} className="flex flex-col h-full">
        {/* Product image */}
        {/* Product image */}
        <div className="relative w-full aspect-w-1 aspect-h-1 bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              // Use 'object-contain' to ensure full image visibility without cropping
              className="object-contain max-h-full max-w-full transition-transform duration-200 group-hover:scale-105 bg-white"
              loading="lazy"
              draggable={false}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          ) : (
            <div className="text-gray-400 text-center text-sm">No Image</div>
          )}
        </div>

        {/* Card body */}
        <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 gap-2">
          <h3 className="text-md md:text-lg font-semibold text-gray-900 line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 mb-1 line-clamp-2 min-h-[2.3em]">
            {product.description || "No description available"}
          </p>
          <div className="flex items-end justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-blue-600">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs md:text-sm text-gray-400 line-through">
                  ₹{product.originalPrice?.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded mt-1">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="ml-3 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-xs sm:text-sm md:text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              tabIndex={-1}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

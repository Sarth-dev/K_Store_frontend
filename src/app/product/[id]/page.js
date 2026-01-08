/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import ReviewForm from "@/app/Components/utils/review";
import YouMayLikeThis from "@/app/Components/utils/slider";
import PincodeCheck from "@/app/Components/utils/pincodeCheck";
import ImageZoomLens from "@/app/Components/utils/ImageZoomLens";
import TrustBar from "@/app/Components/utils/trustBar";
import { useLoader } from "@/app/context/LoaderContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

/* Delivery Date Helper */
function getDeliveryDateRange() {
  const today = new Date();
  const min = new Date(today);
  const max = new Date(today);
  min.setDate(today.getDate() + 3);
  max.setDate(today.getDate() + 4);

  const options = { day: "numeric", month: "short" };
  return `${min.toLocaleDateString("en-IN", options)} - ${max.toLocaleDateString(
    "en-IN",
    options
  )}`;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setIsLoading } = useLoader();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deliveryRange = getDeliveryDateRange();

  /* FETCH PRODUCT */
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setIsLoading(true);

        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);

        const all = await fetch(`${API_BASE}/products`).then((r) => r.json());
        setRelated(
          all
            .filter((p) => p._id !== id && p.category === data.category)
            .slice(0, 6)
        );
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    }

    if (id) load();
  }, [id, setIsLoading]);

  /* CART (Guest + Login) */
  async function addToCart(buyNow = false) {
    const token = localStorage.getItem("token");

    if (token) {
      await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((i) => i._id === product._id);

      if (existing) existing.quantity += 1;
      else {
        cart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    router.push(buyNow ? "/pages/checkout" : "/pages/carts");
  }

  /* STATES */
  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-xl text-red-700">
        {error}
        <Link href="/product" className="block mt-4 underline">
          Back to products
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image];

  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

  /* UI */
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-32">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/">Home</Link> /{" "}
          <Link
            href={`/product?category=${product.category}`}
            className="capitalize"
          >
            {product.category}
          </Link>{" "}
          / <span className="font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-14">

          {/* IMAGES */}
          <div>
            <ImageZoomLens src={images[selectedImage]} />

            <div className="flex gap-3 mt-4 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg border ${
                    selectedImage === i
                      ? "border-indigo-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              ⭐ {product.rating?.toFixed(1)} | {product.numReviews} reviews
            </p>

            {/* PRICE */}
            <div className="mt-6 flex items-end gap-4">
              <span className="text-3xl font-extrabold text-indigo-700">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <div>
                  <p className="line-through text-gray-400">
                    ₹{product.originalPrice.toLocaleString()}
                  </p>
                  <span className="text-green-600 font-semibold text-sm">
                    {discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* TRUST */}
            <div className="mt-6">
              <TrustBar />
            </div>

            {/* DELIVERY */}
            <PincodeCheck deliveryRange={deliveryRange} />

            {/* BUY */}
            <div className="hidden md:flex gap-4 mt-8">
              <button
                onClick={() => addToCart(false)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
              >
                Add to Cart
              </button>
              <button
                onClick={() => addToCart(true)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
              >
                Buy Now
              </button>
            </div>

            {/* CONFIDENCE */}
            <div className="mt-8 bg-slate-50 border rounded-xl p-5 text-sm">
              <ul className="space-y-2 text-gray-700">
                <li>✔ 100% Genuine Products</li>
                <li>✔ 7-Day Easy Returns</li>
                <li>✔ Secure Payments & Data Protection</li>
                <li>✔ Trusted by 10,000+ customers</li>
              </ul>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-10">
              <h3 className="text-lg font-bold mb-2">Product Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-24 overflow-x-auto flex gap-4 hide-scrollbar ">
            <YouMayLikeThis
              products={related}
              title="Customers Also Bought"
            />
          </section>
        )}

        {/* REVIEWS */}
        <section className="mt-20 max-w-4xl">
          <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>

          {product.reviews?.length ? (
            product.reviews.map((r) => (
              <div key={r._id} className="border-b py-4">
                <p className="font-semibold">{r.name}</p>
                <p className="text-yellow-500">{"★".repeat(r.rating)}</p>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}

          <ReviewForm productId={product._id} />
        </section>
      </div>

      {/* MOBILE BUY BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t px-4 py-3 flex gap-3 z-50">
        <button
          onClick={() => addToCart(false)}
          className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold"
        >
          Add to Cart
        </button>
        <button
          onClick={() => addToCart(true)}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold"
        >
          Buy Now
        </button>
      </div>
    </>
  );
}

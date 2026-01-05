/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReviewForm from "@/app/Components/utils/review";
import { useLoader } from "@/app/context/LoaderContext";
import YouMayLikeThis from "@/app/Components/utils/slider";
import PincodeCheck from "@/app/Components/utils/pincodeCheck";
import ImageZoomLens from "@/app/Components/utils/ImageZoomLens";
import TrustBar from "@/app/Components/utils/trustBar";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

/* 📦 Delivery Date Helper */
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

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { setIsLoading } = useLoader();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deliveryRange = getDeliveryDateRange();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setIsLoading(true);

        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");

        const productData = await res.json();
        setProduct(productData);

        const allRes = await fetch(`${API_BASE}/products`);
        if (allRes.ok) {
          const all = await allRes.json();
          setRelatedProducts(
            all
              .filter(
                (p) => p._id !== id && p.category === productData.category
              )
              .slice(0, 6)
          );
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id, setIsLoading]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto bg-red-50 p-6 rounded-xl text-red-700">
        {error}
        <Link href="/product" className="block mt-4 underline">
          Back to products
        </Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [product.image];

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      )
    : 0;

  /* 🛒 Cart Actions */
  async function addToCart(redirect) {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/pages/auth/login");

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

    redirect
      ? router.push("/pages/checkout")
      : router.push("/pages/carts");
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-28 bg-white">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/">Home</Link> /{" "}
          <Link
            href={`/product?category=${product.category}`}
            className="capitalize"
          >
            {product.category}
          </Link>{" "}
          / <span className="font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* IMAGE GALLERY */}
          <div className="space-y-4">
            <ImageZoomLens src={images[selectedImage]} />

            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 shrink-0 rounded-lg border ${
                    i === selectedImage
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

          {/* PRODUCT INFO */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            <p className="text-sm text-gray-500 mb-4">
              ⭐ {product.rating?.toFixed(1)} | {product.numReviews} ratings
            </p>

            {/* PRICE */}
            <div className="flex items-end gap-4 mb-6">
              <span className="text-3xl font-extrabold text-indigo-700">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <div>
                  <p className="line-through text-gray-400">
                    ₹{product.originalPrice.toLocaleString()}
                  </p>
                  <span className="text-green-600 text-sm font-semibold">
                    {discountPercent}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* KEY HIGHLIGHTS */}
            <div className="bg-slate-50 border rounded-xl p-4 mb-6">
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✔ Premium quality product</li>
                <li>✔ 7-day easy returns</li>
                <li>✔ 1 year manufacturer warranty</li>
                <li>✔ Trusted by thousands of customers</li>
              </ul>
            </div>

            <TrustBar />
            <PincodeCheck deliveryRange={deliveryRange} />

            {/* DESKTOP ACTIONS */}
            <div className="hidden md:flex gap-4 my-8">
              <button
                onClick={() => addToCart(false)}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => addToCart(true)}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
              >
                BUY NOW
              </button>
            </div>

            {/* DESCRIPTION */}
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* FAQ */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><b>Q:</b> Is this product original?<br />✔ Yes, 100% authentic.</p>
                <p><b>Q:</b> Can I return it?<br />✔ Yes, within 7 days.</p>
                <p><b>Q:</b> Is COD available?<br />✔ Available in select locations.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 overflow-x-hidden">
            <YouMayLikeThis
              products={relatedProducts}
              title="You May Also Like"
              classname="overflow-x-hidden"
            />
          </section>
        )}

        {/* REVIEWS */}
        <section className="mt-20 max-w-4xl">
          <h3 className="text-xl font-bold mb-4">
            Customer Reviews
          </h3>

          {product.reviews?.length ? (
            product.reviews.map((r) => (
              <div key={r._id} className="border-b py-4">
                <p className="font-semibold">{r.name}</p>
                <p className="text-yellow-500">
                  {"★".repeat(r.rating)}
                </p>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}

          <ReviewForm productId={product._id} />
        </section>
      </div>

      {/* MOBILE STICKY BUY BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t z-50 px-4 py-3 flex gap-3">
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

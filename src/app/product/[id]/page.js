/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReviewForm from "@/app/Components/utils/review";
import { useLoader } from "@/app/context/LoaderContext";
import YouMayLikeThis from "@/app/Components/utils/slider";
import PincodeCheck from "@/app/Components/utils/pincodeCheck";
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
  return `${min.toLocaleDateString("en-IN", options)} - ${max.toLocaleDateString("en-IN", options)}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { setIsLoading } = useLoader();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deliveryRange = getDeliveryDateRange();

  useEffect(() => {
    const fetchProduct = async () => {
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
            all.filter(p => p._id !== id && p.category === productData.category).slice(0, 6)
          );
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, setIsLoading]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-100 p-6 rounded text-red-700">
        {error}
        <Link href="/product" className="block mt-4 underline">
          Back to products
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  /* 🛒 Cart Actions */
  const addToCart = async (redirect) => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/pages/auth/login");

    await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: product._id, quantity }),
    });

    redirect ? router.push("/pages/checkout") : router.push("/pages/carts");
  };

  return (
    <div className="max-w-7xl bg-white text-gray-800 mx-auto px-4 md:px-8 pb-24">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/">Home</Link> /{" "}
        <Link href={`/product?category=${product.category}`} className="capitalize">
          {product.category}
        </Link>{" "}
        / <span className="font-semibold">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* IMAGE GALLERY */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl flex justify-center p-4">
            <img
              src={images[selectedImage]}
              className="max-h-[420px] object-contain hover:scale-105 transition"
            />
          </div>

          <div className="flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 border rounded-lg overflow-hidden
                ${i === selectedImage ? "border-indigo-600" : "border-gray-200"}`}
              >
                <img src={img} className="object-contain w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-3">
            <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">
              {product.rating?.toFixed(1)}
            </span>
            <span className="text-gray-500">{product.numReviews} ratings</span>
          </div>

          {/* PRICE */}
          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl font-bold text-indigo-700">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <div>
                <p className="line-through text-gray-400">
                  ₹{product.originalPrice.toLocaleString()}
                </p>
                <span className="text-green-700 text-sm font-semibold">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          {/* TRUST + DELIVERY */}
          <TrustBar />
          <PincodeCheck deliveryRange={deliveryRange} />

          {/* ACTIONS */}
          <div className="flex gap-4 my-6">
            <button
              onClick={() => addToCart(false)}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              ADD TO CART
            </button>
            <button
              onClick={() => addToCart(true)}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              BUY NOW
            </button>
          </div>

          {/* OFFERS */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
            <h4 className="font-semibold mb-2 text-green-700">Available Offers</h4>
            <ul className="text-sm space-y-1">
              <li>✔ Bank Offer: 5% cashback</li>
              <li>✔ Special Price: Extra {discountPercent}% off</li>
              <li>✔ Combo Offer available</li>
            </ul>
          </div>

          {/* DESCRIPTION */}
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>

      {/* RELATED */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <YouMayLikeThis products={relatedProducts} title="You May Also Like" />
        </section>
      )}

      {/* REVIEWS */}
      <section className="mt-16">
        <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
        {product.reviews?.length ? (
          product.reviews.map(r => (
            <div key={r._id} className="border-b py-3">
              <p className="font-semibold">{r.name}</p>
              <p className="text-yellow-500">{"★".repeat(r.rating)}</p>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}
        <ReviewForm productId={product._id} />
      </section>
    </div>
  );
}

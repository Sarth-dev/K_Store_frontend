/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import ProductCard from "./Components/product/ProductCard";
import Link from "next/link";
import SocialProof from "./Components/utils/testi";
import YouMayLikeThis from "./Components/utils/slider";
import { FeaturesSection } from "./Components/utils/assured";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Main() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const products = await res.json();
        setNewArrivals(products.slice(0, 4));
        setFeaturedProducts(products.slice(0, 6));
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url(/ware.avif)] bg-cover bg-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/20" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-white">
          <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-white/10 backdrop-blur">
            Trusted by 10,000+ shoppers
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-3xl">
            Smart shopping, <br />
            <span className="text-indigo-300">done right.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-200 max-w-xl">
            Premium products, fast delivery, and reliable support —
            everything you expect from a modern online store.
          </p>

          <div className="mt-10 flex gap-4">
            <Link href="/product">
              <button className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold shadow-lg">
                Shop Now
              </button>
            </Link>

            <Link href="/product">
              <button className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold">
                Browse Categories
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-10">
          Shop by category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {[
            { name: "Home", image: "/category_img/Kitchen.jpeg", slug: "home" },
            { name: "Storage", image: "/category_img/Storage.jpeg", slug: "storage" },
            { name: "Electronics", image: "/category_img/electronics.jpeg", slug: "electronics" },
            { name: "Fitness", image: "/category_img/Fitness.jpeg", slug: "fitness" },
            { name: "Accessories", image: "/category_img/Accessories.jpeg", slug: "accessories" },
            { name: "Fashion", image: "/category_img/Fashion.jpeg", slug: "fashion" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/product?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl
              hover:bg-gray-50 transition"
            >
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-14 object-contain group-hover:scale-110 transition"
                />
              </div>
              <p className="text-sm font-medium text-gray-800">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            New arrivals
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {newArrivals.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/product">
                  <button className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
                    View all products
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      {!loading && featuredProducts.length > 0 && (
        <section className="max-w-full mx-auto px-6 py-20 overflow-x-scroll">
          <YouMayLikeThis
            products={featuredProducts}
            title="Featured products"
          />
        </section>
      )}

      {/* ================= TRUST ================= */}
      <section className="">
        <FeaturesSection />
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <section className="">
        <SocialProof />
      </section>
    </>
  );
}

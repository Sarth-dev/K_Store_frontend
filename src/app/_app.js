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
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const products = await res.json();

        setNewArrivals(products.slice(0, 4));
        setFeaturedProducts(products.slice(0, 6));
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative mb-20 rounded-2xl overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 bg-[url(/ware.avif)] bg-cover bg-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-800/70 to-indigo-700/40" />

        <div className="relative px-6 py-20 sm:px-12 md:px-20 text-white animate-slideUp">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-2xl">
            Discover Smart Deals at{" "}
            <span className="text-indigo-300">K Store</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-indigo-100 max-w-xl">
            Premium products, unbeatable prices, and a seamless shopping
            experience — all in one place.
          </p>

          <div className="mt-8 flex gap-4">
            <Link href="/product">
              <button className="px-7 py-3 bg-indigo-500 rounded-xl font-semibold shadow-lg
                hover:bg-indigo-600 hover:scale-105 hover:shadow-indigo-500/50 transition-all duration-300">
                Shop Now
              </button>
            </Link>

            <Link href="/categories">
              <button className="px-7 py-3 border border-white/40 rounded-xl
                hover:bg-white/10 hover:scale-105 transition-all">
                Browse Categories
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="my-20 px-4 animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-100 mb-10 border-b-4 border-indigo-600 w-fit">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { name: "Home & Kitchen", image: "/category_img/Kitchen.jpeg", slug: "home" },
            { name: "Storage", image: "/category_img/Storage.jpeg", slug: "storage" },
            { name: "Electronics", image: "/category_img/electronics.jpeg", slug: "electronics" },
            { name: "Fitness", image: "/category_img/Fitness.jpeg", slug: "fitness" },
            { name: "Accessories", image: "/category_img/Accessories.jpeg", slug: "accessories" },
            { name: "Fashion", image: "/category_img/Fashion.jpeg", slug: "fashion" },
          ].map((cat, i) => (
            <Link
              key={i}
              href={`/product?category=${cat.slug}`}
              className="group bg-white rounded-xl p-4 text-center shadow-sm
              hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-24 flex items-center justify-center mb-3 bg-slate-50 rounded-lg overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-contain h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= NEW ARRIVALS ================= */}
      <section className="my-20 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-100 mb-10 border-b-4 border-indigo-600 w-fit">
            New Arrivals
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {newArrivals.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/product">
                  <button className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold
                    hover:bg-indigo-700 hover:scale-105 transition-all">
                    View All Products
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================= OFFER ================= */}
      <section className="relative bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl my-20 overflow-hidden animate-fadeIn">
        <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-white">
            <h3 className="text-4xl font-extrabold mb-3">
              Mega Sale{" "}
              <span className="bg-white/20 px-2 rounded animate-pulse">
                Up to 60% OFF
              </span>
            </h3>
            <p className="text-lg mb-6">
              Limited time offers on best-selling products.
            </p>
            <Link href="/product">
              <button className="px-7 py-3 bg-white text-orange-600 rounded-full font-semibold
                hover:bg-orange-100 hover:scale-105 transition-all">
                Shop the Offer
              </button>
            </Link>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              src="/offer_banner.avif"
              alt="Offer"
              className="h-52 animate-float drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF ================= */}
      <section className="my-16 animate-fadeIn">
        <SocialProof />
      </section>

      {/* ================= FEATURED ================= */}
      {!loading && featuredProducts.length > 0 && (
        <section className="my-20 animate-fadeIn">
          <YouMayLikeThis products={featuredProducts} title="Featured Products" />
        </section>
      )}

      {/* ================= ASSURED ================= */}
      <section className="my-20 animate-fadeIn">
        <FeaturesSection />
      </section>
    </>
  );
}

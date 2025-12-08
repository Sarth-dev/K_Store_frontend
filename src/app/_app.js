/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import ProductCard from "./Components/product/ProductCard";
import Link from "next/link";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import SocialProof from "./Components/utils/testi";
import CustomerReviews from "./Components/utils/review";
import YouMayLikeThis from "./Components/utils/slider";
import { FeaturesSection } from "./Components/utils/assured";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Main() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);

  const visibleCount = 4;

  // Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();

        // Get new arrivals (latest products)
        const latest = products.slice(0, 4);
        setNewArrivals(latest);

        // Get featured products (can be all or based on rating)
        const featured = products.slice(0, 6);
        setFeaturedProducts(featured);

        setError("");
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        // Fallback to empty arrays
        setNewArrivals([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleNext = () => {
    setCurrent((prev) =>
      prev < featuredProducts.length - visibleCount ? prev + 1 : prev
    );
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[url(/ware.avif)] bg-cover bg-bottom text-white rounded-lg p-18 mb-10">
        <div className="px-6 py-16">
          <h1 className="text-5xl font-bold mb-4">Welcome to K Store</h1>
          <p className="text-xl mb-6">Find the best products at amazing prices</p>
          <Link href="/product">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
      </section>
      {/* Shop by Category Section */}
      <section className="my-12 px-4">
        <h2 className="text-3xl font-semibold text-gray-100 mb-6 border-b-4 border-blue-600 w-fit">
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
          ].map((cat, index) => (
            <Link
              key={index}
              href={`/product?category=${cat.slug}`}
              className="group block text-center bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <div className="w-full h-28 flex items-center justify-center overflow-hidden rounded-lg mb-3 bg-gray-50">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="object-contain w-full h-full rounded-md group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <h3 className="text-gray-800 font-semibold group-hover:text-blue-600 transition">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>


      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* New Arrivals Section (Grid) */}
      <section className="my-10">
        <div className="container px-2">
          {/* Section Title */}
          <h2 className="text-4xl font-semibold text-gray-100 mb-8 border-b-4 border-blue-600 w-fit">
            New Arrivals
          </h2>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            </div>
          ) : newArrivals.length > 0 ? (
            <>
              {/* Products Grid */}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
              </div>


              {/* View All Button */}
              <div className="text-center mt-10">
                <Link href="/product">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
                    View All New Arrivals
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No new arrivals available</p>
            </div>
          )}
        </div>
      </section>

      {/* Offer Banner */}
      <section className="relative bg-linear-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl p-0 overflow-hidden my-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 gap-6">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">
              Mega Sale - Up to{" "}
              <span className="bg-white/20 rounded px-2">60% OFF</span>
            </h3>
            <p className="text-white text-lg mb-6">
              Unbeatable deals on new arrivals and exclusive collections.
            </p>
            <Link
              href="/product"
              className="inline-block px-8 py-3 bg-white font-semibold text-orange-600 rounded-full text-lg shadow hover:bg-orange-200 transition"
            >
              Shop the Offer
            </Link>
          </div>
          {/* Banner Image (optional) */}
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src="/offer_banner.avif"
              alt="Limited Time Offer"
              className="h-40 md:h-56 rounded-md drop-shadow-xl"
              loading="lazy"
            />
          </div>
        </div>
        {/* Decorative Blur Circle */}
        <div className="absolute right-0 bottom-0 w-60 h-60 bg-white/20 blur-3xl rounded-full -z-10"></div>
      </section>

      {/* Logos */}
      <section className="w-full h-full mt-0 mb-5">
        <SocialProof />
      </section>

      {/* Featured Products Smooth Slider */}
      {!loading && featuredProducts.length > 0 && (
        <section>
          <YouMayLikeThis
            products={featuredProducts}
            title="Featured Products"
          />
        </section>
      )}

      {/* Assured Section */}
      <section className="w-full h-full">
        <FeaturesSection />
      </section>
    </>
  );
}

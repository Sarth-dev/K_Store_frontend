/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import ProductCard from "./Components/product/ProductCard";
import Link from 'next/link'
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import SocialProof from "./Components/utils/testi";
import CustomerReviews from "./Components/utils/review";
import YouMayLikeThis from "./Components/utils/slider";
import { FeaturesSection } from "./Components/utils/assured";

export default function Main({ newArrivals }) {
  // Featured products data (you can also pass this as a prop)
  const products = [
    { id: 1, name: "Product 1", description: "This is a great product", price: 999, image: "/prodcut1.jpg" },
    { id: 2, name: "Product 2", description: "Another amazing product", price: 1499, image: "/prodcut1.jpg" },
    { id: 3, name: "Product 3", description: "Best seller product", price: 799, image: "/prodcut1.jpg" },
    { id: 4, name: "Product 4", description: "Limited edition", price: 2999, image: "/prodcut1.jpg" },
    { id: 5, name: "Product 5", description: "Hot deal!", price: 499, image: "/prodcut1.jpg" },
    { id: 6, name: "Product 6", description: "Top rated", price: 7999, image: "/prodcut1.jpg" },
  ];

  // For this example, falling back to sample newArrivals if none passed
  newArrivals = newArrivals || [
    { id: 101, name: "New Arrival 1", description: "Fresh style 1", price: 1299, image: "/prodcut1.jpg" },
    { id: 102, name: "New Arrival 2", description: "Fresh style 2", price: 1399, image: "/prodcut1.jpg" },
    { id: 103, name: "New Arrival 3", description: "Fresh style 3", price: 799, image: "/prodcut1.jpg" },
    { id: 104, name: "New Arrival 4", description: "Fresh style 4", price: 1599, image: "/prodcut1.jpg" },
  ];

  // Featured Products Slider Setup
  const [current, setCurrent] = useState(0);
  const visibleCount = 4;

  const handleNext = () => {
    setCurrent((prev) => (prev < products.length - visibleCount ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[url(/ware.avif)] bg-cover bg-bottom  text-white rounded-lg p-18 mb-10">
        <div>
          <h1 className="text-5xl font-bold  mb-4">Welcome to K Store</h1>
          <p className="text-xl mb-6">Find the best products at amazing prices</p>
          <Link href="/product">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* New Arrivals Section (Grid) */}
      <section className="my-10">
        <div className="container  px-2">
          {/* Section Title */}
          <h2 className="text-4xl font-semibold text-gray-100 mb-8 border-b-4 border-blue-600 w-fit">
            New Arrivals
          </h2>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
              <Link href="/product">
                View All New Arrivals
              </Link>
            </button>
          </div>
        </div>
      </section>
      { /* Offer Banner */}
      <section className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl p-0 overflow-hidden my-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 gap-6">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">
              Mega Sale - Up to <span className="bg-white/20 rounded px-2">60% OFF</span>
            </h3>
            <p className="text-white text-lg mb-6">
              Unbeatable deals on new arrivals and exclusive collections.
            </p>
            <Link
              href="/products"
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

      { /* Logos  */}
      <section className="w-full h-full mt-0 mb-5">
        <SocialProof />
      </section>

      {/* Featured Products Smooth Slider */}
      <section>
        <YouMayLikeThis products={products} title="Featured"/>
      </section>



      {/* { Assured Section } */}
      <section className="w-full h-full ">
        <FeaturesSection/>
      </section>
    </>
  );
}

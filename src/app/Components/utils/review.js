/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const reviews = [
  {
    id: 1,
    name: "Sophia Lee",
    avatar: "/profile.avif",
    rating: 5,
    comment:
      "Loved the quality and the fabric! Shipping was fast and customer service was excellent.",
    date: "Oct 12, 2025",
  },
  {
    id: 2,
    name: "James Anderson",
    avatar: "/profile.avif",
    rating: 4,
    comment:
      "Great variety and prices. Shopping experience was smooth and hassle-free.",
    date: "Nov 02, 2025",
  },
  {
    id: 3,
    name: "Aria Patel",
    avatar: "/profile.avif",
    rating: 5,
    comment:
      "Perfect fit and stylish looks! This store has my loyalty for sure.",
    date: "Oct 25, 2025",
  },
];

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000); // Change review every 6 seconds

    return () => clearInterval(interval);
  }, []);

  const review = reviews[currentIndex];

  return (
    <section className="max-w-5xl mx-auto my-20 mb-2 p-6 bg-white rounded-3xl shadow-lg relative overflow-hidden">
      <div className="flex flex-col items-center text-center px-6 relative">
        {/* Overlapping Avatars */}
        <div className="flex mb-4 space-x-2 justify-center ">
          {reviews.map((r, idx) => (
            <img
              key={r.id}
              src={r.avatar}
              alt={r.name}
              className={`w-20 h-20 aspect-square rounded-full border-4 border-white shadow-lg cursor-pointer transition-transform ${
                idx === currentIndex ? "scale-125 z-10" : "scale-90 opacity-60"
              }`}
              title={r.name}
            />
          ))}
        </div>

        {/* Animated Review Content */}
        <div
          key={review.id}
          className="transition-opacity duration-1000 ease-in-out"
          style={{ opacity: 1 }}
        >
          {/* Star Rating */}
          <div className="flex justify-center text-yellow-400 mb-3">
            {[...Array(5)].map((_, idx) => (
              <StarIcon
                key={idx}
                className={`w-6 h-6 ${
                  idx < review.rating ? "fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Comment */}
          <p className="text-lg italic text-gray-700 leading-relaxed max-w-xl mb-6">
            "{review.comment}"
          </p>

          {/* User Name & Date */}
          <div className="text-gray-800 font-semibold text-xl">{review.name}</div>
          <div className="text-gray-500 text-sm mb-6">{review.date}</div>
        </div>
      </div>
    </section>
  );
}

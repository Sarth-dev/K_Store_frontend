/* eslint-disable @next/next/no-img-element */
"use client";

export default function SocialProof() {
  const brands = [
    "Apple",
    "Samsung",
    "Nike",
    "Amazon",
    "Tesla",
    "Gucci",
  ];

  return (
    <section className="bg-gray-50 py-14">
      <p className="text-center text-sm text-gray-500 mb-8">
        Trusted by teams and customers worldwide
      </p>

      <div className="flex flex-wrap justify-center gap-10 opacity-70">
        {brands.map((b) => (
          <span
            key={b}
            className="text-lg font-semibold tracking-wide text-gray-400"
          >
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}

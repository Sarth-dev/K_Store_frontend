/* eslint-disable @next/next/no-img-element */
"use client";

const brandLogos = [
  "/KSTorelogo.webp",
  "/KSTorelogo.webp",
  "/KSTorelogo.webp",
  "/K_Store_Logo.webp",
  "/KSTorelogo.webp",
  // Repeat logos for seamless scroll
  "/KSTorelogo.webp",
  "/KSTorelogo.webp",
  "/KSTorelogo.webp",
  "/KSTorelogo.webp",
  "/KSTorelogo.webp",
];

export default function BrandLogoMarquee() {
  return (
    <section className="overflow-hidden text-black bg-gray-50 py-2">
      <div className="animate-scroll flex max-w-full  justify-between px-8">
        {brandLogos.map((logo, idx) => (
          <img
            src={logo}
            key={idx}
            alt="Brand logo"
            className="h-20 opacity-60 hover:opacity-100 transition"
            loading="lazy"
            draggable={false}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

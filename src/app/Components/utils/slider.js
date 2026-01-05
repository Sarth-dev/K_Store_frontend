import { useState, useEffect, useRef } from "react";
import ProductCard from "../product/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function YouMayLikeThis({ products, title }) {
  const ref = useRef(null);

  const scroll = (dir) => {
    if (!ref.current) return;
    const width = ref.current.offsetWidth;
    ref.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full border hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full border hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      >
        {products.map((p) => (
          <div
            key={p._id}
            className="min-w-[75%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[22%]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

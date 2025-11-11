import { useState, useEffect, useRef } from "react";
import ProductCard from "../../Components/product/ProductCard";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";


export default function YouMayLikeThis({ products , title }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef(null);

  

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(3);
      else setVisibleCount(4);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => setCurrent(prev => (prev > 0 ? prev - 1 : prev));
  const handleNext = () => setCurrent(prev => (prev < products.length - visibleCount ? prev + 1 : prev));

  // Scroll to right card on button click (for smooth mobile effect)
  useEffect(() => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.offsetWidth / visibleCount;
      sliderRef.current.scrollTo({
        left: cardWidth * current,
        behavior: 'smooth'
      });
    }
  }, [current, visibleCount]);

  return (
    <section className="relative py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 mb-4">
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-2 sm:mb-0 text-gray-100">{title}</h2>
        <div className="flex gap-2 justify-end">
          <button
            aria-label="Show previous product"
            onClick={handlePrev}
            disabled={current === 0}
            className={`bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition-colors ${current === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>
          <button
            aria-label="Show next product"
            onClick={handleNext}
            disabled={current >= products.length - visibleCount}
            className={`bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition-colors ${
              current >= products.length - visibleCount ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2" ref={sliderRef}>
        <div className={`flex transition-transform gap-3 sm:gap-4`} style={{minWidth: "100%"}}>
          {products.map(product => (
            <div
              key={product.id}
              className={`
                bg-white rounded-xl shadow-md
                min-w-[80vw] max-w-[80vw] sm:min-w-[45vw] sm:max-w-[300px]
                md:min-w-[30vw] md:max-w-[250px]
                lg:min-w-[22vw] lg:max-w-[220px]
                shrink-0
              `}
              style={{
                marginLeft: 'auto', marginRight: 'auto'
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

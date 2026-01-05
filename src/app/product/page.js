"use client";
import { useState, useEffect } from "react";
import ProductCard from "../Components/product/ProductCard";
import ProductSkeleton from "../Components/product/ProductSkeleton";
import { useLoader } from "@/app/context/LoaderContext";

const PRODUCTS_API =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://k-store-bdz5.onrender.com/api";

const CATEGORIES = [
  { id: "all", name: "All Products" },
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "accessories", name: "Accessories" },
  { id: "home", name: "Home & Kitchen" },
  { id: "fitness", name: "Fitness" },
];

const PRICES = [
  { id: "under-1000", label: "Under ₹1000", test: (p) => p.price < 1000 },
  { id: "1000-3000", label: "₹1000 – ₹3000", test: (p) => p.price >= 1000 && p.price <= 3000 },
  { id: "3000-5000", label: "₹3000 – ₹5000", test: (p) => p.price >= 3000 && p.price <= 5000 },
  { id: "above-5000", label: "Above ₹5000", test: (p) => p.price > 5000 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  const { setIsLoading } = useLoader();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setIsLoading(true);
        const res = await fetch(`${PRODUCTS_API}/products`);
        const data = await res.json();
        setProducts(data);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [setIsLoading]);

  function togglePrice(id) {
    setSelectedPrices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function clearFilters() {
    setSelectedCategory("all");
    setSelectedPrices([]);
  }

  let filtered = [...products];

  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  if (selectedPrices.length) {
    filtered = filtered.filter((p) =>
      selectedPrices.some((pid) => PRICES.find((r) => r.id === pid)?.test(p))
    );
  }

  if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);

  function FilterPanel() {
    return (
      <div className="bg-white rounded-2xl border border-default p-5 space-y-8">
        {/* CATEGORY */}
        <div>
          <h3 className="font-semibold text-base mb-4">Categories</h3>
          <ul className="space-y-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
                  ${
                    selectedCategory === cat.id
                      ? "bg-[rgb(var(--color-primary))] text-white"
                      : "hover:bg-muted text-secondary"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </ul>
        </div>

        {/* PRICE */}
        <div>
          <h3 className="font-semibold text-base mb-4">Price Range</h3>
          <div className="space-y-2">
            {PRICES.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm text-secondary">
                <input
                  type="checkbox"
                  checked={selectedPrices.includes(p.id)}
                  onChange={() => togglePrice(p.id)}
                  className="accent-[rgb(var(--color-primary))]"
                />
                {p.label}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="w-full py-2 rounded-lg text-sm font-medium
          border border-default text-secondary hover:bg-muted"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          {selectedCategory === "all" ? "All Products" : selectedCategory}
        </h1>

        <button
          className="lg:hidden px-4 py-2 rounded-lg bg-[rgb(var(--color-primary))] text-white text-sm"
          onClick={() => setMobileFilterOpen(true)}
        >
          Filters
        </button>
      </div>

      {/* MOBILE FILTER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileFilterOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 p-6 transition-transform lg:hidden
          ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button onClick={() => setMobileFilterOpen(false)}>✕</button>
        </div>
        <FilterPanel />
      </aside>

      {/* LAYOUT */}
      <div className="flex gap-8">

        {/* DESKTOP FILTER */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28">
            <FilterPanel />
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="flex-1">

          {/* SORT BAR */}
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-default">
            <p className="text-sm text-secondary">
              Showing {filtered.length} products
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm px-3 py-2 rounded-lg border border-default text-secondary"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* GRID */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-secondary">
              No products found.
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

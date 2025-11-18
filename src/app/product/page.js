 "use client";
import { useState, useEffect } from "react";
import ProductCard from "../Components/product/ProductCard";
import { useLoader } from "@/app/context/LoaderContext";

const PRODUCTS_API = "http://localhost:5000/api/products";

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
  {
    id: "1000-3000",
    label: "₹1000 - ₹3000",
    test: (p) => p.price >= 1000 && p.price <= 3000,
  },
  {
    id: "3000-5000",
    label: "₹3000 - ₹5000",
    test: (p) => p.price >= 3000 && p.price <= 5000,
  },
  { id: "above-5000", label: "Above ₹5000", test: (p) => p.price > 5000 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   const { setIsLoading } = useLoader();

  // Fetch products from backend on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(PRODUCTS_API);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setError("");
      } catch (err) {
        setError("Error loading products. Please try again later.");
        console.error("Fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setIsLoading]);

  function handlePriceChange(id) {
    setSelectedPrices((prices) =>
      prices.includes(id)
        ? prices.filter((pid) => pid !== id)
        : [...prices, id]
    );
  }

  // Filtering products
  let filtered = products;
  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }
  if (selectedPrices.length > 0) {
    filtered = filtered.filter((p) =>
      selectedPrices.some((priceId) => PRICES.find((pr) => pr.id === priceId).test(p))
    );
  }

  // Sorting
  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  function clearFilters() {
    setSelectedCategory("all");
    setSelectedPrices([]);
  }

  // Filter sidebar/drawer content
  function FilterContent() {
    return (
      <div className="bg-white text-gray-800 p-2 rounded">
        {/* Categories */}
        <h3 className="text-xl font-bold mb-2">Categories</h3>
        <ul className="space-y-2 mb-4">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
        {/* Price Range */}
        <h3 className="text-xl font-bold mb-2">Price Range</h3>
        <div className="space-y-2 mb-4">
          {PRICES.map((price) => (
            <label key={price.id} className="flex items-center">
              <input
                checked={selectedPrices.includes(price.id)}
                onChange={() => handlePriceChange(price.id)}
                type="checkbox"
                className="mr-2 accent-blue-600"
              />
              <span className="text-gray-700">{price.label}</span>
            </label>
          ))}
        </div>
        <button
          className="w-full px-4 py-2 bg-gray-200 rounded-lg text-blue-700 font-semibold"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* MOBILE/TABLET: filter button & drawer */}
      <div className="flex justify-end lg:hidden mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
          onClick={() => setMobileFilterOpen(true)}
        >
          Filters
        </button>
      </div>

      {/* Overlay for Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 ${mobileFilterOpen ? "block" : "hidden"}`}
        onClick={() => setMobileFilterOpen(false)}
      />

      {/* Filter Drawer on Mobile/Tablet */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] bg-white shadow-2xl p-6 transform transition-transform duration-200
          ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="text-3xl font-bold pb-2 text-gray-800"
          >
            &times;
          </button>
        </div>
        <FilterContent />
      </aside>

      {/* Main Section Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar for desktop (always shown) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterContent />
        </aside>

        {/* Products List Area */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-gray-600 font-medium">
              Showing {filtered.length} products
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading products...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Products grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.length > 0 ? (
                filtered.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full py-12">
                  No products found for this filter.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

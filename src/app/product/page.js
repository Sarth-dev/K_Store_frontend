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
  { id: "1000-3000", label: "₹1000 - ₹3000", test: (p) => p.price >= 1000 && p.price <= 3000 },
  { id: "3000-5000", label: "₹3000 - ₹5000", test: (p) => p.price >= 3000 && p.price <= 5000 },
  { id: "above-5000", label: "Above ₹5000", test: (p) => p.price > 5000 },
];

// 📦 Delivery Date Helper
function getDeliveryDateRange() {
  const today = new Date();
  const min = new Date(today);
  const max = new Date(today);

  min.setDate(today.getDate() + 3);
  max.setDate(today.getDate() + 4);

  const options = { day: "numeric", month: "short" };
  return `${min.toLocaleDateString("en-IN", options)} - ${max.toLocaleDateString("en-IN", options)}`;
}


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setIsLoading } = useLoader();
  const deliveryRange = getDeliveryDateRange();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setIsLoading(true);

        const res = await fetch(`${PRODUCTS_API}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data);
        setError("");
      } catch (err) {
        setError("Error loading products. Please try again later.");
        setProducts([]);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [setIsLoading]);

  function handlePriceChange(id) {
    setSelectedPrices((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function clearFilters() {
    setSelectedCategory("all");
    setSelectedPrices([]);
  }

  // Filtering
  let filtered = [...products];

  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  if (selectedPrices.length > 0) {
    filtered = filtered.filter((p) =>
      selectedPrices.some((pid) => {
        const rule = PRICES.find((pr) => pr.id === pid);
        return rule ? rule.test(p) : false;
      })
    );
  }

  // Sorting
  if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);

  function FilterContent() {
    return (
      <div className="bg-white p-4 rounded-xl text-gray-800 animate-fadeIn">
        <h3 className="text-lg font-bold mb-3">Categories</h3>
        <ul className="space-y-2 mb-6">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all
                  ${selectedCategory === cat.id
                    ? "bg-indigo-600 text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700"}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold mb-3">Price Range</h3>
        <div className="space-y-2 mb-6">
          {PRICES.map((price) => (
            <label key={price.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedPrices.includes(price.id)}
                onChange={() => handlePriceChange(price.id)}
                className="accent-indigo-600"
              />
              {price.label}
            </label>
          ))}
        </div>

        <button
          onClick={clearFilters}
          className="w-full py-2 bg-gray-100 rounded-lg text-indigo-700 font-semibold hover:bg-gray-200"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        Home / {selectedCategory === "all" ? "All Products" : selectedCategory}
      </div>

      {/* Mobile Filter Button */}
      <div className="flex justify-end lg:hidden mb-4">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
        >
          Filters
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 shadow-2xl transform transition-transform
          ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Filters</h3>
          <button onClick={() => setMobileFilterOpen(false)} className="text-2xl">&times;</button>
        </div>
        <FilterContent />
      </aside>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-64">
          <FilterContent />
        </aside>

        <div className="flex-1">
          {/* Sort Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center mb-6">
            <p className="text-gray-600">Showing {filtered.length} products</p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border text-gray-500 px-3 py-2 rounded-lg"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Products */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  deliveryRange={deliveryRange}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">
              No products found for this filter.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

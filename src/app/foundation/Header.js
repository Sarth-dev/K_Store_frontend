/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:5000/api";

export default function Header() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Load cart count from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  // Handle profile menu click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle body overflow when nav is open
  useEffect(() => {
    if (navOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [navOpen]);

  // Handle search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search function
  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      const response = await fetch(
        `${API_BASE}/products?search=${encodeURIComponent(searchQuery)}`
      );

      if (response.ok) {
        const data = await response.json();
        // Filter results by search query (in case backend doesn't support search)
        const filtered = data.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 8)); // Show max 8 results
        setShowSearchResults(filtered.length > 0);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearchResults(false);
      setNavOpen(false);
    }
  };

 

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-4 flex items-center justify-between relative">
        {/* Mobile: Hamburger */}
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Open menu"
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <svg width="26" height="26" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h18M4 16h18"
            />
          </svg>
        </button>

        {/* Mobile: Centered logo */}
        <div className="absolute left-1/2 top-2 md:hidden transform -translate-x-1/2">
          <Link href="/" className="block">
            <img
              src="/K_Store_Logo.webp"
              alt="K Store"
              className="w-14 h-14 aspect-auto"
            />
          </Link>
        </div>

        {/* Desktop logo on left */}
        <div className="hidden md:flex shrink-0">
          <Link href="/" className="block">
            <img
              src="/K_Store_Logo.webp"
              alt="K Store"
              className="w-20 h-20 aspect-auto"
            />
          </Link>
        </div>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {searchLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading results...
                </div>
              ) : (
                <>
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      href={`/product/${product._id}`}
                      onClick={() => {
                        setSearchQuery("");
                        setShowSearchResults(false);
                      }}
                    >
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition border-b last:border-b-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-blue-600 font-bold">
                            ₹{product.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/product?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                  >
                    <div className="px-4 py-3 text-center text-blue-600 font-semibold bg-gray-50 hover:bg-gray-100 transition">
                      View all results
                    </div>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Desktop nav and profile */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          <Link
            href="/product"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Products
          </Link>
          <Link
            href="/pages/carts"
            className="relative text-gray-700 hover:text-blue-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              aria-label="User profile menu"
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-600 transition"
            >
              <img
                src="/profile.avif"
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-gray-800 font-semibold">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email || "guest@mail.com"}
                  </p>
                </div>
                {user ? (
                  <>
                    <Link
                      href="/pages/myaccount"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                      
                    >
                      My Account
                    </Link>
                    <Link
                      href="/pages/auth/logout"
                      className="block py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                     
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/pages/auth/login"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                      
                    >
                      Login
                    </Link>
                    <Link
                      href="/pages/auth/register"
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                      
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile profile on right */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setShowProfileMenu((v) => !v)}
            aria-label="User profile"
            ref={profileRef}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-600 transition"
          >
            <img
              src="/profile.avif"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </button>
          {showProfileMenu && (
            <div className="absolute right-4 top-16 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-gray-800 font-semibold">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.email || "guest@example.com"}
                </p>
              </div>
              {user ? (
                <>
                  <Link
                    href="/pages/myaccount"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(true)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/pages/auth/logout"
                    className="block py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                    onClick={() => setNavOpen(false)}
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-200 ${navOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setNavOpen(false)}
      />

      {/* Mobile drawer */}
      <nav
        className={`fixed top-0 left-0 w-11/12 max-w-xs h-full bg-white shadow-lg z-50 transform transition-transform duration-300 flex flex-col py-4 px-5 md:hidden overflow-y-auto ${navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close button */}
        <button
          className="mb-6 self-end p-2 text-gray-700 hover:bg-gray-200 rounded-full"
          onClick={() => setNavOpen(false)}
          aria-label="Close menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Drawer logo */}
        <Link href="/" className="block mx-auto mb-4" onClick={() => setNavOpen(false)}>
          <img
            src="/K_Store_Logo.webp"
            alt="K Store"
            className="w-16 h-16 aspect-auto"
          />
        </Link>

        {/* Drawer search */}
        <form onSubmit={handleSearchSubmit} className="flex mb-5">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-l-lg"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Drawer navigation */}
        <Link
          href="/product"
          className="block py-2 px-3 rounded-lg hover:bg-gray-100 text-base font-medium"
          onClick={() => setNavOpen(false)}
        >
          Products
        </Link>
        <Link
          href="/pages/carts"
          className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 text-base font-medium"
          onClick={() => setNavOpen(false)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Cart
          {cartCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        <hr className="my-4" />

        {/* Drawer profile actions */}
        {user ? (
          <>
            <Link
              href="/pages/myaccount"
              className="block py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              onClick={() => setNavOpen(false)}
            >
              My Account
            </Link>
            <Link
              href="/pages/auth/logout"
              className="block py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              onClick={() => setNavOpen(false)}
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/pages/auth/login"
              className="block py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              onClick={() => setNavOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/pages/auth/register"
              className="block py-2 px-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              onClick={() => setNavOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

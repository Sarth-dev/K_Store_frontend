/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function Header() {
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  /* INIT */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch { }
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  }, []);

  /* OUTSIDE CLICK HANDLERS */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* LOCK SCROLL */
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
  }, [navOpen]);

  /* SEARCH */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(
          `${API_BASE}/products?search=${encodeURIComponent(searchQuery)}`
        );
        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(filtered.slice(0, 8));
          setShowSearchResults(true);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/product?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setShowSearchResults(false);
    setNavOpen(false);
  };

  return (
    <header className="bg-white sticky text-gray-700 top-0 z-50 shadow-sm">
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center  gap-0">
          <button
            onClick={() => setNavOpen(true)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            ☰
          </button>


        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <img
            src="/K_Store_Logo.webp"
            alt="K Store"
            className="w-14 md:w-20"
          />
        </Link>
        </div>

        {/* DESKTOP SEARCH */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <form onSubmit={handleSearchSubmit} className="w-full flex">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-5 bg-blue-600 text-white rounded-r-lg">
              Search
            </button>
          </form>

          {showSearchResults && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-[999]">
              {searchLoading ? (
                <p className="p-4 text-center text-gray-500">Loading...</p>
              ) : (
                searchResults.map((p) => (
                  <Link
                    key={p._id}
                    href={`/product/${p._id}`}
                    onClick={() => setShowSearchResults(false)}
                    className="flex gap-3 p-3 hover:bg-gray-100"
                  >
                    <img src={p.image} className="w-10 h-10 rounded" />
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-sm font-bold text-blue-600">
                        ₹{p.price}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <nav className="flex items-center gap-4">
          {/* DESKTOP LINKS */}
          <Link href="/product" className="hidden md:block font-medium hover:text-blue-600">
            Products
          </Link>

          {/* CART */}
          <Link href="/pages/carts" className="relative">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs
                w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((v) => !v);
              }}
              className="w-9 h-9 rounded-full overflow-hidden border"
            >
              <img src="/profile.avif" alt="Profile" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-[999]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold">{user?.name || "Guest User"}</p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "guest@mail.com"}
                  </p>
                </div>

                {user ? (
                  <>
                    <Link href="/pages/myaccount" className="block px-4 py-2 hover:bg-gray-100">
                      My Account
                    </Link>
                    <Link href="/pages/auth/logout" className="block px-4 py-2 hover:bg-gray-100">
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/pages/auth/login" className="block px-4 py-2 hover:bg-gray-100">
                      Login
                    </Link>
                    <Link href="/pages/auth/register" className="block px-4 py-2 hover:bg-gray-100">
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden ${navOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setNavOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform ${navOpen ? "translate-x-0" : "-translate-x-full"
          } md:hidden`}
      >
        <div className="p-4">
          <button onClick={() => setNavOpen(false)}>✕</button>
        </div>

        <div className="p-4 flex flex-col">
          <span className="font-semibold mb-2">Categories</span>
          <Link className="py-2 border-b" href="/product?category=home">Home & Kitchen</Link>
          <Link className="py-2 border-b" href="/product?category=fashion">Fashion</Link>
          <Link className="py-2 border-b" href="/product?category=electronics">Electronics</Link>
          <Link className="py-2 border-b" href="/product?category=accessories">Accessories</Link>
        </div>
      </aside>
    </header>
  );
}

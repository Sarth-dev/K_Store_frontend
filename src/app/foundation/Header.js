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
      } catch {}
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
   setCartCount(cart.reduce((sum, i) => sum + i.quantity, 0));
  }, []);

  /* CLOSE DROPDOWNS ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* LOCK SCROLL WHEN MOBILE MENU OPEN */
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
  }, [navOpen]);

  /* SEARCH */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    const timer = setTimeout(async () => {
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

    return () => clearTimeout(timer);
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
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* MAIN BAR */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">

        {/* MOBILE LEFT */}
        <button
          onClick={() => setNavOpen(true)}
          className="md:hidden text-2xl px-2"
        >
          ☰
        </button>

        {/* LOGO */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          
          <img
            src="/New_logo2.png"
            alt="Brand Logo"
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        {/* DESKTOP SEARCH */}
        <div
          ref={searchRef}
          className="hidden md:flex flex-1 max-w-xl mx-8 relative"
        >
          <form onSubmit={handleSearchSubmit} className="flex w-full">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands & more"
              className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button className="px-5 bg-indigo-600 text-white rounded-r-lg">
              Search
            </button>
          </form>

          {showSearchResults && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-50">
              {searchLoading ? (
                <p className="p-4 text-center text-gray-500">Searching…</p>
              ) : (
                searchResults.map((p) => (
                  <Link
                    key={p._id}
                    href={`/product/${p._id}`}
                    onClick={() => setShowSearchResults(false)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100"
                  >
                    <img src={p.image} className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-sm font-bold text-indigo-600">
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

          {/* DESKTOP LINK */}
          <Link
            href="/product"
            className="hidden md:block font-medium hover:text-indigo-600"
          >
            Products
          </Link>

          {/* CART */}
          <Link href="/pages/carts" className="relative text-xl">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold">{user?.name || "Guest User"}</p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "Login to continue"}
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
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          navOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setNavOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 flex justify-between items-center">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setNavOpen(false)}>✕</button>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <span className="text-xs text-gray-500 uppercase">Categories</span>
          <Link href="/product?category=home" className="py-2 border-b">Home & Kitchen</Link>
          <Link href="/product?category=fashion" className="py-2 border-b">Fashion</Link>
          <Link href="/product?category=electronics" className="py-2 border-b">Electronics</Link>
          <Link href="/product?category=accessories" className="py-2">Accessories</Link>
        </div>
      </aside>
    </header>
  );
}

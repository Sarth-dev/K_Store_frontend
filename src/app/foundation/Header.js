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

  /* ---------------- INIT ---------------- */
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

  /* ----------- CLOSE PROFILE ON OUTSIDE CLICK ----------- */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* ----------- CLOSE SEARCH DROPDOWN ----------- */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* ----------- LOCK SCROLL WHEN NAV OPEN ----------- */
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
  }, [navOpen]);

  /* ---------------- SEARCH ---------------- */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
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
    <header className="bg-white text-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between relative">

        {/* MOBILE LEFT */}
        <button
          onClick={() => setNavOpen(true)}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          ☰
        </button>

        {/* LOGO (CENTER ON MOBILE) */}
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

        {/* MOBILE RIGHT ICONS */}
        <div className="flex items-center gap-3 md:hidden">
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
                  <p className="font-semibold">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "guest@mail.com"}
                  </p>
                </div>

                {user ? (
                  <>
                    <Link
                      href="/pages/myaccount"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/pages/auth/logout"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/pages/auth/login"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      href="/pages/auth/register"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

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
          <button
            className="mb-4"
            onClick={() => setNavOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="p-4 flex flex-col">
         <span className="w-full bg-amber-200 p-2">Categories</span>
          <Link  className="p-2 border-b" href="/product?category?home&kitchen" onClick={() => setNavOpen(false)}>
            Home & Kitchen
          </Link>
          <Link className="p-2 border-b" href="/product?category?Fashion" onClick={() => setNavOpen(false)}>
            Fashion
          </Link>
          <Link  className="p-2 border-b" href="/product?category?Electronics" onClick={() => setNavOpen(false)}>
            Electronics
          </Link>
          <Link className="p-2 border-b" href="/product?category?Accessories" onClick={() => setNavOpen(false)}>
            Accessories
          </Link>
          <Link className="p-2" href="/product?category" onClick={() => setNavOpen(false)}>
            More Categories..
          </Link>
        </div>
      </aside>
    </header>
  );
}

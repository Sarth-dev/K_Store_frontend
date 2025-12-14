"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";

function FooterAccordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:mb-0 mb-4 text-center md:text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between md:justify-start
        text-lg font-semibold md:cursor-default md:mb-4 mb-2 py-2
        md:p-0 bg-gray-800 md:bg-transparent rounded-lg px-4 md:px-0"
        type="button"
      >
        <span className="mx-auto md:mx-0">{title}</span>
        <span className="md:hidden text-xl">{open ? "−" : "+"}</span>
      </button>

      <div className={`md:block ${open ? "block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">

          {/* BRAND */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/K_Store_Logo.webp"
              alt="K Store"
              className="w-20 mb-4"
            />
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              K Store is your trusted destination for quality products,
              fast delivery, and reliable customer support.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="text-xs bg-gray-800 px-3 py-1 rounded-full">
                🔒 Secure
              </span>
              <span className="text-xs bg-gray-800 px-3 py-1 rounded-full">
                🚚 Fast Delivery
              </span>
              <span className="text-xs bg-gray-800 px-3 py-1 rounded-full">
                ↩ Easy Returns
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <FooterAccordion title="Quick Links">
            <ul className="space-y-2 text-sm text-center md:text-left">
              {[
                { href: "/Services/quick/about", label: "About Us" },
                { href: "/Services/quick/contact", label: "Contact Us" },
                { href: "/Services/quick/faq", label: "FAQs" },
                { href: "/Services/quick/shipping", label: "Shipping Information" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* CUSTOMER SERVICE */}
          <FooterAccordion title="Customer Service">
            <ul className="space-y-2 text-sm text-center md:text-left">
              {[
                { href: "/Services/customer-service/returns", label: "Returns & Refunds" },
                { href: "/Services/customer-service/terms", label: "Terms & Conditions" },
                { href: "/Services/customer-service/privacy", label: "Privacy Policy" },
                { href: "/Services/customer-service/support", label: "Customer Support" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* CONTACT */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>📧 support@kstore.com</li>
              <li>📞 +91 12345 67890</li>
              <li>📍 Chhatrapati Sambhajinagar, Maharashtra</li>
              <li className="text-xs text-gray-500">
                Mon – Sat | 9:00 AM – 6:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* TRUST BAR */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
          <div className="bg-gray-800 rounded-lg py-3">🔐 Secure Payments</div>
          <div className="bg-gray-800 rounded-lg py-3">💳 COD Available</div>
          <div className="bg-gray-800 rounded-lg py-3">🚚 3–4 Day Delivery</div>
          <div className="bg-gray-800 rounded-lg py-3">↩ 7-Day Returns</div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} K Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

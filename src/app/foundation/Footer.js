"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";

function FooterAccordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:space-y-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="md:hidden w-full flex items-center justify-between py-3 font-semibold text-gray-200"
        type="button"
      >
        {title}
        <span className="text-lg">{open ? "−" : "+"}</span>
      </button>

      <div className={`${open ? "block" : "hidden"} md:block`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <img
              src="/New_Logo2.png"
              alt="ravendelle"
              className="w-56 mb-5 rounded-md"
            />

            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Ravendelle is a modern shopping destination offering premium
              products, fast delivery, and a trusted customer experience.
            </p>

            {/* TRUST TAGS */}
            <div className="flex flex-wrap gap-3 mt-5">
              {["Secure Payments", "Fast Delivery", "Easy Returns"].map((t) => (
                <span
                  key={t}
                  className="text-xs border border-white/10 px-3 py-1 rounded-full text-gray-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <FooterAccordion title="Quick Links">
            <ul className="space-y-3 text-sm">
              <li><Link href="/Services/quick/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/Services/quick/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/Services/quick/faq" className="hover:text-white">FAQs</Link></li>
              <li><Link href="/Services/quick/shipping" className="hover:text-white">Shipping Info</Link></li>
            </ul>
          </FooterAccordion>

          {/* CUSTOMER SERVICE */}
          <FooterAccordion title="Customer Service">
            <ul className="space-y-3 text-sm">
              <li><Link href="/Services/customer-service/returns" className="hover:text-white">Returns & Refunds</Link></li>
              <li><Link href="/Services/customer-service/terms" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/Services/customer-service/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/Services/customer-service/support" className="hover:text-white">Support</Link></li>
            </ul>
          </FooterAccordion>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>support@ravendelle.com</li>
              <li>+91 12345 67890</li>
              <li>Chhatrapati Sambhajinagar, MH</li>
              <li className="text-xs text-gray-500">
                Mon – Sat · 9:00 AM – 6:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 my-12"></div>

        {/* TRUST STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-center">
          {[
            "🔐 Secure Payments",
            "💳 COD Available",
            "🚚 Fast Shipping",
            "↩ 7-Day Returns",
          ].map((item) => (
            <div
              key={item}
              className="border border-white/10 rounded-xl py-4 text-gray-300"
            >
              {item}
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Ravendelle. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

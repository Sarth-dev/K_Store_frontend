"use client"
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useState } from 'react';

function FooterAccordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:mb-0 mb-4">
      {/* Heading acts as a toggle on mobile */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex md:cursor-default items-center justify-between md:mb-4 text-lg font-semibold mb-2 md:p-0 py-2 px-4 md:bg-transparent bg-gray-700 rounded md:text-left text-left"
        type="button"
      >
        {title}
        <span className="md:hidden">{open ? "−" : "+"}</span>
      </button>
      <div className={`md:block ${open ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* About */}
          <div>
            <img className="w-20 h-20 aspect-auto mb-4" src="/K_Store_Logo.webp" alt="K Store" />
            <p className="text-gray-400">
              Your trusted online shopping destination for quality products at great prices.
            </p>
          </div>

          {/* Quick Links with accordion */}
          <FooterAccordion title="Quick Links">
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white">Shipping Info</Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* Customer Service with accordion */}
          <FooterAccordion title="Customer Service">
            <ul className="space-y-2">
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white">Returns</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white">Support</Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@kstore.com</li>
              <li>Phone: +91 12345 67890</li>
              <li>Address: Chhatrapati Sambhajinagar, Maharashtra. </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 K Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

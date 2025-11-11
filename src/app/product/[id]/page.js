"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/app/Components/product/ProductCard";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import CustomerReviews from "@/app/Components/utils/review";
import YouMayLikeThis from "@/app/Components/utils/slider";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // Responsive visible counts state
  const [visibleCount, setVisibleCount] = useState(4);

  // Quantity and Image selection state
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Featured products - sample data, replace with real API or DB fetch
  const products = [
    { id: 1, name: "Product 1", description: "This is a great product", price: 999, image: "/prodcut1.jpg" },
    { id: 2, name: "Product 2", description: "Another amazing product", price: 1499, image: "/prodcut1.jpg" },
    { id: 3, name: "Product 3", description: "Best seller product", price: 799, image: "/prodcut1.jpg" },
    { id: 4, name: "Product 4", description: "Limited edition", price: 2999, image: "/prodcut1.jpg" },
    { id: 5, name: "Product 5", description: "Hot deal!", price: 499, image: "/prodcut1.jpg" },
    { id: 6, name: "Product 6", description: "Top rated", price: 7999, image: "/prodcut1.jpg" },
  ];

  // Single product details - replace with real API fetch based on id
  const product = {
    id,
    name: "Wireless Headphones",
    description: "Premium wireless headphones with active noise cancellation and long battery life.",
    price: 2999,
    originalPrice: 4999,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    images: ["/prodcut1.jpg", "/headfone.avif", "/prodcut1.jpg"],
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Fast charging support",
      "Comfortable over-ear design",
    ],
    specifications: {
      Brand: "MyBrand",
      Model: "WH-1000",
      Connectivity: "Bluetooth 5.0",
      Battery: "30 hours",
      Weight: "250g",
    },
  };

  // Handle window resize and update visibleCount for responsive slider
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(3);
      else setVisibleCount(4);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Carousel current position state for featured products
  const [current, setCurrent] = useState(0);
  const maxIndex = products.length - visibleCount;

  const handlePrev = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev < maxIndex ? prev + 1 : prev));
  };

  // Add to cart handler
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      existingCart.push({ ...product, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
    router.push("/pages/carts");
  };

  // Buy now handler
  const handleBuyNow = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity = quantity;
    } else {
      existingCart.push({ ...product, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(existingCart));
    router.push("/pages/checkout");
  };

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Product images */}
        <div>
          <div className="relative h-96 mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage] || "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 border-2 rounded-lg overflow-hidden ${
                  selectedImage === index ? "border-blue-600" : "border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt={`View ${index + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-blue-600">₹{product.price}</span>
              <span className="text-xl text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                )}
                % OFF
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Stock status */}
          <div className="mb-6">
            {product.inStock ? (
              <span className="text-green-600 font-semibold">✓ In Stock</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Quantity:</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="border-t p-8">
        <h3 className="text-2xl font-bold mb-4">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-1/2">{key}:</span>
              <span className="text-gray-600 w-1/2">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* "You may like this" featured products slider */}
   <section>
    <YouMayLikeThis products={products} title="You May Like this"/>
   </section>


      {/* Customer Reviews */}
      <section className="p-8">
        <CustomerReviews />
      </section>
    </div>
  );
}

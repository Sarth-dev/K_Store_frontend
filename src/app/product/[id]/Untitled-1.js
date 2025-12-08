/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CustomerReviews from "@/app/Components/utils/review";
import { useLoader } from "@/app/context/LoaderContext";
import YouMayLikeThis from "@/app/Components/utils/slider";

const API_BASE = "http://localhost:5000/api";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { setIsLoading } = useLoader();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount] = useState(4);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productRes = await fetch(`${API_BASE}/products/${id}`);
        if (!productRes.ok) throw new Error("Product not found");
        const productData = await productRes.json();
        setProduct(productData);

        const allProductsRes = await fetch(`${API_BASE}/products`);
        if (allProductsRes.ok) {
          const allProducts = await allProductsRes.json();
          const related = allProducts
            .filter((p) => p._id !== id && p.category === productData.category)
            .slice(0, 6);
          setRelatedProducts(related);
        }
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, setIsLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error || "Product not found"}</p>
        <Link href="/product" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to products
        </Link>
      </div>
    );
  }

  // Fallback images array
  const images = product?.images?.length ? product.images : [product.image];

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const offers = [
    {
      label: "Bank Offer",
      info: "5% cashback on Axis Bank Flipkart Debit Card up to ₹750",
    },
    {
      label: "Special Price",
      info: `Get extra ${discountPercent}% off`,
    },
  ];

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/pages/auth/login");
    try {
      const response = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      });
      if (response.ok) {
        alert("Added to cart!");
        router.push("/pages/carts");
      } else {
        alert("Failed to add to cart");
      }
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/pages/auth/login");
    try {
      const response = await fetch(`${API_BASE}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      });
      if (response.ok) {
        router.push("/pages/checkout");
      } else {
        alert("Failed to proceed");
      }
    } catch (err) {
      alert("Error processing request");
    }
  };

  return (
    <div className="bg-white text-gray-800 rounded-xl shadow-sm overflow-hidden max-w-7xl mx-auto my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
        {/* Left side sticky image section for desktop */}
        <div className="hidden md:block">
          <div className="sticky top-24">
            <div className="flex gap-6">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg overflow-hidden w-16 h-16 ${selectedImage === idx ? "border-blue-600" : "border-gray-200"}`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="object-contain w-full h-full"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
              {/* Main Image */}
              <div className="relative flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden group border">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="object-contain max-h-[400px] w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                  loading="eager"
                  draggable={false}
                  style={{ maxHeight: 400, background: "white" }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Show image section flat on mobile */}
        <div className="block md:hidden mb-6">
          <div className="flex gap-3">
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="object-contain max-h-64 w-full"
                loading="eager"
                draggable={false}
                style={{ maxHeight: 256, background: "white" }}
              />
            </div>
          </div>
        </div>
        {/* Right side product info and scrollable content */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="md:text-2xl text-xl font-bold mb-2 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold">{product.rating?.toFixed(1)}</span>
              <span className="text-gray-500">{product.numReviews} Ratings</span>
            </div>
            <div className="flex items-end gap-4 mb-4">
              <span className="text-3xl font-bold text-blue-700">₹{product.price?.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                  <span className="text-green-700 bg-green-100 px-2 py-1 rounded font-semibold text-xs tracking-wide">{discountPercent}% off</span>
                </>
              )}
            </div>
            <div className="mb-4">
              <h4 className="font-bold text-green-700 mb-1">Available offers</h4>
              <ul className="space-y-1">
                {offers.map((offer, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <span className="font-bold text-green-700 mr-2">✓</span>
                    <span className="font-medium text-gray-700">{offer.label} <span className="text-gray-500 font-normal">{offer.info}</span></span>
                  </li>
                ))}
              </ul>
            </div>
            {product.countInStock > 0 ? (
              <div className="my-2 text-green-600 font-medium">In Stock</div>
            ) : (
              <div className="my-2 text-red-600 font-medium">Out of Stock</div>
            )}
            <div className="flex items-center gap-4 mt-4 mb-8">
              <label className="font-semibold mr-2">Qty:</label>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition">−</button>
              <span className="font-semibold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition">+</button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <button onClick={handleAddToCart} disabled={product.countInStock <= 0} className="flex-1 bg-orange-400 text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                <span className="mr-2">🛒</span> ADD TO CART
              </button>
              <button onClick={handleBuyNow} disabled={product.countInStock <= 0} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                <span className="mr-2">⚡</span> BUY NOW
              </button>
            </div>
          </div>

          {/* warranty */}
          <div>
            <h4 className="text-lg font-semibold mt-4 mb-2">Warranty</h4>
            <p className="text-gray-700">{product.warranty}</p>
          </div>

          {/* specification */}
          <div className="bg-white rounded-md shadow p-6 mt-8 max-w-lg">
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Specification</h4>
            <div className="divide-y divide-gray-100">
              <div className="flex py-2">
                <span className="w-48 text-gray-500 font-medium">Name</span>
                <span className="flex-1 font-semibold text-gray-800">{product.name}</span>
              </div>
              <div className="flex py-2">
                <span className="w-48 text-gray-500 font-medium">Brand</span>
                <span className="flex-1 text-gray-800">{product.brand}</span>
              </div>
              <div className="flex py-2">
                <span className="w-48 text-gray-500 font-medium">Category</span>
                <span className="flex-1 text-gray-800">{product.category}</span>
              </div>
              <div className="flex py-2">
                <span className="w-48 text-gray-500 font-medium">Country of Origin</span>
                <span className="flex-1 text-gray-800">{product.countryOfOrigin}</span>
              </div>
              {product.color && (
                <div className="flex py-2">
                  <span className="w-48 text-gray-500 font-medium">Color</span>
                  <span className="flex-1 text-gray-800">{product.color}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex py-2">
                  <span className="w-48 text-gray-500 font-medium">Dimensions</span>
                  <span className="flex-1 text-gray-800">{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex py-2">
                  <span className="w-48 text-gray-500 font-medium">Weight</span>
                  <span className="flex-1 text-gray-800">{product.weight}</span>
                </div>
              )}
              {product.manufacturer && (
                <div className="flex py-2">
                  <span className="w-48 text-gray-500 font-medium">Manufacturer</span>
                  <span className="flex-1 text-gray-800">{product.manufacturer}</span>
                </div>
              )}
              {product.hsnCode && (
                <div className="flex py-2">
                  <span className="w-48 text-gray-500 font-medium">HSN Code</span>
                  <span className="flex-1 text-gray-800">{product.hsnCode}</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex py-2">
                  <span className="w-48 text-gray-500 font-medium">Warranty</span>
                  <span className="flex-1 text-gray-800">{product.warranty}</span>
                </div>
              )}
              {/* Add more fields as required */}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-semibold mt-4 mb-2">Description</h4>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Extended detailed specifications if any */}
      {product.specifications && (
        <div className="border-t px-8 py-6 bg-gray-50">
          <h3 className="text-xl font-bold mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex border-b pb-2">
                <span className="font-semibold text-gray-700 w-1/2">{key}:</span>
                <span className="text-gray-600 w-1/2">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews */}
      <section className="px-8 pb-10">
        <h3 className="text-xl font-bold my-4">Customer Reviews</h3>
        <CustomerReviews reviews={product.reviews || []} />
        {/* <ReviewForm productId={id} onNewReview={handleNewReview} /> */}
      </section>

      {/* Suggested Products */}
      {relatedProducts.length > 0 && (
        <section className="px-8 pb-10">
          <YouMayLikeThis products={relatedProducts} title="You May Like This" className="text-gray-800" />
        </section>
      )}
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReviewForm from "@/app/Components/utils/review";
import { useLoader } from "@/app/context/LoaderContext";
import YouMayLikeThis from "@/app/Components/utils/slider";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const productRes = await fetch(`${API_BASE}/products/${id}`);
        if (!productRes.ok) throw new Error("Product not found");
        const productData = await productRes.json();
        setProduct(productData);

        // Fetch related products
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
        <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to products
        </Link>
      </div>
    );
  }
  //handlecart
 const handleAddToCart = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return router.push("/pages/auth/login");
  }

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

//handel buy niw
const handleBuyNow = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return router.push("/pages/auth/login");
  }

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


  // Fallback images array
  const images = product?.images?.length ? product.images : [product.image];

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Delivery Estimate
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const deliveryDate = tomorrow.toLocaleDateString();

  // ADD BREADCRUMB
  const breadcrumb = (
    <div className="text-sm text-gray-600 mb-4 px-8">
      <Link href="/" className="hover:underline">Home</Link>
      {" / "}
      <Link href={`/products?category=${product.category}`} className="hover:underline capitalize">
        {product.category}
      </Link>
      {" / "}
      <span className="font-semibold text-gray-800">{product.name}</span>
    </div>
  );

  // Offers List
  const offers = [
    { label: "Bank Offer", info: "5% cashback on select cards" },
    { label: "Special Price", info: `Extra ${discountPercent}% off applied` },
    { label: "Combo Offer", info: "Buy 2+ items & save more" },
  ];

  return (
    <div className="bg-white text-gray-800 rounded-xl shadow-sm max-w-full mx-auto my-4">

      {/* Breadcrumb */}
      {breadcrumb}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">

        {/* LEFT SIDE — Image Gallery */}
        <div className="hidden md:block">
          <div className="sticky top-10 space-y-4">

            {/* Main Image with Zoom */}
            <div className="relative group border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="object-contain max-h-[450px] w-full transition-transform duration-300 group-hover:scale-110"
                draggable={false}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`border-2 rounded-lg w-20 h-20 overflow-hidden ${selectedImage === idx ? "border-blue-600" : "border-gray-200"}`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT SIDE — PRODUCT DETAILS */}
        <div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2 leading-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">{product.rating?.toFixed(1)}</span>
            <span className="text-gray-500">{product.numReviews} Ratings</span>
          </div>

          {/* Price Block */}
          <div className="flex items-end gap-4 mb-4">
            <span className="text-4xl font-bold text-blue-700">₹{product.price?.toLocaleString()}</span>

            {product.originalPrice && (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-lg">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-green-700 bg-green-100 px-2 py-1 rounded font-semibold text-xs">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Product Highlights */}
          <div className="bg-gray-50 border rounded-md p-4 mb-6">
            <h4 className="font-semibold text-lg mb-2">Product Highlights</h4>
            <ul className="list-disc ml-5 text-gray-700 space-y-1 text-sm">
              <li>Premium quality and durable material</li>
              <li>Perfect for home, kitchen & storage use</li>
              <li>Lightweight and easy to clean</li>
              <li>Elegant design suitable for any home</li>
              <li>Fast delivery and 7-day return policy</li>
            </ul>
          </div>

          {/* Trust & Assurance */}
          <div className="bg-white border rounded-md p-4 mb-6 shadow-sm">
            <h4 className="font-semibold mb-3">Why Shop With Us?</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <span className="text-2xl">🔒</span>
                <p className="mt-1 font-medium">Secure Checkout</p>
              </div>
              <div>
                <span className="text-2xl">🚚</span>
                <p className="mt-1 font-medium">Fast Delivery</p>
              </div>
              <div>
                <span className="text-2xl">↩️</span>
                <p className="mt-1 font-medium">Easy Returns</p>
              </div>
              <div>
                <span className="text-2xl">⭐</span>
                <p className="mt-1 font-medium">{product.rating?.toFixed(1)} / 5 Rating</p>
              </div>
            </div>
          </div>
{/* Share Buttons */}
<div className="mt-6 mb-10">
  <h4 className="font-semibold mb-2">Share this product</h4>
  <div className="flex gap-3">
    <button
      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`)}
      className="bg-green-500 text-white px-4 py-2 rounded-md text-sm"
    >
      WhatsApp
    </button>
    <button
      onClick={() => navigator.clipboard.writeText(window.location.href)}
      className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
    >
      Copy Link
    </button>
  </div>
</div>



          {/* Delivery Info */}
          <div className="bg-blue-50 p-4 rounded-md border mb-4 text-sm">
            <p className="font-semibold">🚚 Delivery by <span className="text-blue-700">{deliveryDate}</span></p>
            <p className="text-gray-700 mt-1">Cash on Delivery Available · Easy 7-Day Returns</p>
          </div>

          {/* Offers */}
          <div className="mb-4">
            <h4 className="font-bold text-green-700 mb-1">Available Offers</h4>
            <ul className="space-y-1">
              {offers.map((offer, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <span className="font-bold text-green-700 mr-2">✓</span>
                  <span>{offer.label}: <span className="text-gray-600">{offer.info}</span></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-4 mb-8">
            <label className="font-semibold">Qty:</label>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 bg-gray-200 rounded text-lg hover:bg-gray-300">−</button>
            <span className="text-lg">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 bg-gray-200 rounded text-lg hover:bg-gray-300">+</button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <button className="flex-1 bg-orange-400 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-500">
              ADD TO CART
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700">
              BUY NOW
            </button>
          </div>

          {/* Specification Table */}
          <div className="bg-white rounded-md shadow p-6 mb-8">
            <h4 className="text-lg font-semibold mb-4">Specifications</h4>
            <div className="divide-y">
              <SpecRow label="Name" value={product.name} />
              <SpecRow label="Brand" value={product.brand} />
              <SpecRow label="Category" value={product.category} />
              <SpecRow label="Color" value={product.color} />
              <SpecRow label="Dimensions" value={product.dimensions} />
              <SpecRow label="Weight" value={product.weight} />
              <SpecRow label="Manufacturer" value={product.manufacturer} />
            </div>
          </div>

          {/* Description */}
          <h4 className="text-lg font-semibold mb-2">Description</h4>
          <p className="text-gray-700 mb-4">{product.description}</p>

        </div>
      </div>
      {/* Sticky Mobile Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t p-3 flex justify-between items-center md:hidden z-50">
        <div>
          <p className="font-bold text-lg text-blue-700">₹{product.price.toLocaleString()}</p>
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold text-sm"
          >
            Add
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold text-sm"
          >
            Buy
          </button>
        </div>
      </div>

{/* Frequently Bought Together */}
{relatedProducts.length >= 2 && (
  <section className="px-8 pb-10">
    <h3 className="text-xl font-bold mb-4">Frequently Bought Together</h3>

    <div className="flex flex-col md:flex-row gap-6 items-center">
      {/* Product A */}
      <div className="flex items-center gap-4 border rounded-lg p-4 bg-gray-50">
        <img src={product.images?.[0] || product.image} className="w-20 h-20 object-contain" />
        <p className="font-medium text-gray-700 max-w-[150px]">{product.name}</p>
      </div>

      <span className="text-3xl font-bold text-gray-500">+</span>

      {/* Product B */}
      <div className="flex items-center gap-4 border rounded-lg p-4 bg-gray-50">
        <img src={relatedProducts[0].image} className="w-20 h-20 object-contain" />
        <p className="font-medium text-gray-700 max-w-[150px]">{relatedProducts[0].name}</p>
      </div>

      {/* Total */}
      <div>
        <p className="font-bold text-lg text-blue-600">
          ₹{(product.price + relatedProducts[0].price).toLocaleString()}
        </p>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md mt-2 text-sm">
          Add Both to Cart
        </button>
      </div>
    </div>
  </section>
)}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="px-8 pb-10">
          <YouMayLikeThis products={relatedProducts} title="You May Also Like" />
        </section>
      )}

      {/* Reviews */}
      <section className="px-8 pb-10">
        <h3 className="text-xl font-bold my-4">Customer Reviews</h3>

        {product.reviews?.length > 0 ? (
          product.reviews.map((review) => (
            <div key={review._id} className="mb-4 border-b pb-2">
              <p className="font-bold">{review.name}</p>
              <p className="text-yellow-500">{'★'.repeat(review.rating)}</p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet</p>
        )}

        <ReviewForm productId={product._id} />
      </section>
    </div>
  );
}

/* Helper Component for Table Row */
function SpecRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex py-2">
      <span className="w-48 text-gray-500 font-medium">{label}</span>
      <span className="flex-1 text-gray-800">{value}</span>
    </div>
  );
}

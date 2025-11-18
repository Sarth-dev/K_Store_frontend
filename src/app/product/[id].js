// src/app/products/[id]/page.js
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import Link from 'next/link';

export default function ProductDetail() {
  const params = useParams();
  const id = params.id;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Sample product data - replace with API call
  const product = {
    id: id,
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with active noise cancellation and long battery life.',
    price: 2999,
    originalPrice: 4999,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    images: [
      '/images/product1.jpg',
      '/images/product1-2.jpg',
      '/images/product1-3.jpg',
    ],
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Bluetooth 5.0',
      'Fast charging support',
      'Comfortable over-ear design',
    ],
    specifications: {
      'Brand': 'MyBrand',
      'Model': 'WH-1000',
      'Connectivity': 'Bluetooth 5.0',
      'Battery': '30 hours',
      'Weight': '250g',
    }
  };

  const handleAddToCart = () => {
    console.log('Adding to cart:', { product, quantity });
    // Add cart logic here
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Product Images */}
        <div>
          <div className="relative h-96 mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage] || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 border-2 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'border-blue-600' : 'border-gray-300'
                }`}
              >
                <Image src={img} alt={`View ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-blue-600">₹{product.price}</span>
              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Stock Status */}
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
            <button className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
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

      {/* Back to Products */}
      <div className="p-8 pt-0">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}

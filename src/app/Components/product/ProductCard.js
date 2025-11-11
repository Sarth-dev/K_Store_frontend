"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    
    // Add to cart logic (save to localStorage or context)
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // New item, add to cart
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Navigate to cart page
    router.push('/pages/carts');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={product.image || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              ₹{product.price}
            </span>
            <button 
              onClick={handleAddToCart}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

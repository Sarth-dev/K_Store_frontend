"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("checkoutCart");

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push("/pages/auth/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          {/* Checkmark Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            See You Soon!
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            You have been successfully logged out of your account.
          </p>

          {/* Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800 font-medium">
              ✨ Redirecting to login page...
            </p>
          </div>

          {/* Manual redirect button */}
          <Link
            href="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mb-4 block"
          >
            Return to Login
          </Link>

          <Link
            href="/"
            className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition block"
          >
            Go to Home
          </Link>
        </div>

        {/* Footer message */}
        <p className="text-center text-gray-600 mt-8">
          Thanks for shopping with K Store!
        </p>
      </div>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      router.push("/pages/auth/login");
    }, 2500);
    return () => clearTimeout(timer);
  }, [logout, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Logged Out</h1>
        <p className="text-gray-500 mb-6">
          You’ve been securely logged out.
        </p>

        <p className="text-sm text-indigo-600">Redirecting to login…</p>
      </div>
    </div>
  );
}

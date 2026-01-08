/* eslint-disable @next/next/no-img-element */
"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="relative flex flex-col items-center">

        {/* Pulsing Rings */}
        <div className="relative w-40 h-40">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full border border-indigo-300/40"
              style={{
                animation: "pulse 2.8s ease-out infinite",
                animationDelay: `${i * 0.6}s`,
              }}
            />
          ))}

          {/* Center Card */}
          <div className="absolute inset-8 rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl border border-white/50 flex items-center justify-center">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
             <img src="/logo.png" alt="ravendelle"/>
            </span>
          </div>
        </div>

        <h1 className="mt-10 text-2xl font-extrabold text-gray-900">
          Ravendelle
        </h1>

        <p className="mt-2 text-sm text-gray-500 animate-pulse">
          Loading premium experience…
        </p>

        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: scale(0.6);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

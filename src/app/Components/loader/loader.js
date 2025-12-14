"use client";

export default function PulseRingsLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent from-indigo-50 to-blue-100">
      <div className="relative w-32 h-32">
        {/* Pulsing rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-blue-500"
            style={{
              animation: `pulse-ring 2s ease-out infinite`,
              animationDelay: `${i * 0.6}s`,
              opacity: 1 - i * 0.3,
            }}
          ></div>
        ))}

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-blue-600 animate-bounce"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
          </svg>
        </div>
      </div>

      <p className="mt-12 text-xl font-semibold text-gray-800">K Store</p>
      <p className="text-gray-500 mt-2 animate-pulse">
        Loading amazing products...
      </p>

      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

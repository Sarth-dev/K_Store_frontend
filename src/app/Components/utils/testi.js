"use client";

export default function SocialProof() {
  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Orders Delivered" },
    { value: "4.8★", label: "Average Rating" },
    { value: "99%", label: "On-time Delivery" },
  ];

  return (
    <section className="bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-2xl font-extrabold text-gray-900">
              {s.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

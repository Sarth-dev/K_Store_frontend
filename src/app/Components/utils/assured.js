const FEATURES = [
  {
    icon: "🚚",
    title: "Reliable Delivery",
    text: "Fast, trackable shipping with trusted partners across India.",
  },
  {
    icon: "🎧",
    title: "Human Support",
    text: "Real people, real help — before and after your purchase.",
  },
  {
    icon: "🛡️",
    title: "Secure Payments",
    text: "Industry-standard encryption and multiple payment options.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Built for confident shopping
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-14">
          Every part of our platform is designed to be simple, transparent,
          and secure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-gray-800 rounded-2xl p-8 hover:-translate-y-1 transition"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

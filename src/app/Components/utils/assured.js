const FEATURES = [
  {
    icon: "🚚",
    title: "Reliable Delivery",
    subtitle: "Orders are processed quickly and shipped with trusted partners.",
    info: "Track your order at every step and shop without worry.",
    accent: "from-indigo-500 to-blue-500",
  },
  {
    icon: "🎧",
    title: "Dedicated Support",
    subtitle: "Real humans ready to help when you need it.",
    info: "Chat, email or call us — we’re always here for you.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    icon: "🛡️",
    title: "Safe & Secure Payments",
    subtitle: "Your payments are protected with industry-grade security.",
    info: "Multiple payment options with complete peace of mind.",
    accent: "from-orange-500 to-pink-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          Why Shop with <span className="text-indigo-400">K Store</span>?
        </h2>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          We focus on quality, transparency, and a smooth shopping experience —
          so you can shop with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {FEATURES.map(({ icon, title, subtitle, info, accent }, i) => (
          <div
            key={i}
            className="group relative bg-gray-900 rounded-2xl p-8 text-center
                       border border-gray-800 shadow-lg
                       hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            {/* Icon */}
            <div
              className={`mx-auto mb-6 flex items-center justify-center
                          w-16 h-16 rounded-full bg-gradient-to-r ${accent}
                          text-3xl shadow-lg`}
            >
              {icon}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {title}
            </h3>

            <p className="text-gray-300 text-sm mb-3">
              {subtitle}
            </p>

            <p className="text-sm text-indigo-300">
              {info}
            </p>

            {/* Hover Glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0
                            group-hover:opacity-10 transition pointer-events-none
                            from-indigo-500 via-transparent to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}

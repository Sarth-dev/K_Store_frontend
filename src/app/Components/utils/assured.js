const FEATURES = [
  {
    icon: "🚚",
    title: "Free Shipping",
    subtitle: "Fast delivery for all prepaid orders over Rs.249.",
    info: "Arrives in 5-7 business days. Enjoy worry-free online shopping!",
  },
  {
    icon: "🎧",
    title: "Customer Support",
    subtitle: "Live chat & help for all queries.",
    info: "Reach us by email, phone, or instant messaging. Instant support, always!",
  },
  {
    icon: "🛡️",
    title: "Secure Payments",
    subtitle: "100% payment protection on all orders.",
    info: "Choose from multiple payment options and shop with confidence.",
  },
];

export function FeaturesSection() {
  return (
    <section
      className="features-section "
      style={{
        display: "flex",
        gap: "2rem",
        background: "#222",
        color:"white",
        padding: "3rem 1rem",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {FEATURES.map(({ icon, title, subtitle, info }, i) => (
        <div
          key={i}
          className="feature-card"
          style={{
            background: "linear-gradient(135deg, #232526 40%, #414345 100%)",
            borderRadius: "1.5rem",
            padding: "2rem",
            minWidth: "250px",
            maxWidth: "340px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            textAlign: "center",
            color: "#f8f8f8",
            flex: "1 1 300px",
            margin: "1rem 0",
            transition: "transform 0.2s, box-shadow 0.2s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div
            style={{
              fontSize: "2.75rem",
              marginBottom: ".95rem",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "50%",
              width: "3.5rem",
              height: "3.5rem",
              lineHeight: "3.5rem",
              display: "inline-block",
              marginBottom: "1.1rem",
            }}
          >
            {icon}
          </div>
          <h2
            style={{
              marginBottom: ".5rem",
              fontSize: "1.35rem",
              letterSpacing: "1px",
              fontWeight: 700,
            }}
          >
            {title}
          </h2>
          <p style={{ fontWeight: 500, marginBottom: ".5rem", color: "#e0e0e0", fontSize: "1rem" }}>
            {subtitle}
          </p>
          <span style={{ color: "#7fd6f4", fontSize: ".97rem" }}>{info}</span>
        </div>
      ))}
      <style>{`
        @media (max-width: 900px) {
          .features-section {
            flex-direction: column;
            align-items: center;
            gap: 1.2rem;
          }
          .feature-card {
            max-width: 96vw !important;
          }
        }
      `}</style>
    </section>
  );
}

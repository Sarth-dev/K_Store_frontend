import "./globals.css";
import Header from "./foundation/Header";
import Footer from "./foundation/Footer";
import GlobalLoader from "./Components/loader/GlobalLoader";
import { LoaderProvider } from "@/app/context/LoaderContext";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  metadataBase: new URL("https://ravendelle.vercel.app"),

  title: {
    default: "Ravendelle™ | Premium Home, Kitchen & Lifestyle Essentials Online",
    template: "%s | Ravendelle™",
  },

  description:
    "Shop premium home & kitchen essentials, storage organizers, lifestyle products and daily-use items at Ravendelle. Fast delivery across India, secure payments & easy returns.",

  keywords: [
    "home essentials online",
    "kitchen storage containers",
    "home organizers india",
    "buy kitchen products online",
    "lifestyle products india",
    "best ecommerce store india",
    "storage solutions for home",
    "online shopping india",
  ],

  authors: [{ name: "Ravendelle" }],
  creator: "Ravendelle",
  publisher: "Ravendelle",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://ravendelle.vercel.app",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ravendelle.vercel.app",
    siteName: "Ravendelle",
    title: "Ravendelle™ | Premium Home & Kitchen Essentials",
    description:
      "Discover premium home, kitchen and lifestyle essentials at Ravendelle. Trusted by thousands. Fast delivery across India.",
    images: [
      {
        url: "/category_img/Kitchen.jpeg",
        width: 1200,
        height: 630,
        alt: "Ravendelle - Home & Kitchen Essentials",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ravendelle™ | Shop Home & Kitchen Essentials",
    description:
      "Premium home & kitchen products with fast delivery and secure checkout.",
    images: ["/og-banner.jpg"],
    creator: "@ravendelle",
  },

  category: "ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Performance */}
        <link rel="preconnect" href="https://k-store-bdz5.onrender.com" />
        <link rel="dns-prefetch" href="https://k-store-bdz5.onrender.com" />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ravendelle",
              url: "https://ravendelle.vercel.app",
              logo: "https://ravendelle.vercel.app/New_logo2.jfif",
              sameAs: [
                "https://www.instagram.com/ravendelle",
                "https://www.facebook.com/ravendelle",
              ],
            }),
          }}
        />

        {/* Website Search Schema (VERY IMPORTANT FOR ECOMMERCE) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Ravendelle",
              url: "https://ravendelle.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://ravendelle.vercel.app/product?search={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body className="antialiased bg-white text-gray-900">
        <LoaderProvider>
          <GlobalLoader />
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}

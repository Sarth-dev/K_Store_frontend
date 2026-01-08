import "./globals.css";
import Header from "./foundation/Header";
import Footer from "./foundation/Footer";
import GlobalLoader from "./Components/loader/GlobalLoader";
import { LoaderProvider } from "@/app/context/LoaderContext";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  metadataBase: new URL("https://ravendelle.vercel.app"),

  title: {
    default: "Ravendelle™ – Premium Home, Kitchen & Lifestyle Store in India",
    template: "%s | Ravendelle™",
  },

  description:
    "Ravendelle™ is India’s trusted online store for premium home, kitchen & lifestyle essentials. Secure payments, fast delivery across India & easy returns.",

  keywords: [
    "Ravendelle",
    "Ravendelle store",
    "home essentials online india",
    "kitchen storage containers",
    "home organizers india",
    "premium lifestyle products",
    "trusted ecommerce india",
  ],

  authors: [{ name: "Ravendelle™" }],
  creator: "Ravendelle™",
  publisher: "Ravendelle™",

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

  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ravendelle.vercel.app",
    siteName: "Ravendelle™",
    title: "Ravendelle™ – Premium Home & Kitchen Essentials",
    description:
      "Shop premium home, kitchen & lifestyle essentials from a trusted Indian ecommerce brand.",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Ravendelle™ – Premium Home & Kitchen Store",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ravendelle™ – Premium Online Store",
    description:
      "Premium home & kitchen essentials with fast delivery and secure checkout.",
    images: ["/og-banner.jpg"],
  },

  category: "ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Backend Performance */}
        <link rel="preconnect" href="https://k-store-bdz5.onrender.com" />
        <link rel="dns-prefetch" href="https://k-store-bdz5.onrender.com" />

        {/* Schema: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ravendelle™",
              url: "https://ravendelle.vercel.app",
              logo: "https://ravendelle.vercel.app/favicon.jpg",
              sameAs: [
                "https://www.instagram.com/ravendelle",
                "https://www.facebook.com/ravendelle",
              ],
            }),
          }}
        />

        {/* Schema: Website + Search Box */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Ravendelle™",
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

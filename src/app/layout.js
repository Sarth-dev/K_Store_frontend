import { LoaderProvider } from "@/app/context/LoaderContext";
import GlobalLoader from "./Components/loader/GlobalLoader";
import Header from "./foundation/Header";
import Footer from "./foundation/Footer";

import "./globals.css";

export const metadata = {
  title: "K-Store | All Essentials at One Place",
  description:
    "Buy affordable containers, kitchen storage, organizers, home essentials with fast delivery.",
  keywords: "kitchen storage, home organizers, containers, ecommerce",
  openGraph: {
    title: "K-Store - Best Home & Kitchen Store",
    description: "High-quality products at best prices.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Improve API connection speed */}
        <link rel="preconnect" href="https://k-store-bdz5.onrender.com" />

        {/* JSON-LD SEO Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Organization",
              name: "K-Store",
              url: "https://kstore-rust.vercel.app/",
              logo: "/logo.png",
            }),
          }}
        />
      </head>

      <body>
        <LoaderProvider>
          <GlobalLoader />
          <Header />
          {children}
          <Footer />
        </LoaderProvider>
      </body>
    </html>
  );
}

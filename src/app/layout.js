import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./foundation/Header";
import Footer from "./foundation/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "K Store - Your Online Shopping Destination",
  description: "Shop the best products at amazing prices. Quality guaranteed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="grow container mx-auto px-2 py-2 ">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

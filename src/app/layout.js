import { LoaderProvider } from "@/app/context/LoaderContext";
import GlobalLoader from "./Components/loader/GlobalLoader";
import Header from "./foundation/Header";
import Footer from "./foundation/Footer";
import "./globals.css";

export const metadata = {
  title: "K Store",
  description: "Your favorite e-commerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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

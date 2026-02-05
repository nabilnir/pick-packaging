import type { Metadata } from "next";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import SmoothScroll from "@/components/smooth-scroll";
import Script from "next/script";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import CartToast from "@/components/ui/cart-toast";

export const metadata: Metadata = {
  title: "PickPacking | Premium Industrial Packaging",
  description: "Set the standard for packaging excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <SmoothScroll>
              <Script
                id="orchids-browser-logs"
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
                strategy="afterInteractive"
                data-orchids-project-id="9f0c5c9d-15b1-4e58-90e5-ab72d52b9c7d"
              />
              <ErrorReporter />
              <Script
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
                strategy="afterInteractive"
                data-target-origin="*"
                data-message-type="ROUTE_CHANGE"
                data-include-search-params="true"
                data-only-in-iframe="true"
                data-debug="true"
                data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
              />
              {children}
              <CartToast />
            </SmoothScroll>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


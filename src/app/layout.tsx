import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { WishlistSync } from "@/components/providers/wishlist-sync";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "ZKR E-Commerce",
    template: "%s | ZKR E-Commerce",
  },
  description:
    "ZKR E-Commerce — Premium Shopping Experience. Modern online shopping platform with quality products and secure checkout.",
  keywords: [
    "ecommerce",
    "online store",
    "shopping",
    "products",
    "ZKR",
  ],
  authors: [
    {
      name: "ZKR E-Commerce",
    },
  ],
  creator: "ZKR E-Commerce",
  openGraph: {
    title: "ZKR E-Commerce",
    description:
      "Modern ecommerce platform for online shopping.",
    type: "website",
    locale: "en_US",
    siteName: "ZKR E-Commerce",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0F1F' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-background`}
      >
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <WishlistSync />
              <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.05] dark:bg-primary/[0.07] blur-[120px]" />
                <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-accent/[0.04] dark:bg-primary/[0.15] blur-[120px]" />
              </div>

              <Navbar />

              <main className="pt-[68px] min-h-screen">
                {children}
              </main>

              <Footer />

              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
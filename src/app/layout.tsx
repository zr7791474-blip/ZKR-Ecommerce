import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";

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
    default: "ZKR Ecommerce",
    template: "%s | ZKR Ecommerce",
  },
  description:
    "ZKR Ecommerce - Modern online shopping platform with quality products and secure checkout.",
  keywords: [
    "ecommerce",
    "online store",
    "shopping",
    "products",
    "ZKR",
  ],
  authors: [
    {
      name: "ZKR Ecommerce",
    },
  ],
  creator: "ZKR Ecommerce",
  openGraph: {
    title: "ZKR Ecommerce",
    description:
      "Modern ecommerce platform for online shopping.",
    type: "website",
    locale: "en_US",
    siteName: "ZKR Ecommerce",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen`}
      >
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <Navbar />

              <main className="pt-16 min-h-screen">
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
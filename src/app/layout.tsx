import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Sri Srinivasa Secure Logistics (SSLogistics)",
  description:
    "Premium transport and operations management by Sri Srinivasa Secure Logistics (SSL). Reliable and secure enterprise logistics solutions.",
  keywords: [
    "srisrinivasasecurelogistics",
    "sri srinivasa secure logistics",
    "secure logistics",
    "sslogistics",
    "sri srinivasa",
    "ssl",
    "sstc",
    "sstcl",
    "sst",
    "transport",
    "transportation",
    "fleet management",
    "KIA Motors operations",
    "KIA logistics partner",
    "supply chain",
    "freight transport",
    "trucking",
    "commercial vehicles",
    "logistics management",
    "logistics company India"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          outfit.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}

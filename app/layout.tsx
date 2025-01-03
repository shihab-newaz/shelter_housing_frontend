import type { Metadata } from "next";
import { Playfair_Display, Roboto } from "next/font/google";
import Navbar from "@/components/persistent/Navbar";
import Footer from '@/components/persistent/Footer'
import Toolbar from '@/components/persistent/Toolbar'
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  title: {
    default: "Shelter Housing Ltd",
    template: "%s | Shelter Housing Ltd",
  },
  description:
    "Shelter Housing Ltd is a leading real estate developer in Bangladesh, specializing in luxury apartments and modern living spaces in prime locations across Dhaka. Experience our tradition of trust and excellence in real estate development.",
  keywords: [
    "real estate developer",
    "luxury apartments",
    "Dhaka real estate",
    "premium housing",
    "Bangladesh property",
    "residential projects",
    "Shelter Housing",
    "property developer",
  ],
  authors: [{ name: "Shelter Housing Ltd" }],
  creator: "Shelter Housing Ltd",
  publisher: "Shelter Housing Ltd",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shelterhousing.com",
    siteName: "Shelter Housing Ltd",
    title:
      "Welcome to Shelter Housing Ltd - Leading Real Estate Developer in Bangladesh",
    description:
      "Premier real estate development company specializing in luxury apartments and modern living spaces in prime locations across Dhaka, Bangladesh.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shelter Housing Ltd - Premium Real Estate Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelter Housing Ltd - Premium Real Estate Developer",
    description:
      "Experience luxury living with Bangladesh's leading real estate developer. Discover our premium residential projects in prime locations.",
    images: ["/twitter-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "Real Estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${roboto.variable}`}
    >
      <body className="font-roboto antialiased">
        <Navbar />
        <Toolbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}


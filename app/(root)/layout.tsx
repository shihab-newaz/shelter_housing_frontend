import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Lato, Gothic_A1 } from "next/font/google";
import Navbar from "@/components/persistent/Navbar";
import Footer from "@/components/persistent/Footer";
import Toolbar from "@/components/persistent/Toolbar";
import { Toaster } from "@/components/ui/use-toast";
import { AuthProvider } from "@/components/auth/provider";
import "@/styles/globals.css";

// Load fonts
const gothic = Gothic_A1({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-gothic",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
});

// Define metadata for SEO
export const metadata: Metadata = {
  metadataBase: new URL("https://shelterhousinglimited.com"),
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
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  title: {
    default: "Shelter Housing Limited",
    template: "%s | Shelter Housing Limited",
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
    "affordable housing",
    "modern living",
  ],
  authors: [
    {
      name: "Shelter Housing Limited",
      url: "https://shelterhousinglimited.com",
    },
  ],
  creator: "Shelter Housing Limited",
  publisher: "Shelter Housing Limited",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shelterhousinglimited.com",
    languages: {
      "en-US": "https://shelterhousinglimited.com",
      "bn-BD": "https://shelterhousinglimited.com/bn",
    },
  },
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shelterhousinglimited.com",
    siteName: "Shelter Housing Limited",
    title:
      "Welcome to Shelter Housing Limited - Leading Real Estate Developer in Bangladesh",
    description:
      "Premier real estate development company specializing in luxury apartments and modern living spaces in prime locations across Dhaka, Bangladesh.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shelter Housing Limited - Premium Real Estate Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shelter Housing Limited - Premium Real Estate Developer",
    description:
      "Experience luxury living with Bangladesh's leading real estate developer. Discover our premium residential projects in prime locations.",
    images: ["/twitter-image.jpg"],
    site: "@shelterhousing",
    creator: "@shelterhousing",
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "Real Estate",
  applicationName: "Shelter Housing Ltd",
  other: {
    "msapplication-TileColor": "#2b5797",
    "theme-color": "#ffffff",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gothic.variable} ${lato.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Additional structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Shelter Housing Limited",
              url: "https://shelterhousinglimited.com",
              logo: "https://shelterhousinglimited.com/logo.png",
              sameAs: [
                "https://www.facebook.com/@shelterhousinglimited",
                "https://www.linkedin.com/company/shelterhousingltd/",
                "https://twitter.com/shelterhousinglimited",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+880-xxx-xxxxxx",
                contactType: "customer service",
                availableLanguage: ["English", "Bengali"],
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Real Estate Avenue",
                addressLocality: "Dhaka",
                addressRegion: "Dhaka",
                postalCode: "1000",
                addressCountry: "BD",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full">
              <Navbar />
              <Toolbar />
            </header>
            <main className="flex-grow">
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

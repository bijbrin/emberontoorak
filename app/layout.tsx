import type { Metadata, Viewport } from "next";
import { Geist, Oswald, Cormorant_Garamond } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import ScrollProgress from "./components/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: '#FE7743',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.emberontoorak.com.au"),

  title: {
    default: "Ember on Toorak — Theatre of Fire",
    template: "%s | Ember on Toorak",
  },
  description:
    "An immersive fire-driven dining experience in Toorak, Victoria. 28-day dry-aged beef over 1,200° coals, an exceptional wine cellar, and unforgettable atmosphere.",

  keywords: [
    "fine dining Toorak",
    "steakhouse Melbourne",
    "fire dining Melbourne",
    "dry-aged beef Melbourne",
    "restaurant Toorak Village",
    "Ember on Toorak",
  ],

  authors: [{ name: "Ember on Toorak" }],

  alternates: {
    canonical: "https://www.emberontoorak.com.au",
  },

  openGraph: {
    type: "website",
    siteName: "Ember on Toorak",
    title: "Ember on Toorak — Theatre of Fire",
    description:
      "Fire-driven fine dining in Toorak, Victoria. 28-day dry-aged beef, 1,200° coals, exceptional wine.",
    url: "https://www.emberontoorak.com.au",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ember on Toorak restaurant — glowing coals and prime beef",
      },
    ],
    locale: "en_AU",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ember on Toorak — Theatre of Fire",
    description: "Fire-driven fine dining in Toorak, Victoria.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${oswald.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-cream">
        <ClerkProvider>
          <SmoothScrollProvider>
            <ScrollProgress />
            {children}
          </SmoothScrollProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Oswald, Cormorant_Garamond } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import SmoothScrollProvider from "./components/SmoothScrollProvider";

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

export const metadata: Metadata = {
  title: "Ember on Toorak — Theatre of Fire",
  description:
    "An immersive fire-driven dining experience in the heart of Toorak, Victoria. 28-day dry-aged beef, 1,200° coals, and a wine cellar built for the discerning palate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${oswald.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-cream">
        <ClerkProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

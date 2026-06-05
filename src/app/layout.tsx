import type { Metadata, Viewport } from "next";
import { Geist, Outfit, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { unstable_cache } from "next/cache";
import "./globals.css";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ChatWidget from "@/components/ui/ChatWidget";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/prisma";
import { defaultThemeSettings, type ThemeSettings } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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

const getActiveTheme = unstable_cache(
  async (): Promise<string | undefined> => {
    try {
      const row = await prisma.siteSettings.findUnique({ where: { key: 'theme' } })
      const settings: ThemeSettings = row ? JSON.parse(row.value) : defaultThemeSettings()
      if (settings.mode === 'manual') return settings.manual || undefined
      const melbourneDate = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Australia/Melbourne' })
      )
      const day = String(melbourneDate.getDay())
      return settings.schedule?.[day] || undefined
    } catch {
      return undefined
    }
  },
  ['active-theme'],
  { revalidate: 60, tags: ['theme'] }
)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeTheme = await getActiveTheme()
  return (
    <html
      lang="en-AU"
      data-theme={activeTheme}
      className={`${geistSans.variable} ${outfit.variable} ${playfair.variable} relative h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider>
          <ScrollProgress />
          <Header />
          {children}
          <ChatWidget />
        </ClerkProvider>
      </body>
    </html>
  );
}

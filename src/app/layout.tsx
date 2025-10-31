import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@/styles/themes.css";
import { Footer } from "@/components/Footer";
import { GameProvider } from "@/hooks/useGame";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),

  title: "Clickfluencer Idle - Build Your Social Media Empire",
  description:
    "An incremental idle game where you build your social media empire from a single click to becoming the ultimate digital influencer.",
  keywords: [
    "idle game",
    "incremental game",
    "clicker game",
    "social media",
    "influencer",
  ],
  authors: [{ name: "Clickfluencer Team" }],
  creator: "Clickfluencer Team",
  publisher: "Clickfluencer Team",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Clickfluencer Idle",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Clickfluencer Idle",
    title: "Clickfluencer Idle - Build Your Social Media Empire",
    description:
      "An incremental idle game where you build your social media empire.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clickfluencer Idle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clickfluencer Idle - Build Your Social Media Empire",
    description:
      "An incremental idle game where you build your social media empire.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GTAG_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Tag Manager / Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <GameProvider>
          <div className="flex-1">{children}</div>
          <Footer />
          <CookieConsent />
        </GameProvider>
      </body>
    </html>
  );
}

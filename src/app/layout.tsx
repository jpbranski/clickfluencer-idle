import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import '@/styles/themes.css';
import { Footer } from '@/components/Footer';
import { GameProvider } from '@/hooks/useGame';
import { CookieConsent } from '@/components/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const GA_ID = process.env.NEXT_PUBLIC_GTAG_ID;

export const metadata: Metadata = {
  title: 'Clickfluencer Idle - Build Your Social Media Empire',
  description:
    'An incremental idle game where you build your social media empire from a single click to becoming the ultimate digital influencer.',
  openGraph: {
    title: 'Clickfluencer Idle',
    description: 'An incremental idle game where you build your social media empire.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* ✅ Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* ✅ Pre-paint theme loader */}
        <Script id="load-theme" strategy="beforeInteractive">
          {`
            try {
              const saved = localStorage.getItem('active-theme') || 'dark';
              document.documentElement.setAttribute('data-theme', saved);
            } catch {
              document.documentElement.setAttribute('data-theme', 'dark');
            }
          `}
        </Script>
      </head>

      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        <GameProvider>
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </GameProvider>
      </body>
    </html>
  );
}

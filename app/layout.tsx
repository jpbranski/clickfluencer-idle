import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Clickfluencer Idle - Build Your Social Media Empire',
  description:
    'An incremental idle game where you build your social media empire from a single click to becoming the ultimate digital influencer.',
  keywords: [
    'idle game',
    'incremental game',
    'clicker game',
    'social media',
    'influencer',
  ],
  authors: [{ name: 'Clickfluencer Team' }],
  creator: 'Clickfluencer Team',
  publisher: 'Clickfluencer Team',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Clickfluencer Idle',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Clickfluencer Idle',
    title: 'Clickfluencer Idle - Build Your Social Media Empire',
    description:
      'An incremental idle game where you build your social media empire.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Clickfluencer Idle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clickfluencer Idle - Build Your Social Media Empire',
    description:
      'An incremental idle game where you build your social media empire.',
    images: ['/og-image.png'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
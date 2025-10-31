import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
  title: "Clickfluencer Idle - Build Your Social Media Empire",
  description:
    "An incremental idle game where you build your social media empire from a single click to becoming the ultimate digital influencer.",
  manifest: "/manifest.webmanifest",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GTAG_ID;

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      (function() {
        try {
          // Determine theme priority:
          // 1. Saved player theme
          // 2. System preference
          // 3. Default 'dark'
          const stored = localStorage.getItem('active-theme') || localStorage.getItem('game_theme');
          const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const theme = stored || (systemDark ? 'dark' : 'light');

          // Apply theme class & data attribute to both html and body
          document.documentElement.dataset.theme = theme;
          document.documentElement.classList.add('theme-' + theme);
          if (theme !== 'light') document.documentElement.classList.add('dark');

          // Also apply to body when it's available
          if (document.body) {
            document.body.dataset.theme = theme;
            document.body.classList.add('theme-' + theme);
            if (theme !== 'light') document.body.classList.add('dark');
          }

          // Update browser UI theme color
          const colors = {
            light: '#ffffff',
            dark: '#0a0a0a',
            'night-sky': '#1b1f3b',
            'touch-grass': '#95d5b2',
            terminal: '#272822',
            'cherry-blossom': '#ffd6de',
            nightshade: '#311b3a',
            'el-blue': '#0a192f',
            gold: '#d4af37'
          };
          const meta = document.querySelector('meta[name="theme-color"]');
          if (meta) meta.setAttribute('content', colors[theme] || '#0a0a0a');
        } catch(e) {}
      })();
    `,
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4062019424835259"
          crossOrigin="anonymous"></script>

        {/* ✅ Google Analytics */}
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
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

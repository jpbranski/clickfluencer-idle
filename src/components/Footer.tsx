'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' },
    { label: 'Guide', href: '/guide' },
    { label: 'Accessibility', href: '/accessibility' },
    { label: 'Contact', href: '/contact' },
    { label: 'About', href: '/about' },
    { label: 'Acknowledgements', href: '/acknowledgements' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    {
      label: 'Report Bug',
      href: 'https://github.com/jpbranski/clickfluencer-idle/issues',
      external: true,
    },
  ];

  return (
    <footer
      className="
        w-full mt-auto bg-surface backdrop-blur-sm
        border-t border-border shadow-lg text-foreground
      "
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <nav
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-4"
            aria-label="Footer navigation"
          >
            {links.map((link, index) => (
              <span key={link.href} className="flex items-center gap-2">
                <Link
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="
                    text-sm text-muted hover:text-accent transition-colors
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-accent focus-visible:ring-offset-2 rounded px-2 py-1
                    motion-reduce:transition-none
                  "
                >
                  {link.label}
                </Link>
                {index < links.length - 1 && (
                  <span className="text-muted" aria-hidden="true">
                    |
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Copyright */}
          <div className="text-sm text-muted text-center sm:text-right">
            © {currentYear} Clickfluencer Idle
          </div>
        </div>

        {/* Contact */}
        <div className="mt-4 pt-4 border-t border-border text-center text-sm text-muted">
          Contact{' '}
          <a
            href="mailto:dev@jpbranski.com"
            className="text-accent hover:underline"
          >
            dev@jpbranski.com
          </a>{' '}
          for feedback, collaboration, or bug reports.
        </div>

        {/* Tech credits */}
        <div className="mt-4 pt-4 border-t border-border text-center text-xs text-muted">
          <p className="mb-2">
            Built with ❤️ using Next.js, React, and Tailwind CSS
          </p>
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Next.js
            </Link>
            <span>•</span>
            <Link
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              React
            </Link>
            <span>•</span>
            <Link
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Tailwind CSS
            </Link>
          </p>
        </div>

        {/* Version badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card text-xs text-muted">
            <span
              className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse-slow"
              aria-label="status indicator"
            />
            <span>Version 0.2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

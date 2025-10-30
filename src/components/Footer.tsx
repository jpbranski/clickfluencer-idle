'use client';

/**
 * Footer.tsx - Site Footer Component
 *
 * Features:
 * - Fixed at bottom or below content
 * - Links: About, Privacy Policy, Terms of Service
 * - Copyright notice
 * - Contact message
 * - Dark mode support
 * - Responsive design
 */

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'About', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ];

  return (
    <footer
      className="
        w-full mt-auto
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-sm
        border-t border-gray-200 dark:border-gray-800
        shadow-lg
      "
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-4"
            aria-label="Footer navigation"
          >
            {links.map((link, index) => (
              <span key={link.href} className="flex items-center gap-2">
                <Link
                  href={link.href}
                  className="
                    text-sm text-gray-600 dark:text-gray-400
                    hover:text-purple-600 dark:hover:text-purple-400
                    transition-colors duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2
                    rounded px-2 py-1
                    motion-reduce:transition-none
                  "
                >
                  {link.label}
                </Link>
                {index < links.length - 1 && (
                  <span
                    className="text-gray-400 dark:text-gray-600"
                    aria-hidden="true"
                  >
                    |
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Copyright */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right">
            © {currentYear} Clickfluencer Idle
          </div>
        </div>

        {/* Contact / Info Section */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Contact{' '}
            <a
              href="mailto:dev@jpbranski.com"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              dev@jpbranski.com
            </a>{' '}
            for feedback, collaboration, or bug reports.
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-center text-gray-500 dark:text-gray-500">
            <p className="mb-2">
              Built with{' '}
              <span role="img" aria-label="heart">
                ❤️
              </span>{' '}
              using Next.js, React, and Tailwind CSS
            </p>
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <Link
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors motion-reduce:transition-none"
              >
                Next.js
              </Link>
              <span>•</span>
              <Link
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors motion-reduce:transition-none"
              >
                React
              </Link>
              <span>•</span>
              <Link
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors motion-reduce:transition-none"
              >
                Tailwind CSS
              </Link>
            </p>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
            <span
              className="inline-block w-2 h-2 rounded-full bg-green-500 motion-reduce:animate-none animate-pulse"
              aria-label="status indicator"
            />
            <span>Version 0.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * For a footer that stays at the bottom of the viewport:
 * 
 * Wrap your layout in:
 * <div className="min-h-screen flex flex-col">
 *   <main className="flex-1">{children}</main>
 *   <Footer />
 * </div>
 */

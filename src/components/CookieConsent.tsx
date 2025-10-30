'use client';

/**
 * CookieConsent.tsx - GDPR-Compliant Cookie Consent Banner
 *
 * Displays a cookie consent banner for Google Ads and Google Analytics.
 * Complies with GDPR, CCPA, and other privacy regulations.
 *
 * Features:
 * - Granular consent controls (analytics, ads)
 * - Persistent storage of consent preferences
 * - Easy integration with Google services
 * - Accessible and responsive design
 */

import { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean; // Always true, cannot be disabled
  analytics: boolean;
  advertising: boolean;
}

const CONSENT_KEY = 'cookie_consent';
const CONSENT_VERSION = '1.0';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    advertising: false,
  });

  // Check if consent has been given
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.version === CONSENT_VERSION) {
          setPreferences(parsed.preferences);
          // Apply consent preferences to Google services
          applyConsent(parsed.preferences);
        } else {
          // Version changed, show banner again
          setShowBanner(true);
        }
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    // Update Google Analytics consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.advertising ? 'granted' : 'denied',
        ad_user_data: prefs.advertising ? 'granted' : 'denied',
        ad_personalization: prefs.advertising ? 'granted' : 'denied',
      });
    }

    // Update Google Ads consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'default', {
        ad_storage: prefs.advertising ? 'granted' : 'denied',
        ad_user_data: prefs.advertising ? 'granted' : 'denied',
        ad_personalization: prefs.advertising ? 'granted' : 'denied',
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
      });
    }
  };

  const saveConsent = (prefs: CookiePreferences) => {
    const data = {
      version: CONSENT_VERSION,
      preferences: prefs,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    applyConsent(prefs);
    setShowBanner(false);
  };

  const acceptAll = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      advertising: true,
    };
    saveConsent(prefs);
  };

  const rejectAll = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      advertising: false,
    };
    saveConsent(prefs);
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={() => {}}
        aria-hidden="true"
      />

      {/* Banner */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-gray-200 dark:border-gray-700 pointer-events-auto animate-scale-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="text-3xl">🍪</div>
            <div className="flex-1">
              <h2
                id="cookie-consent-title"
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
              >
                We Value Your Privacy
              </h2>
              <p
                id="cookie-consent-description"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                We use cookies to enhance your browsing experience, serve personalized ads or content,
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </p>
            </div>
          </div>

          {/* Details Panel */}
          {showDetails && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
              {/* Necessary Cookies */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cookie-necessary"
                  checked={true}
                  disabled
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 opacity-50 cursor-not-allowed"
                  aria-describedby="cookie-necessary-desc"
                />
                <div className="flex-1">
                  <label
                    htmlFor="cookie-necessary"
                    className="font-semibold text-sm text-gray-900 dark:text-white"
                  >
                    Necessary Cookies (Always Active)
                  </label>
                  <p
                    id="cookie-necessary-desc"
                    className="text-xs text-gray-600 dark:text-gray-400 mt-1"
                  >
                    These cookies are essential for the website to function and cannot be disabled.
                    They store your game progress and settings.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cookie-analytics"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  aria-describedby="cookie-analytics-desc"
                />
                <div className="flex-1">
                  <label
                    htmlFor="cookie-analytics"
                    className="font-semibold text-sm text-gray-900 dark:text-white cursor-pointer"
                  >
                    Analytics Cookies
                  </label>
                  <p
                    id="cookie-analytics-desc"
                    className="text-xs text-gray-600 dark:text-gray-400 mt-1"
                  >
                    These cookies help us understand how visitors interact with our website
                    by collecting and reporting information anonymously (Google Analytics).
                  </p>
                </div>
              </div>

              {/* Advertising Cookies */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cookie-advertising"
                  checked={preferences.advertising}
                  onChange={(e) =>
                    setPreferences({ ...preferences, advertising: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  aria-describedby="cookie-advertising-desc"
                />
                <div className="flex-1">
                  <label
                    htmlFor="cookie-advertising"
                    className="font-semibold text-sm text-gray-900 dark:text-white cursor-pointer"
                  >
                    Advertising Cookies
                  </label>
                  <p
                    id="cookie-advertising-desc"
                    className="text-xs text-gray-600 dark:text-gray-400 mt-1"
                  >
                    These cookies are used to make advertising messages more relevant to you
                    and your interests (Google Ads).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!showDetails ? (
              <>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-150 active:scale-95"
                  aria-label="Accept all cookies"
                >
                  Accept All
                </button>
                <button
                  onClick={rejectAll}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all duration-150 active:scale-95"
                  aria-label="Reject all optional cookies"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-600 transition-all duration-150 active:scale-95"
                  aria-label="Customize cookie preferences"
                >
                  Customize
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={saveCustom}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-150 active:scale-95"
                  aria-label="Save custom cookie preferences"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all duration-150 active:scale-95"
                  aria-label="Go back to main options"
                >
                  Back
                </button>
              </>
            )}
          </div>

          {/* Privacy Policy Link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By using our site, you acknowledge that you have read and understand our{' '}
              <a
                href="/privacy-policy"
                className="text-purple-600 dark:text-purple-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="/cookie-policy"
                className="text-purple-600 dark:text-purple-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

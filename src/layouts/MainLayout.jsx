import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrivacyBanner, { PrivacyStatusIndicator } from '../components/PrivacyBanner';
import ThemeToggle from '../components/ThemeToggle';

/**
 * MainLayout Component
 * Main application layout with header, navigation, and privacy status UI
 * WCAG 2.1 AA compliant with proper ARIA landmarks and skip links
 */
const MainLayout = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const activeLanguage = (i18n.resolvedLanguage || i18n.language || 'de').split('-')[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navigation = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.products'), path: '/products' },
    { name: t('nav.inventory'), path: '/lageropt' },
    { name: t('nav.roi'), path: '/roi' },
    { name: t('nav.avatar'), path: '/avatar' },
    { name: t('nav.security'), path: '/security' },
    { name: t('nav.contact'), path: '/kontakt' },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Link for Accessibility (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-medical-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue-500"
      >
        {t('skipLink')}
      </a>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:bg-dark-surface/95 dark:border-dark-border" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2" aria-label="DiggAiHH Startseite">
                <div className="w-10 h-10 bg-gradient-to-br from-medical-blue-600 to-medical-blue-800 rounded-lg flex items-center justify-center dark:from-neon-cyan-500 dark:to-medical-blue-700" aria-hidden="true">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-slate-100">
                  Digg<span className="text-medical-blue-600 dark:text-neon-cyan-300">Ai</span>HH
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Hauptnavigation">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 dark:focus:ring-neon-cyan-400 dark:focus:ring-offset-dark-surface ${
                    isActive(item.path)
                      ? 'bg-medical-blue-50 text-medical-blue-700 dark:bg-dark-card dark:text-neon-cyan-300 border-glow'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-dark-card'
                  }`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Privacy Status & User Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link
                to="/security"
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-medical-accent-50 border border-medical-accent-200 text-medical-accent-800 text-xs font-semibold hover:bg-medical-accent-100 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 dark:bg-dark-card dark:border-neon-cyan-400/30 dark:text-neon-cyan-200 dark:hover:bg-dark-surface"
                aria-label="Security und Compliance Überblick"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                DSGVO/BSI orientiert
              </Link>

              {/* Language Switcher */}
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  onClick={() => changeLanguage('de')} 
                  className={`px-2 py-1 text-xs font-bold rounded transition-colors ${activeLanguage === 'de' ? 'bg-medical-blue-600 text-white dark:bg-neon-cyan-500 dark:text-dark-bg' : 'bg-gray-200 text-gray-700 dark:bg-dark-card dark:text-slate-200'}`}
                  aria-label="Deutsch"
                >
                  DE
                </button>
                <button 
                  onClick={() => changeLanguage('en')} 
                  className={`px-2 py-1 text-xs font-bold rounded transition-colors ${activeLanguage === 'en' ? 'bg-medical-blue-600 text-white dark:bg-neon-cyan-500 dark:text-dark-bg' : 'bg-gray-200 text-gray-700 dark:bg-dark-card dark:text-slate-200'}`}
                  aria-label="English"
                >
                  EN
                </button>
                <button 
                  onClick={() => changeLanguage('ar')} 
                  className={`px-2 py-1 text-xs font-bold rounded transition-colors ${activeLanguage === 'ar' ? 'bg-medical-blue-600 text-white dark:bg-neon-cyan-500 dark:text-dark-bg' : 'bg-gray-200 text-gray-700 dark:bg-dark-card dark:text-slate-200'}`}
                  aria-label="Arabic"
                >
                  AR
                </button>
              </div>

              <PrivacyStatusIndicator />
              <Link
                to="/privacy"
                className="text-sm text-gray-600 hover:text-medical-blue-600 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 rounded-md p-1 dark:text-slate-300 dark:hover:text-neon-cyan-300"
                aria-label="Datenschutz und Cookie-Einstellungen"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </Link>

              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 dark:border-dark-border dark:text-slate-200 dark:hover:bg-dark-card"
                onClick={() => setIsMobileNavOpen((open) => !open)}
                aria-label="Mobile Navigation umschalten"
                aria-expanded={isMobileNavOpen}
                aria-controls="mobile-navigation"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {isMobileNavOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div className="sm:hidden py-3 border-t border-gray-200 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => changeLanguage('de')} 
                className={`px-2 py-1 text-xs font-bold rounded transition-colors ${activeLanguage === 'de' ? 'bg-medical-blue-600 text-white dark:bg-neon-cyan-500 dark:text-dark-bg' : 'bg-gray-200 text-gray-700 dark:bg-dark-card dark:text-slate-200'}`}
                aria-label="Deutsch"
              >
                DE
              </button>
              <button 
                onClick={() => changeLanguage('en')} 
                className={`px-2 py-1 text-xs font-bold rounded transition-colors ${activeLanguage === 'en' ? 'bg-medical-blue-600 text-white dark:bg-neon-cyan-500 dark:text-dark-bg' : 'bg-gray-200 text-gray-700 dark:bg-dark-card dark:text-slate-200'}`}
                aria-label="English"
              >
                EN
              </button>
              <button 
                onClick={() => changeLanguage('ar')} 
                className={`px-2 py-1 text-xs font-bold rounded transition-colors ${activeLanguage === 'ar' ? 'bg-medical-blue-600 text-white dark:bg-neon-cyan-500 dark:text-dark-bg' : 'bg-gray-200 text-gray-700 dark:bg-dark-card dark:text-slate-200'}`}
                aria-label="Arabic"
              >
                AR
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileNavOpen && (
            <nav id="mobile-navigation" className="md:hidden py-4 border-t border-gray-200 dark:border-dark-border" role="navigation" aria-label="Mobile Navigation">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue-500 dark:focus:ring-neon-cyan-400 ${
                      isActive(item.path)
                        ? 'bg-medical-blue-50 text-medical-blue-700 dark:bg-dark-card dark:text-neon-cyan-300 border-glow'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-dark-card'
                    }`}
                    aria-current={isActive(item.path) ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 bg-gray-50 dark:bg-dark-bg" role="main" tabIndex="-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto dark:bg-dark-surface dark:border-dark-border" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-slate-400">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </div>
            <nav className="flex gap-6 text-sm" aria-label="Footer-Navigation">
              <Link 
                to="/privacy" 
                className="text-gray-600 hover:text-medical-blue-600 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 rounded dark:text-slate-400 dark:hover:text-neon-cyan-300"
              >
                {t('footer.privacy')}
              </Link>
              <Link 
                to="/impressum" 
                className="text-gray-600 hover:text-medical-blue-600 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 rounded dark:text-slate-400 dark:hover:text-neon-cyan-300"
              >
                {t('footer.imprint')}
              </Link>
              <Link 
                to="/kontakt" 
                className="text-gray-600 hover:text-medical-blue-600 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 rounded dark:text-slate-400 dark:hover:text-neon-cyan-300"
              >
                {t('footer.contact')}
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* Privacy Banner */}
      <PrivacyBanner />
    </div>
  );
};

export default MainLayout;

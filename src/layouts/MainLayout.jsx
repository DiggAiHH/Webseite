import { Link, useLocation } from 'react-router-dom';
import PrivacyBanner, { PrivacyStatusIndicator } from '../components/PrivacyBanner';

/**
 * MainLayout Component
 * Main application layout with header, navigation, and privacy status UI
 * WCAG 2.1 AA compliant with proper ARIA landmarks and skip links
 */
const MainLayout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Lageroptimierung', path: '/lageropt' },
    { name: 'ROI-Rechner', path: '/roi' },
    { name: 'Avatar-System', path: '/avatar' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip Link for Accessibility (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-medical-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue-500"
      >
        Zum Hauptinhalt springen
      </a>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2" aria-label="DiggAiHH Startseite">
                <div className="w-10 h-10 bg-gradient-to-br from-medical-blue-600 to-medical-blue-800 rounded-lg flex items-center justify-center" aria-hidden="true">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Digg<span className="text-medical-blue-600">Ai</span>HH
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Hauptnavigation">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 ${
                    isActive(item.path)
                      ? 'bg-medical-blue-50 text-medical-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Privacy Status & User Menu */}
            <div className="flex items-center gap-4">
              <PrivacyStatusIndicator />
              <Link
                to="/privacy"
                className="text-sm text-gray-600 hover:text-medical-blue-600 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 rounded-md p-1"
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
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden py-4 border-t border-gray-200" role="navigation" aria-label="Mobile Navigation">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue-500 ${
                    isActive(item.path)
                      ? 'bg-medical-blue-50 text-medical-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 bg-gray-50" role="main" tabIndex="-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} DiggAiHH. Alle Rechte vorbehalten.
            </div>
            <nav className="flex gap-6 text-sm" aria-label="Footer-Navigation">
              <Link 
                to="/privacy" 
                className="text-gray-600 hover:text-medical-blue-600 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 rounded"
              >
                Datenschutz
              </Link>
              <Link 
                to="/impressum" 
                className="text-gray-600 hover:text-medical-blue-600 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 rounded"
              >
                Impressum
              </Link>
              <Link 
                to="/kontakt" 
                className="text-gray-600 hover:text-medical-blue-600 focus:outline-none focus:ring-2 focus:ring-medical-blue-500 focus:ring-offset-2 rounded"
              >
                Kontakt
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

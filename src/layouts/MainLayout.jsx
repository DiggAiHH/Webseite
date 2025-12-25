import { Link, useLocation } from 'react-router-dom';
import PrivacyBanner, { PrivacyStatusIndicator } from '../components/PrivacyBanner';

/**
 * MainLayout Component
 * Main application layout with header, navigation, and privacy status UI
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-medical-blue-600 to-medical-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Digg<span className="text-medical-blue-600">Ai</span>HH
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-medical-blue-50 text-medical-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
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
                className="text-sm text-gray-600 hover:text-medical-blue-600"
                title="Datenschutz"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-medical-blue-50 text-medical-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} DiggAiHH. Alle Rechte vorbehalten.
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-600 hover:text-medical-blue-600">
                Datenschutz
              </Link>
              <a href="#" className="text-gray-600 hover:text-medical-blue-600">
                Impressum
              </a>
              <a href="#" className="text-gray-600 hover:text-medical-blue-600">
                Kontakt
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Banner */}
      <PrivacyBanner />
    </div>
  );
};

export default MainLayout;

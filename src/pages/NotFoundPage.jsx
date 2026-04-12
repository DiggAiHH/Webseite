import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="max-w-2xl mx-auto py-16 text-center">
    <h1 className="text-6xl font-bold text-medical-blue-600 mb-4">404</h1>
    <p className="text-xl text-gray-700 mb-6">
      Die angeforderte Seite wurde nicht gefunden.
    </p>
    <Link to="/" className="btn-primary inline-block">
      Zurück zur Startseite
    </Link>
  </div>
)

export default NotFoundPage

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { RegisterPage } from './features/auth';
import { Logo } from './components/common';

/**
 * Landing Page Component
 */
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="flex justify-center mb-6">
          <Logo variant="horizontal" size={80} />
        </div>
        <h1 className="text-6xl font-bold text-dark-800">
          Tu asistente financiero inteligente
        </h1>
        <p className="text-xl text-dark-600">
          Your AI-powered financial assistant is ready 🚀
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary-600">React 18</h2>
            <p className="text-sm text-dark-500">✅ Configured</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-secondary-600">TypeScript</h2>
            <p className="text-sm text-dark-500">✅ Configured</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary-600">Tailwind CSS</h2>
            <p className="text-sm text-dark-500">✅ Configured</p>
          </div>
        </div>
        <div className="mt-8 text-sm text-dark-400">
          <p>Running on <span className="font-mono text-primary-600">localhost:3000</span></p>
          <p className="mt-2">US-002: Scaffolding Frontend React - Complete</p>
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Registrarse
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Placeholder Login Page (US-006)
 */
function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Login Page</h1>
        <p className="text-gray-600 mb-8">US-006: Coming soon...</p>
        <Link
          to="/"
          className="text-primary-600 hover:text-primary-700 underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

/**
 * Main App Component with Routing
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

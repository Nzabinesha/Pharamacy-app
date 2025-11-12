import { Link } from 'react-router-dom';

export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <p className="text-gray-600 text-center mb-6">Login functionality coming soon...</p>
        <Link to="/" className="btn-primary w-full text-center block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}


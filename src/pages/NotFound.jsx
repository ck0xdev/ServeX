// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="neu-card p-8 md:p-12 text-center max-w-md">
        <div className="neu-circle w-20 h-20 mx-auto mb-6 bg-error/10">
          <AlertCircle size={40} className="text-error" />
        </div>
        <h1 className="text-6xl font-bold text-textPrimary mb-2">404</h1>
        <h2 className="text-xl font-semibold text-textPrimary mb-4">Page Not Found</h2>
        <p className="text-textSecondary mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg" className="w-full">
            <Home size={18} />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
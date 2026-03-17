// src/components/AdminGuard.jsx
import { Navigate } from 'react-router-dom';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminGuard({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="neu-card p-8 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-textSecondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin (use isAdmin from context or check directly)
  const userIsAdmin = isAdmin || user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  
  if (!userIsAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="neu-card p-8 max-w-md text-center">
          <div className="neu-circle w-16 h-16 mx-auto mb-4 bg-error/10">
            <ShieldAlert size={32} className="text-error" />
          </div>
          <h2 className="text-xl font-bold text-textPrimary mb-2">Access Denied</h2>
          <p className="text-textSecondary mb-6">
            You don't have permission to access the admin panel.
          </p>
          <a href="/dashboard" className="text-primary font-medium hover:underline">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
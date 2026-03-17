// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle redirect after successful login
  useEffect(() => {
    if (user) {
      // Check if user is admin (case-insensitive comparison)
      const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      
      console.log('User detected:', user.email);
      console.log('Is Admin:', isAdmin);
      
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Just login - the useEffect will handle redirect
      await login(formData.email, formData.password);
      // Don't navigate here - let useEffect handle it after auth state updates
    } catch (err) {
      let errorMessage = 'Login failed. Please check your credentials.';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      setSubmitError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="neu-card w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="neu-circle w-16 h-16 mx-auto mb-4">
            <span className="text-primary font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-textPrimary mb-2">Welcome Back</h1>
          <p className="text-textSecondary">Login to your ServeX account</p>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div className="neu-pressed bg-error/10 border-2 border-error rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-error flex-shrink-0" size={20} />
            <p className="text-error text-sm">{submitError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            icon={Mail}
            required
          />

          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            icon={Lock}
            required
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="neu-checkbox"
              />
              <span className="text-sm text-textSecondary">Remember me</span>
            </label>
            
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            className="w-full mt-6"
          >
            Login
          </Button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-6 text-textSecondary text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
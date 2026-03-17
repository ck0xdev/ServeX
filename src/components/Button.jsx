import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses = 'rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'neu-button-primary',
    secondary: 'neu-button',
    ghost: 'hover:bg-surface rounded-xl',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    (disabled || loading) && 'neu-disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={size === 'sm' ? 16 : 20} className="animate-spin" />}
      {children}
    </button>
  );
}
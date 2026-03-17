// src/components/Skeleton.jsx
export default function Skeleton({ className = '' }) {
  return (
    <div className={`skeleton rounded-xl ${className}`} />
  );
}

// Usage in any component while loading:
// <Skeleton className="h-20 w-full" />
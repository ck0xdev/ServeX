// src/components/ServiceCard.jsx - ENHANCED
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ServiceCard({ title, description, price, icon: Icon, onClick, featured = false }) {
  return (
    <div 
      className={`
        neu-card p-6 group cursor-pointer relative overflow-hidden
        ${featured ? 'ring-2 ring-primary/50' : ''}
      `}
      onClick={onClick}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-xl font-medium flex items-center gap-1">
          <Sparkles size={12} />
          Popular
        </div>
      )}
      
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="neu-circle w-14 h-14 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          <Icon size={24} className="text-primary group-hover:scale-110 transition-transform" />
        </div>
        
        <h3 className="text-xl font-semibold text-textPrimary mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-textSecondary text-sm mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
            {price}
          </span>
          <span className="text-textSecondary text-sm flex items-center gap-1 group-hover:text-primary transition-colors">
            Learn More
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}
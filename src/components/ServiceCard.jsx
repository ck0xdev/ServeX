import { ArrowRight } from 'lucide-react';

export default function ServiceCard({ title, description, price, icon: Icon, onClick }) {
  return (
    <div className="neu-card p-6 group cursor-pointer" onClick={onClick}>
      <div className="neu-circle w-14 h-14 mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon size={24} className="text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-textPrimary mb-2">{title}</h3>
      <p className="text-textSecondary text-sm mb-4 line-clamp-2">{description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
          {price}
        </span>
        <span className="text-textSecondary text-sm flex items-center gap-1 group-hover:text-primary transition-colors">
          Learn More
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </div>
  );
}
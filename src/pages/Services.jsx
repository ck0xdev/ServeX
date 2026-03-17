// src/pages/Services.jsx
import { Link } from 'react-router-dom';
import { 
  Code, 
  Palette, 
  Briefcase, 
  Wrench, 
  ArrowRight, 
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/Button';

export default function Services() {
  const allServices = [
    {
      title: 'Web Development',
      description: 'Custom websites built with modern technologies including React, Node.js, and Firebase. Fully responsive and optimized for performance.',
      price: 'Starting INR 4,999',
      icon: Code,
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Modern Stack'],
    },
    {
      title: 'UI Design',
      description: 'Beautiful, intuitive interfaces that users love. We create designs that are both aesthetically pleasing and highly functional.',
      price: 'Starting INR 2,999',
      icon: Palette,
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    },
    {
      title: 'Portfolio Sites',
      description: 'Showcase your work professionally with stunning portfolio websites. Perfect for freelancers, artists, and professionals.',
      price: 'Starting INR 1,999',
      icon: Briefcase,
      features: ['Gallery Layouts', 'Project Showcases', 'Contact Forms', 'Social Integration'],
    },
    {
      title: 'Website Maintenance',
      description: 'Keep your site updated and secure with our monthly maintenance plans. Includes updates, backups, and security monitoring.',
      price: 'INR 999/month',
      icon: Wrench,
      features: ['Regular Updates', 'Security Monitoring', 'Daily Backups', '24/7 Support'],
    },
  ];

  return (
    <div className="space-y-16">
      {/* Page Header */}
      <section className="container-custom text-center pt-8">
        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">
          Our Services
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Professional solutions tailored to your needs. Choose from our range of services or request a custom quote.
        </p>
      </section>

      {/* Services Grid */}
      <section className="container-custom">
        <div className="grid md:grid-cols-2 gap-6">
          {allServices.map((service) => (
            <div key={service.title} className="neu-card p-6 flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="neu-circle w-14 h-14 flex-shrink-0">
                  <service.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-textPrimary mb-2">
                    {service.title}
                  </h3>
                  <span className="inline-block text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                    {service.price}
                  </span>
                </div>
              </div>
              
              <p className="text-textSecondary mb-4 flex-grow">
                {service.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-textSecondary">
                    <CheckCircle size={16} className="text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link to="/contact" className="w-full">
                <Button variant="secondary" size="md" className="w-full">
                  Get Started
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Quote CTA */}
      <section className="container-custom">
        <div className="neu-card p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="neu-circle w-16 h-16 mb-4">
                <MessageSquare size={28} className="text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-textPrimary mb-4">
                Need Something Custom?
              </h2>
              <p className="text-textSecondary mb-6">
                Have a unique project in mind? We offer custom solutions tailored to your specific requirements. Contact us for a personalized quote.
              </p>
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Request Custom Quote
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
            
            <div className="neu-pressed rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-textPrimary mb-4">Why Choose Us?</h3>
              {[
                'Affordable pricing with no hidden costs',
                'Fast turnaround times',
                'Quality assurance guaranteed',
                'Ongoing support and maintenance',
                'Latest technology stack',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="neu-circle w-6 h-6 flex-shrink-0">
                    <CheckCircle size={14} className="text-primary" />
                  </div>
                  <span className="text-sm text-textSecondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
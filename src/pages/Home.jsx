// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Palette, Briefcase, Zap } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/Button';

export default function Home() {
  const services = [
    {
      title: 'Web Development',
      description: 'Custom websites built with modern technologies like React, Node.js, and Firebase.',
      price: 'Starting INR 4,999',
      icon: Code,
    },
    {
      title: 'UI Design',
      description: 'Beautiful, intuitive interfaces that users love and remember.',
      price: 'Starting INR 2,999',
      icon: Palette,
    },
    {
      title: 'Portfolio Sites',
      description: 'Showcase your work professionally with stunning portfolio websites.',
      price: 'Starting INR 1,999',
      icon: Briefcase,
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="container-custom pt-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 neu-pressed px-4 py-2 rounded-full">
              <Zap size={16} className="text-primary" />
              <span className="text-sm font-medium text-textSecondary">Professional Web Services</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-textPrimary leading-tight">
              Build Your <span className="text-primary">Digital Presence</span> Today
            </h1>
            
            <p className="text-lg text-textSecondary max-w-lg">
              Professional web development and design services tailored for your business needs. Quality solutions at affordable prices.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Get Started
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-shadowDark/30">
              <div>
                <p className="text-2xl font-bold text-textPrimary">50+</p>
                <p className="text-sm text-textSecondary">Projects Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-textPrimary">30+</p>
                <p className="text-sm text-textSecondary">Happy Clients</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-textPrimary">24/7</p>
                <p className="text-sm text-textSecondary">Support</p>
              </div>
            </div>
          </div>
          
          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="neu-card p-4 relative z-10">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-8 aspect-square flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div className="neu-pressed rounded-xl p-4 aspect-square flex items-center justify-center">
                    <Code size={40} className="text-primary" />
                  </div>
                  <div className="neu-card rounded-xl p-4 aspect-square flex items-center justify-center">
                    <Palette size={40} className="text-primary" />
                  </div>
                  <div className="neu-card rounded-xl p-4 aspect-square flex items-center justify-center">
                    <Briefcase size={40} className="text-primary" />
                  </div>
                  <div className="neu-pressed rounded-xl p-4 aspect-square flex items-center justify-center">
                    <Zap size={40} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-textPrimary mb-4">Our Services</h2>
          <p className="text-textSecondary max-w-2xl mx-auto">
            We offer a range of professional services to help you establish and grow your online presence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              price={service.price}
              icon={service.icon}
              onClick={() => {}}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/services">
            <Button variant="secondary" size="md">
              View All Services
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom">
        <div className="neu-pressed rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-textSecondary mb-8 max-w-xl mx-auto">
            Let's work together to bring your ideas to life. Contact us today for a free consultation.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Contact Us
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
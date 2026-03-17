import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 px-4 pb-8">
      <div className="neu-card max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="neu-circle w-10 h-10">
                <span className="text-primary font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-textPrimary">ServeX</span>
            </div>
            <p className="text-textSecondary text-sm leading-relaxed">
              Professional web development and design services for your business needs. Quality solutions at affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-textPrimary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Services', path: '/services' },
                { name: 'Contact', path: '/contact' },
                { name: 'Login', path: '/login' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-textSecondary hover:text-primary transition-colors text-sm flex items-center gap-1"
                  >
                    {link.name}
                    <ExternalLink size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-textPrimary mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li>Web Development</li>
              <li>UI Design</li>
              <li>Portfolio Sites</li>
              <li>Maintenance</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-textPrimary mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-textSecondary">
                <div className="neu-circle w-8 h-8 flex-shrink-0">
                  <Mail size={14} className="text-primary" />
                </div>
                contact@servex.com
              </li>
              <li className="flex items-center gap-3 text-sm text-textSecondary">
                <div className="neu-circle w-8 h-8 flex-shrink-0">
                  <Phone size={14} className="text-primary" />
                </div>
                +91 XXXXX XXXXX
              </li>
              <li className="flex items-center gap-3 text-sm text-textSecondary">
                <div className="neu-circle w-8 h-8 flex-shrink-0">
                  <MapPin size={14} className="text-primary" />
                </div>
                India
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-shadowDark/30 text-center">
          <p className="text-textSecondary text-sm">
            {currentYear} ServeX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
// src/pages/Contact.jsx
import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const services = [
    'Web Development',
    'UI Design',
    'Portfolio',
    'Maintenance',
    'Other',
  ];

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.service) {
      errors.service = 'Please select a service';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.length > 1000) {
      errors.message = 'Message must be less than 1000 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        service: formData.service,
        message: formData.message,
        createdAt: serverTimestamp(),
        status: 'pending',
      });
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', service: '', message: '' });
    } catch (err) {
      console.error('Error submitting message:', err);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@servex.com',
      href: 'mailto:contact@servex.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 XXXXX XXXXX',
      href: 'tel:+91XXXXXXXXX',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: 'Your City, India',
      href: '#',
    },
  ];

  return (
    <div className="container-custom py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-textPrimary mb-4">Contact Us</h1>
        <p className="text-textSecondary max-w-xl mx-auto">
          Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Contact Form */}
        <div className="neu-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-textPrimary mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            Send Message
          </h2>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="neu-pressed bg-success/10 border-2 border-success rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="text-success flex-shrink-0" size={20} />
              <div>
                <p className="text-success font-medium">Message Sent!</p>
                <p className="text-success/80 text-sm">We'll get back to you soon.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="neu-pressed bg-error/10 border-2 border-error rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="text-error flex-shrink-0" size={20} />
              <div>
                <p className="text-error font-medium">Failed to send</p>
                <p className="text-error/80 text-sm">Please try again later.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              name="name"
              label="Full Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              icon={User}
              required
            />

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

            {/* Service Dropdown */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-textPrimary">
                Service Interested In <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`neu-input appearance-none cursor-pointer ${
                    formErrors.service ? 'neu-input-error' : ''
                  }`}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-textSecondary">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              {formErrors.service && (
                <p className="text-error text-sm">{formErrors.service}</p>
              )}
            </div>

            {/* Message Textarea */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-textPrimary flex justify-between">
                <span>
                  Message <span className="text-error">*</span>
                </span>
                <span className={`text-xs ${formData.message.length > 1000 ? 'text-error' : 'text-textSecondary'}`}>
                  {formData.message.length}/1000
                </span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project..."
                rows={5}
                maxLength={1000}
                className={`neu-input resize-none ${
                  formErrors.message ? 'neu-input-error' : ''
                }`}
              />
              {formErrors.message && (
                <p className="text-error text-sm">{formErrors.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Send Message
              <Send size={18} />
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-6">
            Contact Information
          </h2>
          
          {contactInfo.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="neu-card p-5 flex items-center gap-4 hover:translate-y-[-2px] transition-transform block"
            >
              <div className="neu-circle w-12 h-12 flex-shrink-0">
                <item.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-textSecondary mb-1">{item.label}</p>
                <p className="font-medium text-textPrimary">{item.value}</p>
              </div>
            </a>
          ))}

          {/* Working Hours */}
          <div className="neu-pressed rounded-xl p-5 mt-6">
            <h3 className="font-semibold text-textPrimary mb-3">Working Hours</h3>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate simple form submission or redirect to mailto
    setTimeout(() => {
      const emailBody = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0AMessage: ${formData.message}`;
      window.location.href = `mailto:support@inaya.com?subject=${encodeURIComponent(formData.subject || 'Inaya Inquiry')}&body=${emailBody}`;
      toast.success('Your default email client has been opened to send the message.');
      setSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Get in Touch with Inaya Support</title>
        <meta name="description" content="Have questions about our hair accessories or your order? Contact Inaya support via email, WhatsApp, or our online form. We reply within 24 hours." />
        <meta property="og:title" content="Contact Us — Get in Touch with Inaya Support" />
        <meta property="og:description" content="Have questions about our hair accessories or your order? Contact Inaya support via email, WhatsApp, or our online form. We reply within 24 hours." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Inaya",
            "description": "Contact Inaya support via email, WhatsApp, or our online form."
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-xl p-6 md:p-10 border border-pink-100">
            
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-sm text-xs font-bold uppercase tracking-wider mb-3">
                Get In Touch
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-gray-600 font-light max-w-xl mx-auto">
                Have questions about our products, shipping, or an existing order? We are here to help you!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              
              {/* Contact info (2 cols) */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-serif text-gray-800 mb-4">Contact Details</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Our team is dedicated to providing high-quality support. We aim to reply to all queries within 24 hours.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-50 p-3 rounded-sm border border-pink-100 text-pink-600 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">Email Support</h3>
                      <a href="mailto:support@inaya.com" className="text-pink-600 hover:underline text-sm font-medium">
                        support@inaya.com
                      </a>
                      <p className="text-xs text-gray-400 mt-1">For order queries & wholesale orders.</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-50 p-3 rounded-sm border border-pink-100 text-pink-600 shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">WhatsApp / Phone Chat</h3>
                      <a href="https://wa.me/923172171142" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline text-sm font-medium">
                        +92 317 2171142
                      </a>
                      <p className="text-xs text-gray-400 mt-1">Quick messaging support for live order updates.</p>
                    </div>
                  </div>

                  {/* Physical Address */}
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-50 p-3 rounded-sm border border-pink-100 text-pink-600 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">Headquarters</h3>
                      <p className="text-sm text-gray-600 leading-relaxed font-light">
                        Inaya Fancy Store,<br />
                        Main Commercial Area,<br />
                        Karachi, Pakistan
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Mon-Sat: 11:00 AM — 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form (3 cols) */}
              <div className="lg:col-span-3 bg-pink-50/30 p-6 md:p-8 rounded-sm border border-pink-100/50">
                <h2 className="text-xl font-serif text-gray-800 mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                      placeholder="e.g. Shipping Delay, Product Defect, Custom Order"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none"
                      placeholder="Type your message here..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

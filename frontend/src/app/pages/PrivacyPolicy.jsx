import React from 'react';
import { Shield } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-pink-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-pink-100 p-3 rounded-2xl">
              <Shield className="w-8 h-8 text-pink-600" />
            </div>
            <h1 className="text-4xl font-serif text-gray-900">Privacy Policy</h1>
          </div>

          <div className="prose prose-pink max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-serif text-gray-800 mb-4">1. Collection of Information</h2>
              <p>
                We collect information from you when you register on our site, place an order, subscribe to our newsletter or fill out a form. 
                When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address, 
                phone number or credit card information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gray-800 mb-4">2. Use of Information</h2>
              <p>Any of the information we collect from you may be used in one of the following ways:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To personalize your experience</li>
                <li>To improve our website and customer service</li>
                <li>To process transactions</li>
                <li>To send periodic emails regarding your order or other products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gray-800 mb-4">3. Protection of Information</h2>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information when you place an order or 
                enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit 
                information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers 
                database only to be accessible by those authorized with special access rights to such systems, and are required to keep the 
                information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gray-800 mb-4">4. Cookies</h2>
              <p>
                Yes, we use cookies to help us remember and process the items in your shopping cart, understand and save your preferences 
                for future visits and keep track of advertisements.
              </p>
            </section>

            <p className="text-sm font-medium pt-8 border-t border-pink-50">
              Last Updated: March 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

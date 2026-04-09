import React from 'react';
import { Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Inaya</title>
        <meta name="description" content="Read Inaya's Privacy Policy to understand how we collect, use, and protect your personal information." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-xl p-6 md:p-8 border border-pink-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-pink-100 p-2.5 rounded-sm">
                <Shield className="w-8 h-8 text-pink-600" />
              </div>
              <h1 className="text-3xl font-serif text-gray-900">Privacy Policy</h1>
            </div>

            <div className="prose prose-pink max-w-none text-gray-600 space-y-6">
              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">1. Collection of Information</h2>
                <p>
                  We collect information from you when you register on our site, place an order, subscribe to our newsletter or fill out a form.
                  When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address,
                  phone number or credit card information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">2. Use of Information</h2>
                <p>Any of the information we collect from you may be used in one of the following ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To personalize your experience</li>
                  <li>To improve our website and customer service</li>
                  <li>To process transactions</li>
                  <li>To send periodic emails regarding your order or other products and services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">3. Protection of Information</h2>
                <p>
                  We implement a variety of security measures to maintain the safety of your personal information when you place an order or
                  enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit
                  information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers
                  database only to be accessible by those authorized with special access rights to such systems, and are required to keep the
                  information confidential.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">4. Cookies</h2>
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
    </>
  );
}

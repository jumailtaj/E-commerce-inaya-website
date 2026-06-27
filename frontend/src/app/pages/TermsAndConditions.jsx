import React from 'react';
import { FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function TermsAndConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions — Inaya</title>
        <meta name="description" content="Review the Terms and Conditions of Inaya Store. Understand your rights and agreements regarding the use of our e-commerce platform and hair accessories." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-xl p-6 md:p-8 border border-pink-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-pink-100 p-2.5 rounded-sm">
                <FileText className="w-8 h-8 text-pink-600" />
              </div>
              <h1 className="text-3xl font-serif text-gray-900">Terms & Conditions</h1>
            </div>

            <div className="prose prose-pink max-w-none text-gray-600 space-y-6">
              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">1. Agreement to Terms</h2>
                <p>
                  By accessing our website at Inaya, you agree to be bound by these terms of service, all applicable laws and regulations, 
                  and agree that you are responsible for compliance with any applicable local laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">2. Use License</h2>
                <p>
                  Permission is granted to temporarily download one copy of the materials (information or software) on Inaya's website for 
                  personal, non-commercial transitory viewing only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">3. Intellectual Property Rights</h2>
                <p>
                  The website and all of its contents, features, and functionality (including but not limited to all information, software, 
                  text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Inaya, its licensors, 
                  or other providers of such material and are protected by Indian and international copyright, trademark, patent, trade secret, 
                  and other intellectual property or proprietary rights laws. Any unauthorized use of the content or design templates is strictly prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">4. Disclaimer</h2>
                <p>
                  The materials on Inaya's website are provided on an 'as is' basis. Inaya makes no warranties, expressed or implied, 
                  and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions 
                  of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation 
                  of rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">5. Limitations</h2>
                <p>
                  In no event shall Inaya or its suppliers be liable for any damages (including, without limitation, damages for loss 
                  of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Inaya's website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">6. Governing Law</h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably 
                  submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>

              <section className="border-t border-pink-50 pt-6">
                <h2 className="text-xl font-serif text-gray-800 mb-3">7. Contact Information</h2>
                <p>
                  For any questions or concerns regarding these Terms & Conditions, please contact us via email at{' '}
                  <a href="mailto:support@inaya.com" className="text-pink-600 hover:underline font-medium">
                    support@inaya.com
                  </a>{' '}
                  or chat with us on WhatsApp at{' '}
                  <a href="https://wa.me/923172171142" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline font-medium">
                    +92 317 2171142
                  </a>.
                </p>
              </section>

              <p className="text-sm font-medium pt-8 border-t border-pink-50">
                Last Updated: June 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


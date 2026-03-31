import React from 'react';
import { FileText } from 'lucide-react';

export function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-pink-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-pink-100 p-2.5 rounded-xl">
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
              <h2 className="text-xl font-serif text-gray-800 mb-3">3. Disclaimer</h2>
              <p>
                The materials on Inaya's website are provided on an 'as is' basis. Inaya makes no warranties, expressed or implied, 
                and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions 
                of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation 
                of rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-gray-800 mb-3">4. Limitations</h2>
              <p>
                In no event shall Inaya or its suppliers be liable for any damages (including, without limitation, damages for loss 
                of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Inaya's website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-gray-800 mb-3">5. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably 
                submit to the exclusive jurisdiction of the courts in that State or location.
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

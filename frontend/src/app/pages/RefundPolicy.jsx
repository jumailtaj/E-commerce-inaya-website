import React from 'react';
import { RotateCcw } from 'lucide-react';

export function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-pink-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-pink-100 p-2.5 rounded-xl">
              <RotateCcw className="w-8 h-8 text-pink-600" />
            </div>
            <h1 className="text-3xl font-serif text-gray-900">Refund Policy</h1>
          </div>

          <div className="prose prose-pink max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-xl font-serif text-gray-800 mb-3">1. Return Eligibility</h2>
              <p>
                Our policy lasts 7 days. If 7 days have gone by since your purchase, unfortunately we can’t offer you a refund 
                or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. 
                It must also be in the original packaging.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-gray-800 mb-3">2. Non-returnable Items</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gift cards</li>
                <li>Downloadable software products</li>
                <li>Some health and personal care items</li>
                <li>Items on sale (only regular priced items may be refunded)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif text-gray-800 mb-3">3. Refund Process</h2>
              <p>
                Once your return is received and inspected, we will send you an email to notify you that we have received your 
                returned item. We will also notify you of the approval or rejection of your refund. 
                If you are approved, then your refund will be processed, and a credit will automatically be applied to your 
                credit card or original method of payment, within a certain amount of days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif text-gray-800 mb-3">4. Late or Missing Refunds</h2>
              <p>
                If you haven’t received a refund yet, first check your bank account again. 
                Then contact your credit card company, it may take some time before your refund is officially posted. 
                If you’ve done all of this and you still have not received your refund yet, please contact us at support@inaya.com.
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

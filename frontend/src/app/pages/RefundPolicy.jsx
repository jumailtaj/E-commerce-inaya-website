import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function RefundPolicy() {
  return (
    <>
      <Helmet>
        <title>Refund & Exchange Policy — Inaya</title>
        <meta name="description" content="Read Inaya's refund and exchange policy. Learn about returns eligibility, non-returnable hygiene items, and how to contact support to initiate a refund." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-xl p-6 md:p-8 border border-pink-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-pink-100 p-2.5 rounded-sm">
                <RotateCcw className="w-8 h-8 text-pink-600" />
              </div>
              <h1 className="text-3xl font-serif text-gray-900">Refund & Exchange Policy</h1>
            </div>

            <div className="prose prose-pink max-w-none text-gray-600 space-y-6">
              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">1. Return Eligibility</h2>
                <p>
                  Our return policy lasts 7 days from the date of delivery. If 7 days have gone by since your purchase was delivered, 
                  unfortunately we cannot offer you a refund or exchange. To be eligible for a return, your item must be unused, 
                  unworn, and in the same pristine condition that you received it. It must also be securely packed in its original packaging with all tags attached.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">2. Non-returnable Items</h2>
                <p>
                  To maintain strict health and hygiene standards, certain types of goods cannot be returned:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Worn or tried-on hair accessories (including hair bands, hair pins, clutches, banana clips, and combs)</li>
                  <li>Items where the original protective packaging seal is broken or removed</li>
                  <li>Customized or personalized orders</li>
                  <li>Gift cards</li>
                  <li>Sale items (only regular priced items may be refunded; sale items are final sale)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">3. Exchanges</h2>
                <p>
                  We only replace items if they are defective or damaged upon arrival. If you receive a damaged product and need to exchange it 
                  for the exact same item, please send us an email at{' '}
                  <a href="mailto:support@inaya.com" className="text-pink-600 hover:underline font-medium">
                    support@inaya.com
                  </a>{' '}
                  within 48 hours of delivery, attaching clear photos of the defect and your order details.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">4. Return & Refund Process</h2>
                <p>
                  To initiate a return, please contact our support team at{' '}
                  <a href="mailto:support@inaya.com" className="text-pink-600 hover:underline font-medium">
                    support@inaya.com
                  </a>. Do not send your purchase back to the manufacturer without prior approval.
                </p>
                <p className="mt-2">
                  Once your return is received and inspected by our warehouse team, we will send you an email to notify you that we have received 
                  your returned item. We will also notify you of the approval or rejection of your refund. 
                  If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment 
                  within 5 to 7 business days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">5. Late or Missing Refunds</h2>
                <p>
                  If you haven't received a refund yet, first check your bank account or payment provider again. 
                  Then contact your credit card company or bank, as it may take some processing time before your refund is officially posted. 
                  If you have completed all of these steps and still have not received your refund, please reach out to us at{' '}
                  <a href="mailto:support@inaya.com" className="text-pink-600 hover:underline font-medium">
                    support@inaya.com
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


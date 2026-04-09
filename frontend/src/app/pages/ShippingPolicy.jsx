import React from 'react';
import { Truck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function ShippingPolicy() {
  return (
    <>
      <Helmet>
        <title>Shipping Policy - Inaya</title>
        <meta name="description" content="Read our shipping policy to understand our shipping rates, delivery estimates, and more." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-xl p-6 md:p-8 border border-pink-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-pink-100 p-2.5 rounded-sm">
                <Truck className="w-8 h-8 text-pink-600" />
              </div>
              <h1 className="text-3xl font-serif text-gray-900">Shipping Policy</h1>
            </div>

            <div className="prose prose-pink max-w-none text-gray-600 space-y-6">
              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">1. Shipment Processing Time</h2>
                <p>
                  All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.
                  If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional
                  days in transit for delivery.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">2. Shipping Rates & Delivery Estimates</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-pink-100">
                    <thead className="bg-pink-50">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Method</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Estimate</th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-pink-50">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-medium">Standard</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">5-7 business days</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Free</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">Express</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2-3 business days</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹150</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">3. Shipment Confirmation & Order Tracking</h2>
                <p>
                  You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).
                  The tracking number will be active within 24 hours.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">4. Customs, Duties & Taxes</h2>
                <p>
                  Inaya is not responsible for any customs and taxes applied to your order. All fees imposed during or after
                  shipping are the responsibility of the customer (tariffs, taxes, etc.).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-serif text-gray-800 mb-3">5. Damages</h2>
                <p>
                  Inaya is not liable for any products damaged or lost during shipping. If you received your order damaged,
                  please contact the shipment carrier to file a claim.
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

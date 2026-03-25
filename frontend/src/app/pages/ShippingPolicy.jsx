import React from 'react';
import { Truck } from 'lucide-react';

export function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-pink-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-pink-100 p-3 rounded-2xl">
              <Truck className="w-8 h-8 text-pink-600" />
            </div>
            <h1 className="text-4xl font-serif text-gray-900">Shipping Policy</h1>
          </div>

          <div className="prose prose-pink max-w-none text-gray-600 space-y-6">
            <section>
              <h2 className="text-2xl font-serif text-gray-800 mb-4">1. Shipment Processing Time</h2>
              <p>
                All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. 
                If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional 
                days in transit for delivery.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gray-800 mb-4">2. Shipping Rates & Delivery Estimates</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-pink-100">
                  <thead className="bg-pink-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Estimate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-pink-600 uppercase tracking-wider">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-pink-50">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">Standard</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5-7 business days</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Free</td>
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
              <h2 className="text-2xl font-serif text-gray-800 mb-4">3. Shipment Confirmation & Order Tracking</h2>
              <p>
                You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). 
                The tracking number will be active within 24 hours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gray-800 mb-4">4. Customs, Duties & Taxes</h2>
              <p>
                Inaya is not responsible for any customs and taxes applied to your order. All fees imposed during or after 
                shipping are the responsibility of the customer (tariffs, taxes, etc.).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-gray-800 mb-4">5. Damages</h2>
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
  );
}

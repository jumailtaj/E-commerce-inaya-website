import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Heart, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router';

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us — Our Story & Values — Inaya</title>
        <meta name="description" content="Learn about Inaya's journey to creating premium, elegant hair accessories. Read about our brand values, our story, and why our accessories stand out." />
        <meta property="og:title" content="About Us — Our Story & Values — Inaya" />
        <meta property="og:description" content="Learn about Inaya's journey to creating premium, elegant hair accessories. Read about our brand values, our story, and why our accessories stand out." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Inaya",
            "description": "Learn about Inaya's journey to creating premium, elegant hair accessories.",
            "publisher": {
              "@type": "Organization",
              "name": "Inaya",
              "logo": {
                "@type": "ImageObject",
                "url": "https://inayaastore.in/inaya-og-banner.png"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-xl p-8 md:p-12 border border-pink-100">
            
            {/* Header section */}
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-sm text-xs font-bold uppercase tracking-wider mb-3">
                Our Story
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-4">
                About Inaya
              </h1>
              <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                Redefining everyday elegance with thoughtfully designed premium hair accessories.
              </p>
            </div>

            {/* Content sections */}
            <div className="prose prose-pink max-w-none text-gray-600 space-y-8">
              
              <section className="border-t border-pink-50 pt-8">
                <h2 className="text-2xl font-serif text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-pink-500" />
                  Our Journey
                </h2>
                <p className="leading-relaxed">
                  Inaya was founded with a simple yet passionate vision: to bridge the gap between high-quality craftsmanship and accessible, everyday hair styling. We believe that hair accessories are not just functional tools, but a form of self-expression. They possess the power to elevate a look, boost confidence, and add a touch of sophistication to any occasion.
                </p>
                <p className="leading-relaxed mt-4">
                  What started as a curated exploration of traditional and modern hair accessories has grown into a beloved online boutique trusted by thousands of customers across India. We obsess over the details—from selecting durable, hair-friendly materials to curating comfortable designs that keep your hair secure all day long without damage.
                </p>
              </section>

              <section className="border-t border-pink-50 pt-8">
                <h2 className="text-2xl font-serif text-gray-800 mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-500" />
                  Our Core Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-pink-50/50 rounded-sm border border-pink-100/50">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5 text-base">
                      <Star className="w-4 h-4 text-pink-600" />
                      Premium Quality
                    </h3>
                    <p className="text-sm">
                      Every clip, band, and pin is strictly checked for quality, finish, and durability to ensure premium satisfaction.
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50/50 rounded-sm border border-pink-100/50">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5 text-base">
                      <ShieldCheck className="w-4 h-4 text-pink-600" />
                      Hair Health First
                    </h3>
                    <p className="text-sm">
                      We design accessories with smooth edges and snag-free backings to avoid hair breakage or discomfort.
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50/50 rounded-sm border border-pink-100/50">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5 text-base">
                      <Sparkles className="w-4 h-4 text-pink-600" />
                      Modern Aesthetics
                    </h3>
                    <p className="text-sm">
                      We combine classic, timeless shapes with contemporary trends, bringing you collections that remain stylish.
                    </p>
                  </div>
                </div>
              </section>

              <section className="border-t border-pink-50 pt-8">
                <h2 className="text-2xl font-serif text-gray-800 mb-4">
                  Why Inaya Accessories?
                </h2>
                <p className="leading-relaxed">
                  Unlike mass-produced, thin plastic options that snap easily or pinch your scalp, our accessories are built using premium, lightweight materials such as eco-friendly acetate, sturdy alloy springs, and reinforced resin. Our designs are tailored for various hair volumes—ensuring that whether you have fine, silky hair or dense, curly locks, you will find an accessory that fits perfectly.
                </p>
              </section>

              {/* Call to action */}
              <div className="border-t border-pink-50 pt-10 text-center">
                <h3 className="text-xl font-serif text-gray-800 mb-4">
                  Explore Our Curated Collections
                </h3>
                <Link
                  to="/"
                  className="inline-block bg-pink-600 text-white px-8 py-3 rounded-sm font-medium text-base hover:bg-pink-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  Shop Best Sellers
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

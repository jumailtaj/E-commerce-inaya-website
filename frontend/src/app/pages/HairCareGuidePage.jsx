import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, Sparkles, Heart, ShieldCheck, Scissors } from 'lucide-react';
import { Link } from 'react-router';

export function HairCareGuidePage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqs = [
    {
      question: "Are acetate hair accessories safer for hair than metal or plastic ones?",
      answer: "Yes, eco-friendly cellulose acetate is highly recommended. Unlike cheap injection-molded plastic accessories, acetate is hand-polished and carved from organic materials. This process removes rough seams and sharp edges that clip or snag hair strands. Similarly, high-quality acetate hairpins have smooth, rounded edges that do not scratch the scalp or pull hair, making them much gentler for everyday wear."
    },
    {
      question: "How do I choose the right size of banana clip or clutch for thick hair?",
      answer: "For thick, heavy, or curly hair, look for clutches and banana clips that feature wider claw spacing, sturdy double hinges, and double-row teeth. Choose accessories made from durable materials like premium acetate or alloy, rather than thin plastics. A large clutch (around 10-12 cm) is perfect for securing full updos, while banana clips designed with flexible yet secure locking systems prevent slipping and reduce scalp tension."
    },
    {
      question: "How can I clean my hair accessories without damaging them?",
      answer: "To clean acetate or plastic hair accessories, wipe them gently with a damp microfiber cloth. For deeper cleans, use lukewarm water and a drop of mild, sulfate-free shampoo. Avoid harsh chemicals, alcohol, or hot water, as these can strip the finish and dull the gloss. For metal and gold-plated pins, use a dry, soft jewelry cloth to wipe away oils, and keep them dry to prevent tarnishing."
    },
    {
      question: "Can wearing tight hairbands cause hair breakage or headaches?",
      answer: "Yes, tight or poorly fitting hairbands can apply too much pressure behind the ears, leading to tension headaches, and they can frictionally wear down hair cuticles along the hairline. We suggest choosing hairbands that feature flexible, fabric-wrapped bands, or soft inner linings. Alternating the position of your hairbands and avoiding pulled-back styles that are too tight will help maintain a healthy hairline."
    },
    {
      question: "What is the best way to prevent hair accessories from slipping out of fine hair?",
      answer: "If you have fine or silky hair, look for clips and clutches that feature inner silicone grip strips or tightly spaced teeth. Before placing the clip, you can lightly mist the section of hair with a dry texture spray or light hairspray to create extra grip. Additionally, choosing lightweight accessories, such as mini clutches or smaller alloy hairpins, ensures they won't weigh your hair down."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Hair Care Tips & Style Guide — Inaya</title>
        <meta name="description" content="Discover professional hair care tips, accessory styling guides, and care instructions. Learn how to style and maintain hair clips, clutches, and bands safely." />
        <meta property="og:title" content="Hair Care Tips & Style Guide — Inaya" />
        <meta property="og:description" content="Discover professional hair care tips, accessory styling guides, and care instructions. Learn how to style and maintain hair clips, clutches, and bands safely." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Hair Care Tips & Accessory Style Guide",
            "description": "Professional guide on selecting, styling, and maintaining premium hair accessories for healthy, beautiful hair.",
            "image": "https://inayaastore.in/inaya-og-banner.png",
            "author": {
              "@type": "Organization",
              "name": "Inaya"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Inaya",
              "logo": {
                "@type": "ImageObject",
                "url": "https://inayaastore.in/inaya-og-banner.png"
              }
            },
            "datePublished": "2026-06-27T12:00:00Z",
            "dateModified": "2026-06-27T12:00:00Z"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-xl p-8 md:p-12 border border-pink-100">
            
            {/* Header section */}
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 bg-pink-100 text-pink-600 rounded-sm text-xs font-bold uppercase tracking-wider mb-3">
                Editorial & Guide
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-4">
                Hair Care Tips & Styling Guide
              </h1>
              <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
                Your ultimate companion to styling with elegance while prioritizing hair health and accessory longevity.
              </p>
            </div>

            {/* Main content */}
            <div className="prose prose-pink max-w-none text-gray-600 space-y-10">
              
              {/* Introduction */}
              <section className="border-t border-pink-50 pt-8">
                <p className="leading-relaxed text-lg font-light text-gray-700 italic">
                  Beautiful hair is healthy hair. While we love a stunning updo or a perfectly styled ponytail, the accessories we choose play a crucial role in preventing breakage, maintaining shine, and protecting our scalp. At Inaya, we design our hair accessories with both style and hair health in mind.
                </p>
              </section>

              {/* Guide Section 1 */}
              <section className="border-t border-pink-50 pt-8">
                <h2 className="text-2xl font-serif text-gray-800 mb-4 flex items-center gap-2">
                  <Scissors className="w-6 h-6 text-pink-500" />
                  1. How to Choose the Right Accessory for Your Hair Type
                </h2>
                <p className="leading-relaxed mb-4">
                  Every hair texture is unique, and matching the right accessory to your hair volume prevents slipping, pinching, and tension headaches. Here is how to find your perfect match:
                </p>
                <div className="space-y-4 pl-4 border-l-2 border-pink-200">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Fine or Silky Hair</h3>
                    <p className="text-sm mt-1">
                      Choose lightweight <Link to="/" className="text-pink-600 hover:underline">hair pins</Link> and small-to-medium <Link to="/" className="text-pink-600 hover:underline">clutches</Link> with close, dense teeth. Matte finishes or items featuring internal silicone grip linings provide extra traction, keeping accessories securely in place all day without pulling.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Thick, Coarse, or Curly Hair</h3>
                    <p className="text-sm mt-1">
                      Look for large clutches (10cm+) or wide-set <Link to="/" className="text-pink-600 hover:underline">banana clips</Link> made from hand-polished acetate or sturdy metal alloy. These materials resist bending and provide the structural strength needed to hold dense curls comfortably.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">Delicate or Damaged Hair</h3>
                    <p className="text-sm mt-1">
                      Stick to fabric-wrapped <Link to="/" className="text-pink-600 hover:underline">hair bands</Link> or smooth, seamless cellulose acetate clips. Avoid accessories with exposed sharp metal hinges, raw metallic springs, or rough plastic seams, which can snag and break delicate strands.
                    </p>
                  </div>
                </div>
              </section>

              {/* Guide Section 2 */}
              <section className="border-t border-pink-50 pt-8">
                <h2 className="text-2xl font-serif text-gray-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-pink-500" />
                  2. Essential Hair Accessory Care & Maintenance
                </h2>
                <p className="leading-relaxed mb-4">
                  Investing in premium accessories means taking care of them so they continue to make you shine. Proper maintenance ensures hygiene and structural durability:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    <strong>Keep it Dry:</strong> Water can weaken metal springs, rust alloy elements, and degrade adhesive backings. Remove your hair accessories before showering, swimming, or sleeping.
                  </li>
                  <li>
                    <strong>Gentle Cleaning:</strong> Once a month, wipe down your acetate accessories with a damp microfiber cloth. If hair products build up on your clutches, clean them using lukewarm water mixed with a drop of gentle shampoo. Wipe metal components immediately to prevent tarnishing.
                  </li>
                  <li>
                    <strong>Safe Storage:</strong> Avoid tossing hair clips loose into heavy bags where they might get crushed. Store them in a soft pouch, on a clip organizer, or in a dry jewelry drawer to prevent scratches.
                  </li>
                </ul>
              </section>

              {/* Guide Section 3 */}
              <section className="border-t border-pink-50 pt-8">
                <h2 className="text-2xl font-serif text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-pink-500" />
                  3. Three Elegant Hairstyles You Can Master in 2 Minutes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="p-5 bg-pink-50/50 rounded-sm border border-pink-100/50">
                    <span className="text-xs font-bold text-pink-600 uppercase">Style 01</span>
                    <h3 className="font-bold text-gray-800 mt-1 mb-2">The French Twist</h3>
                    <p className="text-xs leading-relaxed">
                      Gather your hair at the nape of your neck, twist it upwards into a roll against the back of your head, and secure it with a large premium clutch. Let a few face-framing strands fall free for a relaxed, sophisticated vibe.
                    </p>
                  </div>
                  <div className="p-5 bg-pink-50/50 rounded-sm border border-pink-100/50">
                    <span className="text-xs font-bold text-pink-600 uppercase">Style 02</span>
                    <h3 className="font-bold text-gray-800 mt-1 mb-2">The Half-Up Crown</h3>
                    <p className="text-xs leading-relaxed">
                      Take two small sections of hair from above your ears, pull them to the back of your head, and clip them together with a small decorative center clip or a tortoise-shell hairpin. It keeps hair off your face while highlighting its natural length.
                    </p>
                  </div>
                  <div className="p-5 bg-pink-50/50 rounded-sm border border-pink-100/50">
                    <span className="text-xs font-bold text-pink-600 uppercase">Style 03</span>
                    <h3 className="font-bold text-gray-800 mt-1 mb-2">The Classic Banana Sweep</h3>
                    <p className="text-xs leading-relaxed">
                      Gather hair backwards and place the open banana clip along the base of your skull. Sweep the hair upwards inside the clip, then latch it at the top. This creates a fuller, cascading ponytail effect with zero hair tie tension.
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ Accordion Section */}
              <section className="border-t border-pink-50 pt-8">
                <h2 className="text-2xl font-serif text-gray-800 mb-6 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-pink-500" />
                  Frequently Asked Questions (FAQs)
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className="border border-pink-100 rounded-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 bg-pink-50/20 hover:bg-pink-50/50 transition-colors text-left focus:outline-none"
                      >
                        <span className="font-medium text-gray-800 text-sm md:text-base">
                          {faq.question}
                        </span>
                        {openFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-pink-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-pink-600 shrink-0" />
                        )}
                      </button>
                      
                      {openFaq === index && (
                        <div className="p-4 bg-white border-t border-pink-50 text-sm leading-relaxed text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Call to action */}
              <div className="border-t border-pink-50 pt-10 text-center">
                <h3 className="text-xl font-serif text-gray-800 mb-4">
                  Ready to upgrade your hair styling routine?
                </h3>
                <Link
                  to="/"
                  className="inline-block bg-pink-600 text-white px-8 py-3 rounded-sm font-medium text-base hover:bg-pink-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  Explore Premium Accessories
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

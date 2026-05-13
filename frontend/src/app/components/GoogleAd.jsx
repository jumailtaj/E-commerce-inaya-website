import React, { useEffect, useRef } from 'react';

/**
 * GoogleAd Component
 * Renders an AdSense ad unit.
 * @param {string} slot - The AdSense slot ID.
 * @param {string} format - The ad format (default: 'auto').
 * @param {boolean} responsive - Whether the ad is responsive (default: true).
 */
const GoogleAd = ({ slot, format = 'auto', responsive = 'true' }) => {
  const adRef = useRef(null);

  useEffect(() => {
    // Only attempt to push if window.adsbygoogle is available
    // and if the component is mounted
    const timeoutId = setTimeout(() => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.warn("AdSense push failed. This is common during development or if using an ad blocker.", e);
      }
    }, 100); // Small delay to ensure the DOM element is rendered

    return () => clearTimeout(timeoutId);
  }, [slot]); // Re-run on slot change

  return (
    <div className="ad-wrapper my-12 w-full flex flex-col items-center overflow-hidden">
      <span className="text-[10px] text-gray-300 uppercase tracking-widest mb-2">Advertisement</span>
      <div className="bg-gray-50/50 rounded-sm p-4 w-full max-w-7xl flex justify-center min-h-[100px] border border-gray-100/50">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-2514421712510334"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
          ref={adRef}
        />
      </div>
    </div>
  );
};

export default GoogleAd;

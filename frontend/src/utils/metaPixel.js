import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = '973946395353124';
const IS_DEV = import.meta.env.DEV; 

const logEvent = (event, payload = null) => {
  // Always log for LIVE debugging as requested by user
  console.log(`[META] ${event} Fired`, payload || '');
  if (IS_DEV) {
    console.log(`\n[META PIXEL] Event Fired:\nEvent Name: ${event}\nPayload:`, payload, `\nTimestamp: ${new Date().toISOString()}\n`);
  }
};

let isInitialized = false;

export const initMetaPixel = () => {
  if (isInitialized) return;
  const options = {
    autoConfig: false, 
    debug: true, // Enable debug mode for LIVE to see react-facebook-pixel logs
  };
  ReactPixel.init(PIXEL_ID, undefined, options);
  isInitialized = true;
  console.log(`[META] Initialized with ID: ${PIXEL_ID}`);
};

export const trackPageView = () => {
  ReactPixel.pageView();
  logEvent('PageView');
};

export const trackViewContent = (product) => {
  if (!product) return;
  const payload = {
    content_ids: [String(product._id || product.id)],
    content_type: 'product',
    value: Number(product.price) || 0,
    currency: 'INR'
  };
  ReactPixel.track('ViewContent', payload);
  logEvent('ViewContent', payload);
};

export const trackAddToCart = (product) => {
  if (!product) return;
  const payload = {
    content_ids: [String(product._id || product.id)],
    content_type: 'product',
    value: Number(product.price) || 0,
    currency: 'INR'
  };
  ReactPixel.track('AddToCart', payload);
  logEvent('AddToCart', payload);
};

export const trackInitiateCheckout = (cartTotal) => {
  const payload = {
    value: Number(cartTotal) || 0,
    currency: 'INR'
  };
  ReactPixel.track('InitiateCheckout', payload);
  logEvent('InitiateCheckout', payload);
};

export const trackPurchase = (orderAmount, items) => {
  if (!items || !items.length) return;
  const payload = {
    value: Number(orderAmount) || 0,
    currency: 'INR',
    content_ids: items.map(item => String(item.product._id || item.product.id)),
    content_type: 'product'
  };
  ReactPixel.track('Purchase', payload);
  logEvent('Purchase', payload);
};

export const trackLead = (formData) => {
  const payload = {
    content_name: formData?.formName || 'Lead Form'
  };
  ReactPixel.track('Lead', payload);
  logEvent('Lead', payload);
};

export const trackCompleteRegistration = () => {
  const payload = {
    status: 'success'
  };
  ReactPixel.track('CompleteRegistration', payload);
  logEvent('CompleteRegistration', payload);
};

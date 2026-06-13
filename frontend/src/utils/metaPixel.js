import ReactPixel from 'react-facebook-pixel';

const PIXEL_ID = '973946395353124';
const IS_DEV = import.meta.env.DEV; // Vite specific environment variable for development mode

const logEvent = (event, payload = null) => {
  if (IS_DEV) {
    console.log(`\n[META PIXEL] Event Fired:\nEvent Name: ${event}\nPayload:`, payload, `\nTimestamp: ${new Date().toISOString()}\n`);
  }
};

export const initMetaPixel = () => {
  const options = {
    autoConfig: false, // strictly disable auto PageView so Layout.jsx is the single source of truth
    debug: false,
  };
  ReactPixel.init(PIXEL_ID, undefined, options);
  if (IS_DEV) {
    console.log(`[META PIXEL] Initialized with ID: ${PIXEL_ID} (autoConfig: false)`);
  }
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

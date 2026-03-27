import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
  </div>
);

// Enhanced lazy import with retry logic for ChunkLoadErrors
const lazyImport = (importFunc, exportName) => lazy(async () => {
  try {
    const module = await importFunc();
    return { default: module[exportName] };
  } catch (error) {
    console.error('Lazy import failed:', error);
    const isChunkError = error.name === 'ChunkLoadError' || 
                        error.message?.includes('Failed to fetch dynamically imported module');
    
    if (isChunkError) {
      // Automatic refresh to get the latest build chunks
      window.location.reload();
      // Return a never-resolving promise to keep the loading state until reload
      return new Promise(() => {});
    }
    throw error;
  }
});

const HomePage = lazyImport(() => import('./pages/HomePage'), 'HomePage');
const ProductDetailPage = lazyImport(() => import('./pages/ProductDetailPage'), 'ProductDetailPage');
const CartPage = lazyImport(() => import('./pages/CartPage'), 'CartPage');
const ProfilePage = lazyImport(() => import('./pages/ProfilePage'), 'ProfilePage');
const AdminPage = lazyImport(() => import('./pages/AdminPage'), 'AdminPage');
const AdminLoginPage = lazyImport(() => import('./pages/AdminLoginPage'), 'AdminLoginPage');
const LoginPage = lazyImport(() => import('./pages/LoginPage'), 'LoginPage');
const SignupPage = lazyImport(() => import('./pages/SignupPage'), 'SignupPage');
const CheckoutPage = lazyImport(() => import('./pages/CheckoutPage'), 'CheckoutPage');
const OrderHistoryPage = lazyImport(() => import('./pages/OrderHistoryPage'), 'OrderHistoryPage');
const PrivacyPolicy = lazyImport(() => import('./pages/PrivacyPolicy'), 'PrivacyPolicy');
const TermsAndConditions = lazyImport(() => import('./pages/TermsAndConditions'), 'TermsAndConditions');
const RefundPolicy = lazyImport(() => import('./pages/RefundPolicy'), 'RefundPolicy');
const ShippingPolicy = lazyImport(() => import('./pages/ShippingPolicy'), 'ShippingPolicy');

const withSuspense = (Component) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    errorElement: <ErrorBoundary><div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-center">Something went wrong. Please refresh.</div></ErrorBoundary>,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'product/:id', element: withSuspense(ProductDetailPage) },
      { path: 'cart', element: withSuspense(CartPage) },
      { path: 'privacy-policy', element: withSuspense(PrivacyPolicy) },
      { path: 'terms-and-conditions', element: withSuspense(TermsAndConditions) },
      { path: 'refund-policy', element: withSuspense(RefundPolicy) },
      { path: 'shipping-policy', element: withSuspense(ShippingPolicy) },
      { 
        element: <ProtectedRoute />,
        children: [
          { path: 'profile', element: withSuspense(ProfilePage) },
          { path: 'checkout', element: withSuspense(CheckoutPage) },
          { path: 'orders', element: withSuspense(OrderHistoryPage) },
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          { path: 'admin', element: withSuspense(AdminPage) },
        ]
      },
      { path: 'admin/login', element: withSuspense(AdminLoginPage) },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'signup', element: withSuspense(SignupPage) },
    ],
  },
]);

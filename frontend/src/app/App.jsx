import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import ReactPixel from 'react-facebook-pixel';

export default function App() {
  useEffect(() => {
    // Initialize the pixel with ID
    ReactPixel.init('973946395353124');
    // Log the initial PageView
    ReactPixel.pageView();
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
          <SpeedInsights />
          <Analytics />
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

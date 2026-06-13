import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { HelmetProvider } from 'react-helmet-async';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { initMetaPixel } from '../../utils/metaPixel';

// Initialize Meta Pixel synchronously at module load time
// This ensures it is ready before any child component useEffect fires
initMetaPixel();

export default function App() {
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

import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://www.inayaastore.in',
      dynamicRoutes: [
        '/cart',
        '/privacy-policy',
        '/terms-and-conditions',
        '/refund-policy',
        '/shipping-policy',
      ],
      exclude: ['/google8fc9e830a0d7c7eb'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
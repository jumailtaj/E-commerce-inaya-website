import fs from 'fs'
import axios from 'axios'

const BASE_URL = 'https://www.inayaastore.in'
const API_URL = 'https://e-commerce-inaya-website-production-c055.up.railway.app/api/products'

const staticRoutes = [
  '/',
  '/cart',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/shipping-policy',
]

async function generateSitemap() {
  try {
    const response = await axios.get(API_URL)
    const products = response.data.products || response.data

    const productRoutes = products.map(p => `/product/${p._id || p.id}`)
    const allRoutes = [...staticRoutes, ...productRoutes]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.includes('/product/') ? '0.8' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`

    // Ensure public directory exists
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public');
    }

    fs.writeFileSync('./public/sitemap.xml', xml)
    console.log(`Sitemap generated with ${allRoutes.length} URLs`)
  } catch (error) {
    console.error('Error generating sitemap:', error.message)
    process.exit(1)
  }
}

generateSitemap()

import fs from 'fs';
import axios from 'axios';

const BASE_URL = 'https://www.inayaastore.in';
const API_URL = 'https://e-commerce-inaya-website-production-c055.up.railway.app/api/products';

const staticRoutes = [
  '/',
  '/cart',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/shipping-policy',
];

async function generateSitemap() {
  console.log('STARTING: Sitemap generation sequence...');
  try {
    console.log(`FETCHING: Requesting products from API: ${API_URL}`);

    // 5-second timeout ensures Vercel won't hang forever if Railway is sleeping
    const response = await axios.get(API_URL, { timeout: 5000 });

    console.log('FETCH SUCCESS: Received response from Railway API.');
    const products = response.data.products || response.data;

    const productRoutes = Array.isArray(products)
      ? products.map(p => `/product/${p._id || p.id}`)
      : [];

    const allRoutes = [...staticRoutes, ...productRoutes];
    console.log(`PROCESSING: Total routes found to map: ${allRoutes.length}`);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.includes('/product/') ? '0.8' : '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`;

    if (!fs.existsSync('./public')) {
      console.log('FILESYSTEM: Creating missing /public folder.');
      fs.mkdirSync('./public');
    }

    fs.writeFileSync('./public/sitemap.xml', xml);
    console.log(`FINISHED: Sitemap generated successfully with ${allRoutes.length} URLs!`);
  } catch (error) {
    console.error('CRITICAL ERROR during sitemap generation:');
    if (error.code === 'ECONNABORTED') {
      console.error(`TIMEOUT: The Railway API took longer than 5 seconds to respond.`);
    } else {
      console.error(`MESSAGE: ${error.message}`);
    }
    process.exit(1);
  }
}

generateSitemap();
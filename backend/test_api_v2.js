const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testApi() {
  try {
    console.log('--- Testing GET /api/products ---');
    const allProducts = await axios.get(`${BASE_URL}/products`);
    console.log(`Total products: ${allProducts.data.products.length}`);
    if (allProducts.data.products.length > 0) {
      console.log('Sample product has category:', 'category' in allProducts.data.products[0]);
      console.log('Sample product has subcategory:', 'subcategory' in allProducts.data.products[0]);
    }

    console.log('\n--- Testing GET /api/products?category=Clips ---');
    const clips = await axios.get(`${BASE_URL}/products?category=Clips`);
    console.log(`Clips count: ${clips.data.products.length}`);
    const allClips = clips.data.products.every(p => p.category === 'Clips');
    console.log(`All returned products are Clips: ${allClips}`);

    console.log('\n--- Testing GET /api/products?category=Clips&subcategory=Pearl ---');
    const pearlClips = await axios.get(`${BASE_URL}/products?category=Clips&subcategory=Pearl`);
    console.log(`Pearl Clips count: ${pearlClips.data.products.length}`);
    const allPearlClips = pearlClips.data.products.every(p => p.category === 'Clips' && p.subcategory === 'Pearl');
    console.log(`All returned products are Pearl Clips: ${allPearlClips}`);

    console.log('\n--- Verification Successful ---');
  } catch (error) {
    console.error('--- Verification Failed ---');
    console.error(error.response?.data || error.message);
  }
}

testApi();

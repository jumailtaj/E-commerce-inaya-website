async function testOrder() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGFkNjEwOTlhOTllZDNjNDU3ZjhhNSIsImlhdCI6MTc3MjQ1MzgyNCwiZXhwIjoxNzcyNDU3NDI0fQ.9wH2vBG86c83J7__umSeyqM19';
  const data = {
    items: [
      {
        product: "69bbe9f6d059f450106461df",
        quantity: 1
      }
    ],
    shippingAddress: {
      street: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    }
  };

  try {
    const response = await fetch('http://localhost:5000/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    console.log('Response Status:', response.status);
    const result = await response.json();
    console.log('Response Data:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testOrder();

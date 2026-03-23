import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const PAYPAL_API = 'https://api-m.paypal.com';

async function getAccessToken() {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  
  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  
  const data = await response.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { requestId, amount: totalAmount } = await req.json();
    
    if (!requestId) {
      return Response.json({ error: 'Request ID is required' }, { status: 400 });
    }
    
    const amount = totalAmount ? totalAmount.toFixed(2) : '250.00';
    const description = 'Done-For-You App Foundation - Core scaffolding, data models, and baseline integrations';
    
    const accessToken = await getAccessToken();
    
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: requestId,
          description: description,
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        }],
        application_context: {
          brand_name: 'Kode Agency - App Foundation',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${req.headers.get('origin')}/AppFoundation?success=true&requestId=${requestId}`,
          cancel_url: `${req.headers.get('origin')}/AppFoundation?cancelled=true`,
        },
      }),
    });
    
    const orderData = await orderResponse.json();
    
    if (!orderResponse.ok) {
      return Response.json({ error: 'Failed to create PayPal order', details: orderData }, { status: 500 });
    }
    
    const approvalLink = orderData.links.find(link => link.rel === 'approve');
    
    return Response.json({ 
      orderId: orderData.id,
      approvalUrl: approvalLink?.href 
    });
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
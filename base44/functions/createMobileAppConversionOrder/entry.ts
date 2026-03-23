import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID");
const PAYPAL_CLIENT_SECRET = Deno.env.get("PAYPAL_CLIENT_SECRET");
const PAYPAL_BASE_URL = "https://api-m.paypal.com";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestData = await req.json();

    const accessToken = await getPayPalAccessToken();

    const order = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: '750.00'
          },
          description: 'Mobile App Conversion Service'
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/MobileAppConversion?success=true`,
          cancel_url: `${req.headers.get('origin')}/MobileAppConversion?cancelled=true`
        }
      })
    });

    const orderData = await order.json();

    await base44.entities.MobileAppConversionRequest.create({
      ...requestData,
      payment_status: 'pending',
      payment_amount: 750
    });

    const approvalUrl = orderData.links.find(link => link.rel === 'approve')?.href;

    return Response.json({ 
      orderId: orderData.id,
      approvalUrl 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function getPayPalAccessToken() {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`);
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const getAccessToken = async () => {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  
  const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    body: "grant_type=client_credentials"
  });
  
  const data = await response.json();
  return data.access_token;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { requestId, hours, amount } = await req.json();
    
    if (!requestId || !hours || !amount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const accessToken = await getAccessToken();
    
    const orderResponse = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: amount.toString()
          },
          description: `Done-With-You Build Sprint - ${hours} hours`
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/BuildSprint?success=true&requestId=${requestId}`,
          cancel_url: `${req.headers.get('origin')}/BuildSprint?cancelled=true`
        }
      })
    });

    const orderData = await orderResponse.json();
    
    if (!orderResponse.ok) {
      return Response.json({ error: 'Failed to create PayPal order', details: orderData }, { status: 500 });
    }

    const approvalUrl = orderData.links.find(link => link.rel === 'approve')?.href;

    return Response.json({ 
      orderId: orderData.id,
      approvalUrl 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
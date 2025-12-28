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
    const { quoteId, amount } = await req.json();
    
    const accessToken = await getAccessToken();
    
    const quotes = await base44.asServiceRole.entities.Quote.filter({ id: quoteId });
    if (quotes.length === 0) {
      return Response.json({ error: 'Quote not found' }, { status: 404 });
    }
    const quote = quotes[0];

    const orderResponse = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: quoteId,
          description: `Quote ${quote.quote_number} - ${quote.project_title}`,
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2)
          }
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/quote/${quoteId}?requestId=${quoteId}`,
          cancel_url: `${req.headers.get('origin')}/quote/${quoteId}`,
          brand_name: "Kode Agency",
          user_action: "PAY_NOW"
        }
      })
    });

    const orderData = await orderResponse.json();
    const approvalUrl = orderData.links?.find(l => l.rel === 'approve')?.href;

    return Response.json({ 
      orderId: orderData.id,
      approvalUrl 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
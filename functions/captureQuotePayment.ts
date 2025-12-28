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
    const { orderId, quoteId } = await req.json();
    
    const accessToken = await getAccessToken();

    const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const captureData = await captureResponse.json();

    if (captureData.status === "COMPLETED") {
      // Update quote status
      const quotes = await base44.asServiceRole.entities.Quote.filter({ id: quoteId });
      if (quotes.length > 0) {
        const quote = quotes[0];
        
        await base44.asServiceRole.entities.Quote.update(quoteId, {
          status: 'paid',
          payment_id: orderId,
          paid_date: new Date().toISOString()
        });

        // Create a Lead in CRM
        await base44.asServiceRole.entities.Lead.create({
          name: quote.client_name,
          email: quote.client_email,
          company: quote.client_company || '',
          source: 'Website',
          status: 'Won',
          description: `Quote ${quote.quote_number} - ${quote.project_title}`,
          deal_value: quote.price,
          notes: `Paid via PayPal. Quote accepted and paid.\n\nScope:\n${quote.scope_of_work}${quote.client_notes ? `\n\nClient Notes:\n${quote.client_notes}` : ''}`
        });

        // Send confirmation email
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'will@kodeagency.us',
          subject: `💰 Quote Paid: ${quote.quote_number} - $${quote.price}`,
          body: `
Quote ${quote.quote_number} has been paid!

Client: ${quote.client_name}
Email: ${quote.client_email}
Company: ${quote.client_company || 'N/A'}
Project: ${quote.project_title}
Amount: $${quote.price.toLocaleString()}

Scope of Work:
${quote.scope_of_work}

${quote.client_notes ? `Client Notes:\n${quote.client_notes}` : ''}

PayPal Order ID: ${orderId}
          `
        });
      }

      return Response.json({ success: true });
    }

    return Response.json({ error: 'Payment not completed' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
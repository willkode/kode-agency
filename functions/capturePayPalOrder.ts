import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const PAYPAL_API = 'https://api-m.paypal.com'; // Use https://api-m.sandbox.paypal.com for testing

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
    
    const { orderId, requestId } = await req.json();
    
    if (!orderId || !requestId) {
      return Response.json({ error: 'Order ID and Request ID are required' }, { status: 400 });
    }
    
    const accessToken = await getAccessToken();
    
    // Capture the payment
    const captureResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const captureData = await captureResponse.json();
    
    if (!captureResponse.ok || captureData.status !== 'COMPLETED') {
      return Response.json({ error: 'Payment capture failed', details: captureData }, { status: 500 });
    }
    
    // Update the request status
    await base44.asServiceRole.entities.AppReviewRequest.update(requestId, {
      payment_status: 'completed'
    });
    
    // Get the request details for the email
    const requests = await base44.asServiceRole.entities.AppReviewRequest.filter({ id: requestId });
    const requestData = requests[0];
    
    if (requestData) {
      // Create a Lead in CRM for tracking
      await base44.asServiceRole.entities.Lead.create({
        name: requestData.name,
        email: requestData.email,
        phone: requestData.phone || '',
        source: 'Website',
        status: 'Won',
        description: `Base44 ER App Review Request${requestData.include_fix ? ' + Fix' : ''}\n\nApp URL: ${requestData.app_url}\n\nIssue:\n${requestData.issue_description}`,
        deal_value: requestData.payment_amount || 25,
        notes: `Country: ${requestData.country || 'Not provided'}\nService: Base44 ER${requestData.include_fix ? ' + Fix' : ''}\nPayPal Order: ${orderId}`
      });

      // Send notification email
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'will@kodeagency.us',
        subject: `💰 PAID: Base44 ER Review Request from ${requestData.name}`,
        body: `
PAYMENT CONFIRMED - New App Review Request

Payment Details:
- PayPal Order ID: ${orderId}
- Amount: $25.00 USD

Client Details:
- Name: ${requestData.name}
- Email: ${requestData.email}
- Phone: ${requestData.phone || 'Not provided'}
- Country: ${requestData.country || 'Not provided'}
- App URL: ${requestData.app_url}

Issue Description:
${requestData.issue_description}

Admin invite should have been sent to: iamwillkode@gmail.com

A Lead has been automatically created in your CRM.

---
This is an automated notification from Base44 ER.
        `
      });
    }
    
    return Response.json({ 
      success: true,
      status: captureData.status 
    });
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
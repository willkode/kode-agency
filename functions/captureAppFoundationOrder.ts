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
    await base44.asServiceRole.entities.AppFoundationRequest.update(requestId, {
      payment_status: 'completed'
    });
    
    // Get the request details for the email
    const requests = await base44.asServiceRole.entities.AppFoundationRequest.filter({ id: requestId });
    const requestData = requests[0];
    
    if (requestData) {
      // Create a Lead in CRM for tracking
      await base44.asServiceRole.entities.Lead.create({
        name: requestData.name,
        email: requestData.email,
        source: 'Website',
        status: 'Qualified',
        description: `App Foundation Request\n\nApp Name: ${requestData.app_name}\nDescription: ${requestData.app_description}\nPlatform: ${requestData.preferred_platform}\n\nCore Features:\n${requestData.core_features}\n\nIntegrations: ${requestData.integrations || 'None specified'}\nAuth: ${requestData.auth_requirements || 'Not specified'}\nDatabase: ${requestData.database_needs || 'Not specified'}`,
        deal_value: 250,
        notes: `App Foundation - ${requestData.app_name}\nPayPal Order: ${orderId}`
      });

      // Send notification email
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'will@kodeagency.us',
        subject: `💰 PAID: App Foundation Request from ${requestData.name} - ${requestData.app_name}`,
        body: `
PAYMENT CONFIRMED - New App Foundation Request

Payment Details:
- PayPal Order ID: ${orderId}
- Amount: $250.00 USD

Client Details:
- Name: ${requestData.name}
- Email: ${requestData.email}

App Details:
- App Name: ${requestData.app_name}
- Description: ${requestData.app_description}
- Target Users: ${requestData.target_users || 'Not specified'}
- Preferred Platform: ${requestData.preferred_platform}

Core Features:
${requestData.core_features}

Integrations: ${requestData.integrations || 'None specified'}
Other Integrations: ${requestData.other_integrations || 'None'}
Auth Requirements: ${requestData.auth_requirements || 'Not specified'}
Database Needs: ${requestData.database_needs || 'Not specified'}
Deadline: ${requestData.deadline || 'Not specified'}
Reference Links: ${requestData.reference_links || 'None'}

A Lead has been automatically created in your CRM.

---
This is an automated notification from Kode Agency.
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
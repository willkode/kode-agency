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

    const { orderId } = await req.json();

    const accessToken = await getPayPalAccessToken();

    const capture = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const captureData = await capture.json();

    if (captureData.status === 'COMPLETED') {
      const requests = await base44.asServiceRole.entities.MobileAppConversionRequest.filter({
        payment_status: 'pending',
        email: user.email
      });

      if (requests.length > 0) {
        const latestRequest = requests[0];
        await base44.asServiceRole.entities.MobileAppConversionRequest.update(latestRequest.id, {
          payment_status: 'completed'
        });

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: 'Mobile App Conversion Payment Confirmed',
          body: `Thank you! Your payment for the Mobile App Conversion service has been confirmed. We'll review your request and be in touch shortly.\n\nWeb App: ${latestRequest.web_app_url}`
        });

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'support@kodebase.us',
          subject: 'New Mobile App Conversion Request (Paid)',
          body: `New mobile app conversion request from ${latestRequest.name}.\n\nEmail: ${latestRequest.email}\nCompany: ${latestRequest.company}\nWeb App: ${latestRequest.web_app_url}\nDescription: ${latestRequest.description}\nAuth: ${latestRequest.has_auth}\nPlatforms: ${latestRequest.platforms_needed?.join(', ')}\nAdd-ons: ${latestRequest.add_ons?.join(', ')}\nQuestions: ${latestRequest.questions}`
        });
      }
    }

    return Response.json({ status: captureData.status });

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
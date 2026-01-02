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
    const { orderId, requestId } = await req.json();
    
    if (!orderId || !requestId) {
      return Response.json({ error: 'Missing orderId or requestId' }, { status: 400 });
    }

    const accessToken = await getAccessToken();
    
    const captureResponse = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const captureData = await captureResponse.json();
    
    if (!captureResponse.ok) {
      return Response.json({ error: 'Failed to capture payment', details: captureData }, { status: 500 });
    }

    // Update the request with payment status
    await base44.asServiceRole.entities.BuildSprintRequest.update(requestId, {
      payment_status: 'completed'
    });

    // Get the request details for the email
    const requests = await base44.asServiceRole.entities.BuildSprintRequest.filter({ id: requestId });
    const request = requests[0];

    // Create a lead in CRM
    await base44.asServiceRole.entities.Lead.create({
      name: request.name,
      email: request.email,
      source: 'Website',
      status: 'Won',
      description: `Build Sprint - ${request.hours} hours\nMVP Goal: ${request.mvp_goal}\nTop 3 Actions: ${request.top_3_actions || 'N/A'}\nIntegrations: ${request.integrations_needed || 'N/A'}\nExisting Issues: ${request.existing_issues || 'N/A'}`,
      deal_value: request.payment_amount,
      notes: `Base44 App: ${request.base44_app_link || 'New project'}`
    });

    // Send notification email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'will@kodeagency.us',
      subject: `New Build Sprint Booking - ${request.name} (${request.hours} hours)`,
      body: `
New Build Sprint booking received!

Client: ${request.name}
Email: ${request.email}
Hours: ${request.hours}
Amount Paid: $${request.payment_amount}

Base44 App: ${request.base44_app_link || 'New project'}
MVP Goal: ${request.mvp_goal}
Top 3 Actions: ${request.top_3_actions || 'N/A'}
Integrations Needed: ${request.integrations_needed || 'N/A'}
Existing Issues: ${request.existing_issues || 'N/A'}

The client will now schedule their session via Calendly.
      `
    });

    return Response.json({ 
      success: true,
      captureData 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
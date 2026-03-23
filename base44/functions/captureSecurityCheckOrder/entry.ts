import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    
    const { session, requestId } = await req.json();
    
    if (!session || !requestId) {
      return Response.json({ error: 'Session and requestId are required' }, { status: 400 });
    }

    await base44.asServiceRole.entities.SecurityCheckRequest.update(requestId, {
      payment_status: 'completed'
    });

    const requests = await base44.asServiceRole.entities.SecurityCheckRequest.filter({ id: requestId });
    const requestData = requests[0];

    if (requestData) {
      // Check if lead already exists
      const existingLeads = await base44.asServiceRole.entities.Lead.filter({ payment_reference: session.id });
      let lead;
      
      if (existingLeads.length > 0) {
        lead = existingLeads[0];
        console.log(`Lead already exists for session ${session.id}, skipping creation`);
      } else {
        lead = await base44.asServiceRole.entities.Lead.create({
          name: requestData.name,
          email: requestData.email,
          phone: requestData.phone || '',
          source: 'Website',
          status: 'Won',
          description: `Security Check Request\n\nApp URL: ${requestData.app_url}\n\nFocus Areas:\n${requestData.description}`,
          deal_value: requestData.payment_amount || 50,
          notes: `Country: ${requestData.country || 'Not provided'}\nService: ${requestData.payment_amount === 125 ? 'Security Check + Fix' : 'Security Check'}\nStripe Session: ${session.id}`,
          service_sku: 'security_check',
          payment_status: 'completed',
          payment_provider: 'stripe',
          payment_reference: session.id,
          amount: requestData.payment_amount || 50
        });
      }

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'will@kodeagency.us',
        subject: `💰 PAID: Security Check from ${requestData.name}`,
        body: `
PAYMENT CONFIRMED - Security Check Request

Payment Details:
- Stripe Session ID: ${session.id}
- Amount: $${requestData.payment_amount || 50}.00 USD
- Service: ${requestData.payment_amount === 125 ? 'Security Check + Implementation' : 'Security Check Only'}

Client Details:
- Name: ${requestData.name}
- Email: ${requestData.email}
- Phone: ${requestData.phone || 'Not provided'}
- Country: ${requestData.country || 'Not provided'}
- App URL: ${requestData.app_url}

Focus Areas:
${requestData.description}

Collaborator invite should have been sent to: iamwillkode@gmail.com

A Lead has been automatically created in your CRM.
        `
      });

      // Send confirmation email to customer
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: requestData.email,
        subject: 'Thank You for Your Order - Security Check',
        body: `
Hi ${requestData.name},

Thank you for purchasing our Security Check service. We're excited to help secure your Base44 app!

Our team will complete the security audit within 24-48 hours (Monday - Friday) and send you a detailed report with findings and recommendations.

If you have any questions in the meantime, feel free to reply to this email.

Best regards,
The Kode Agency Team

---
Kode Agency | AI-Accelerated Development
        `
      });
      
      // Auto-convert to project
      try {
        await base44.asServiceRole.functions.invoke('convertLeadToProject', { lead_id: lead.id });
        console.log(`Auto-converted lead ${lead.id} to project`);
      } catch (err) {
        console.error('Auto-conversion failed:', err);
      }
    }

    return Response.json({ 
      success: true,
      requestId,
      amount: requestData.payment_amount || 50
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
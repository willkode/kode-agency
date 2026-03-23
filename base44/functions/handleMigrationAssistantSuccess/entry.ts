import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return Response.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Retrieve the session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const { accessId, userEmail } = session.metadata;
    
    if (!accessId) {
      return Response.json({ error: 'Invalid session metadata' }, { status: 400 });
    }

    // Update the access record
    await base44.asServiceRole.entities.MigrationAssistantAccess.update(accessId, {
      payment_status: 'completed',
      payment_reference: session.id
    });

    // Send notification email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'will@kodeagency.us',
      subject: `💰 Migration Assistant Purchase - ${userEmail}`,
      body: `
New Migration Assistant Access Purchase

- Email: ${userEmail}
- Amount: $15.00 USD
- Stripe Session: ${session.id}
- Access ID: ${accessId}
      `
    });

    return Response.json({ 
      success: true,
      message: 'Access granted'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
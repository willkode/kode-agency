import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const origin = req.headers.get('origin');
    
    // User must be authenticated
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user already has access
    const existingAccess = await base44.asServiceRole.entities.MigrationAssistantAccess.filter({
      user_email: user.email,
      payment_status: 'completed'
    });

    if (existingAccess.length > 0) {
      return Response.json({ error: 'You already have access to the Migration Assistant' }, { status: 400 });
    }

    // Create a pending access record
    const accessRecord = await base44.asServiceRole.entities.MigrationAssistantAccess.create({
      user_email: user.email,
      payment_status: 'pending',
      amount: 15
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Migration Assistant Access',
            description: 'One-time lifetime access to the Frontend Migration Assistant tool'
          },
          unit_amount: 1500, // $15.00 in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/MigrationAssistant?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/MigrationAssistant?cancelled=true`,
      customer_email: user.email,
      metadata: {
        service: 'MigrationAssistant',
        accessId: accessRecord.id,
        userEmail: user.email
      }
    });

    return Response.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
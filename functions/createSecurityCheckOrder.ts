import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const origin = req.headers.get('origin');
    
    const { requestId, customerEmail, customerName } = await req.json();
    
    if (!requestId) {
      return Response.json({ error: 'Request ID is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Base44 Security Check Service',
          },
          unit_amount: 2000, // $20.00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/SecurityCheck?success=true&session_id={CHECKOUT_SESSION_ID}&requestId=${requestId}`,
      cancel_url: `${origin}/SecurityCheck?cancelled=true`,
      customer_email: customerEmail,
      allow_promotion_codes: true,
      metadata: {
        service: 'SecurityCheck',
        requestId,
        customerName: customerName || ''
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
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scan_id } = await req.json();
    const origin = req.headers.get('origin');

    if (!scan_id) {
      return Response.json({ error: 'scan_id is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Frontend Exporter - Migration Plan',
            description: 'Full AI-powered Base44 frontend migration report with step-by-step action plan.'
          },
          unit_amount: 2500 // $25.00
        },
        quantity: 1
      }],
      mode: 'payment',
      allow_promotion_codes: true,
      customer_email: user.email,
      success_url: `${origin}/FrontendExporter?success=true&session_id={CHECKOUT_SESSION_ID}&scan_id=${scan_id}`,
      cancel_url: `${origin}/FrontendExporter?scan_id=${scan_id}`,
      metadata: {
        service: 'FrontendExporter',
        scan_id,
        user_email: user.email
      }
    });

    return Response.json({ url: session.url, sessionId: session.id });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
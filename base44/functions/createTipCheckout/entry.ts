import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { amount, name, message } = await req.json();

    if (!amount || amount < 1) {
      return Response.json(
        { error: 'Invalid amount. Minimum $1 required.' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Tip',
              description: message ? `From: ${name || 'Anonymous'} - ${message}` : `From: ${name || 'Anonymous'}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/ThankYou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/Tip`,
      metadata: {
        type: 'tip',
        tipper_name: name || 'Anonymous',
        message: message || ''
      }
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Tip checkout error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
});
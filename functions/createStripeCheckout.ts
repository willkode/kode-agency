import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const origin = req.headers.get('origin');
    
    const { 
      service, 
      requestId, 
      amount, 
      description,
      customerEmail,
      customerName,
      metadata 
    } = await req.json();
    
    if (!service || !amount) {
      return Response.json({ error: 'Service and amount are required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: description || service,
          },
          unit_amount: Math.round(amount * 100), // Stripe uses cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/${service}?success=true&session_id={CHECKOUT_SESSION_ID}&requestId=${requestId || ''}`,
      cancel_url: `${origin}/${service}?cancelled=true`,
      customer_email: customerEmail,
      metadata: {
        service,
        requestId: requestId || '',
        customerName: customerName || '',
        ...metadata
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
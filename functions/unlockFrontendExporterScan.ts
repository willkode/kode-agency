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

    const { session_id, scan_id } = await req.json();

    if (!session_id || !scan_id) {
      return Response.json({ error: 'session_id and scan_id are required' }, { status: 400 });
    }

    // Verify stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not confirmed' }, { status: 402 });
    }

    // Unlock the scan
    await base44.asServiceRole.entities.FrontendExporterScan.update(scan_id, {
      status: 'completed',
      payment_status: 'completed',
      payment_reference: session_id
    });

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
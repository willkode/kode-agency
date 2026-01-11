import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';
import { Resend } from 'npm:resend@2.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { requestId, service, email, name, amount, description } = await req.json();

    if (!requestId || !service || !email || !name || !amount) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine the success URL based on service
    const baseUrl = req.headers.get('origin') || 'https://kodeagency.us';
    const successUrl = `${baseUrl}/${service}?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/${service}?cancelled=true`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description || `${service} Service`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        service,
        requestId,
        customerName: name,
      },
    });

    // Send email with payment link via Resend
    await resend.emails.send({
      from: 'Kode Agency <hello@kodeagency.us>',
      to: email,
      subject: `Complete Your Payment - ${description || service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #73e28a;">Complete Your Payment</h1>
          <p>Hi ${name},</p>
          <p>Thank you for your interest in our <strong>${description || service}</strong> service.</p>
          <p>To proceed with your order, please complete your payment of <strong>$${amount.toFixed(2)} USD</strong> using the secure link below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${session.url}" style="background-color: #73e28a; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Complete Payment
            </a>
          </div>
          <p style="color: #888; font-size: 14px;">This payment link will expire in 24 hours. If you have any questions, please reply to this email.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>The Kode Agency Team</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #888; font-size: 12px;">Kode Agency | AI-Accelerated Development</p>
        </div>
      `
    });

    return Response.json({ 
      success: true, 
      message: 'Payment link sent successfully',
      checkoutUrl: session.url 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
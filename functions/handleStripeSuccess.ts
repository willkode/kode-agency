import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';
import { Resend } from 'npm:resend@2.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

async function sendCustomerConfirmationEmail(email, name, serviceName) {
  await resend.emails.send({
    from: 'Kode Agency <hello@kodeagency.us>',
    to: email,
    subject: `Thank You for Your Order - ${serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #73e28a;">Thank You for Your Order!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for purchasing our <strong>${serviceName}</strong> service. We're excited to work with you!</p>
        <p>Our team will review your request and reach out to you <strong>within 24 hours (Monday - Friday)</strong> to confirm your order and provide an estimated timeline.</p>
        <p>If you have any questions in the meantime, feel free to reply to this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>The Kode Agency Team</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px;">Kode Agency | AI-Accelerated Development</p>
      </div>
    `
  });
}

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

    const { service, requestId, customerName } = session.metadata;
    
    // Handle different services
    if (service === 'Base44ER' && requestId) {
      await handleBase44ER(base44, session, requestId);
    } else if (service === 'MobileAppConversion' && requestId) {
      await handleMobileAppConversion(base44, session, requestId);
    } else if (service === 'BuildSprint' && requestId) {
      await handleBuildSprint(base44, session, requestId);
    } else if (service === 'AppFoundation' && requestId) {
      await handleAppFoundation(base44, session, requestId);
    }

    return Response.json({ 
      success: true,
      service,
      requestId
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function handleBase44ER(base44, session, requestId) {
  await base44.asServiceRole.entities.AppReviewRequest.update(requestId, {
    payment_status: 'completed'
  });

  const requests = await base44.asServiceRole.entities.AppReviewRequest.filter({ id: requestId });
  const requestData = requests[0];

  if (requestData) {
    await base44.asServiceRole.entities.Lead.create({
      name: requestData.name,
      email: requestData.email,
      phone: requestData.phone || '',
      source: 'Website',
      status: 'Won',
      description: `Base44 ER App Review Request${requestData.include_fix ? ' + Fix' : ''}\n\nApp URL: ${requestData.app_url}\n\nIssue:\n${requestData.issue_description}`,
      deal_value: requestData.payment_amount || (requestData.include_fix ? 150 : 50),
      notes: `Country: ${requestData.country || 'Not provided'}\nService: Base44 ER${requestData.include_fix ? ' + Fix' : ''}\nStripe Session: ${session.id}`
    });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'will@kodeagency.us',
      subject: `💰 PAID: Base44 ER Review Request from ${requestData.name}`,
      body: `
PAYMENT CONFIRMED - New App Review Request

Payment Details:
- Stripe Session ID: ${session.id}
- Amount: $${(session.amount_total / 100).toFixed(2)} USD

Client Details:
- Name: ${requestData.name}
- Email: ${requestData.email}
- Phone: ${requestData.phone || 'Not provided'}
- Country: ${requestData.country || 'Not provided'}
- App URL: ${requestData.app_url}

Issue Description:
${requestData.issue_description}

Admin invite should have been sent to: iamwillkode@gmail.com

A Lead has been automatically created in your CRM.
      `
    });

    // Send confirmation email to customer
    await sendCustomerConfirmationEmail(requestData.email, requestData.name, 'Base44 ER App Review');
  }
}

async function handleMobileAppConversion(base44, session, requestId) {
  await base44.asServiceRole.entities.MobileAppConversionRequest.update(requestId, {
    payment_status: 'completed'
  });

  const requests = await base44.asServiceRole.entities.MobileAppConversionRequest.filter({ id: requestId });
  const requestData = requests[0];

  if (requestData) {
    await base44.asServiceRole.entities.Lead.create({
      name: requestData.name,
      email: requestData.email,
      source: 'Website',
      status: 'Won',
      description: `Mobile App Conversion\n\nWeb App: ${requestData.web_app_url}\nDescription: ${requestData.description}\nPlatforms: ${requestData.platforms_needed?.join(', ') || 'Not specified'}`,
      deal_value: 750,
      notes: `Stripe Session: ${session.id}\nAdd-ons: ${requestData.add_ons?.join(', ') || 'None'}`
    });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'will@kodeagency.us',
      subject: `💰 PAID: Mobile App Conversion from ${requestData.name}`,
      body: `
PAYMENT CONFIRMED - Mobile App Conversion Request

Payment Details:
- Stripe Session ID: ${session.id}
- Amount: $750.00 USD

Client Details:
- Name: ${requestData.name}
- Email: ${requestData.email}
- Company: ${requestData.company || 'Not provided'}
- Web App URL: ${requestData.web_app_url}

Description: ${requestData.description}
Has Auth: ${requestData.has_auth || 'Not specified'}
Platforms: ${requestData.platforms_needed?.join(', ') || 'Not specified'}
Add-ons: ${requestData.add_ons?.join(', ') || 'None'}
Questions: ${requestData.questions || 'None'}

A Lead has been automatically created in your CRM.
      `
    });

    // Send confirmation email to customer
    await sendCustomerConfirmationEmail(requestData.email, requestData.name, 'Mobile App Conversion');
  }
}

async function handleBuildSprint(base44, session, requestId) {
  await base44.asServiceRole.entities.BuildSprintRequest.update(requestId, {
    payment_status: 'completed'
  });

  const requests = await base44.asServiceRole.entities.BuildSprintRequest.filter({ id: requestId });
  const requestData = requests[0];

  if (requestData) {
    await base44.asServiceRole.entities.Lead.create({
      name: requestData.name,
      email: requestData.email,
      source: 'Website',
      status: 'Won',
      description: `Build Sprint - ${requestData.hours} hours\nMVP Goal: ${requestData.mvp_goal}\nTop 3 Actions: ${requestData.top_3_actions || 'N/A'}\nIntegrations: ${requestData.integrations_needed || 'N/A'}\nExisting Issues: ${requestData.existing_issues || 'N/A'}`,
      deal_value: requestData.payment_amount,
      notes: `Base44 App: ${requestData.base44_app_link || 'New project'}\nStripe Session: ${session.id}`
    });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'will@kodeagency.us',
      subject: `💰 PAID: Build Sprint from ${requestData.name} (${requestData.hours} hours)`,
      body: `
PAYMENT CONFIRMED - Build Sprint Booking

Payment Details:
- Stripe Session ID: ${session.id}
- Amount: $${requestData.payment_amount} USD

Client Details:
- Name: ${requestData.name}
- Email: ${requestData.email}
- Hours: ${requestData.hours}

Base44 App: ${requestData.base44_app_link || 'New project'}
MVP Goal: ${requestData.mvp_goal}
Top 3 Actions: ${requestData.top_3_actions || 'N/A'}
Integrations Needed: ${requestData.integrations_needed || 'N/A'}
Existing Issues: ${requestData.existing_issues || 'N/A'}

The client will now schedule their session via Calendly.
      `
    });

    // Send confirmation email to customer
    await sendCustomerConfirmationEmail(requestData.email, requestData.name, 'Build Sprint');
  }
}

async function handleAppFoundation(base44, session, requestId) {
  await base44.asServiceRole.entities.AppFoundationRequest.update(requestId, {
    payment_status: 'completed'
  });

  const requests = await base44.asServiceRole.entities.AppFoundationRequest.filter({ id: requestId });
  const requestData = requests[0];

  if (requestData) {
    await base44.asServiceRole.entities.Lead.create({
      name: requestData.name,
      email: requestData.email,
      source: 'Website',
      status: 'Won',
      description: `App Foundation Request\n\nApp Name: ${requestData.app_name}\nDescription: ${requestData.app_description}\nPlatform: ${requestData.preferred_platform}\n\nCore Features:\n${requestData.core_features}\n\nIntegrations: ${requestData.integrations || 'None specified'}`,
      deal_value: requestData.total_amount || 250,
      notes: `App Foundation - ${requestData.app_name}\nStripe Session: ${session.id}`
    });

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'will@kodeagency.us',
      subject: `💰 PAID: App Foundation from ${requestData.name} - ${requestData.app_name}`,
      body: `
PAYMENT CONFIRMED - App Foundation Request

Payment Details:
- Stripe Session ID: ${session.id}
- Amount: $${requestData.total_amount || 250} USD

Client Details:
- Name: ${requestData.name}
- Email: ${requestData.email}

App Details:
- App Name: ${requestData.app_name}
- Description: ${requestData.app_description}
- Target Users: ${requestData.target_users || 'Not specified'}
- Preferred Platform: ${requestData.preferred_platform}

Core Features:
${requestData.core_features}

Integrations: ${requestData.integrations || 'None specified'}
Other Integrations: ${requestData.other_integrations || 'None'}
Auth Requirements: ${requestData.auth_requirements || 'Not specified'}
Database Needs: ${requestData.database_needs || 'Not specified'}
Deadline: ${requestData.deadline || 'Not specified'}
Add-ons: ${requestData.addons?.join(', ') || 'None'}

A Lead has been automatically created in your CRM.
      `
    });

    // Send confirmation email to customer
    await sendCustomerConfirmationEmail(requestData.email, requestData.name, 'App Foundation');
  }
}
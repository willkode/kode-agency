import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { lead_id, to_email, subject, body, template_used } = await req.json();

    if (!to_email || !subject || !body) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return Response.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
    }

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kode Agency <hello@kodebase.us>',
        to: [to_email],
        subject: subject,
        html: body.replace(/\n/g, '<br>'),
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      // Log failed email to database
      if (lead_id) {
        await base44.asServiceRole.entities.EmailThread.create({
          lead_id,
          from_email: 'hello@kodebase.us',
          to_email,
          subject,
          body,
          direction: 'sent',
          status: 'failed',
          template_used: template_used || null,
        });
      }
      return Response.json({ error: resendData.message || 'Failed to send email' }, { status: 500 });
    }

    // Log successful email to database
    let emailThread = null;
    if (lead_id) {
      emailThread = await base44.asServiceRole.entities.EmailThread.create({
        lead_id,
        from_email: 'hello@kodebase.us',
        to_email,
        subject,
        body,
        direction: 'sent',
        status: 'sent',
        template_used: template_used || null,
      });

      // Also log to activity
      await base44.asServiceRole.entities.Activity.create({
        lead_id,
        type: 'Email',
        description: `Sent: ${subject}`,
      });
    }

    return Response.json({ 
      success: true, 
      resend_id: resendData.id,
      email_thread_id: emailThread?.id
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
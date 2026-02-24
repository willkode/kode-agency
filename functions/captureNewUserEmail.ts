import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { event, data } = payload;

    if (event?.type !== 'create') {
      return Response.json({ skipped: true });
    }

    const email = data?.email;
    const full_name = data?.full_name;

    if (!email) {
      return Response.json({ skipped: true, reason: 'No email found' });
    }

    // Check if already stored
    const existing = await base44.asServiceRole.entities.MailchimpContact.filter({ email });
    if (existing && existing.length > 0) {
      return Response.json({ skipped: true, reason: 'Already exists' });
    }

    await base44.asServiceRole.entities.MailchimpContact.create({
      email,
      full_name: full_name || '',
      status: 'pending',
      source: 'signup'
    });

    return Response.json({ success: true, email });

  } catch (error) {
    console.error('captureNewUserEmail error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
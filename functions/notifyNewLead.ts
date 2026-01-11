import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  try {
    const { name, email, phone, payment_status, service, amount } = await req.json();

    const statusLabel = {
      pending: 'Unpaid',
      completed: 'Paid',
      failed: 'Cancelled'
    }[payment_status] || 'Pending';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #73e28a; margin-bottom: 20px;">🎉 New Lead: ${service}</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name:</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Service:</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${service}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: bold;">Amount:</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">$${amount || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Payment Status:</td>
            <td style="padding: 12px;">
              <span style="background: ${payment_status === 'completed' ? '#22c55e' : payment_status === 'failed' ? '#ef4444' : '#f59e0b'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 14px;">
                ${statusLabel}
              </span>
            </td>
          </tr>
        </table>
        
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          Check the admin dashboard for more details.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: 'Kode Agency <notifications@kodebase.us>',
      to: 'will@kodeagency.us',
      subject: `New Lead: ${name} - ${service}`,
      html,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending lead notification:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
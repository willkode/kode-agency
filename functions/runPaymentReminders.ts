import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const REMINDER_INTERVAL_DAYS = 3;
const MAX_REMINDERS = 3;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const now = new Date();
    
    // Find leads with pending payment and due reminders
    const allLeads = await base44.asServiceRole.entities.Lead.filter({ payment_status: 'pending' });
    
    const leadsToRemind = allLeads.filter(lead => {
      // Skip if max reminders reached
      if ((lead.reminder_count || 0) >= MAX_REMINDERS) return false;
      
      // Check if next_reminder_at is due
      if (!lead.next_reminder_at) {
        // First reminder: if lead is older than 1 day
        const createdDate = new Date(lead.created_date);
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        return createdDate < oneDayAgo;
      }
      
      return new Date(lead.next_reminder_at) <= now;
    });

    const results = {
      processed: 0,
      reminded: 0,
      marked_stale: 0,
      errors: []
    };

    for (const lead of leadsToRemind) {
      try {
        const currentCount = lead.reminder_count || 0;
        const newCount = currentCount + 1;
        
        // Check if this is the last reminder
        if (newCount >= MAX_REMINDERS) {
          // Mark as stale
          const currentTags = lead.marketing_tags || [];
          if (!currentTags.includes('payment_stale')) {
            currentTags.push('payment_stale');
          }
          
          await base44.asServiceRole.entities.Lead.update(lead.id, {
            reminder_count: newCount,
            marketing_tags: currentTags,
            next_reminder_at: null // No more reminders
          });
          
          results.marked_stale++;
          console.log(`Lead ${lead.id} marked as payment_stale after ${newCount} reminders`);
        } else {
          // Send reminder email
          const serviceName = {
            'app_review': 'App Review',
            'mobile_app_conversion': 'Mobile App Conversion',
            'build_sprint': 'Build Sprint',
            'app_foundation': 'App Foundation'
          }[lead.service_sku] || 'Service';

          await resend.emails.send({
            from: 'Kode Agency <hello@kodeagency.us>',
            to: lead.email,
            subject: `Reminder: Complete Your ${serviceName} Payment`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #73e28a;">Payment Reminder</h2>
                <p>Hi ${lead.name},</p>
                <p>We noticed your payment for <strong>${serviceName}</strong> is still pending.</p>
                <p>Amount: <strong>$${lead.amount || lead.deal_value || 'N/A'}</strong></p>
                <p>If you have any questions or need assistance, please reply to this email.</p>
                <br/>
                <p>Best regards,</p>
                <p><strong>The Kode Agency Team</strong></p>
              </div>
            `
          });

          // Calculate next reminder date
          const nextReminder = new Date(now.getTime() + REMINDER_INTERVAL_DAYS * 24 * 60 * 60 * 1000);
          
          await base44.asServiceRole.entities.Lead.update(lead.id, {
            reminder_count: newCount,
            next_reminder_at: nextReminder.toISOString()
          });
          
          results.reminded++;
          console.log(`Sent reminder ${newCount} to lead ${lead.id} (${lead.email})`);
        }
        
        results.processed++;
      } catch (err) {
        console.error(`Error processing lead ${lead.id}:`, err);
        results.errors.push({ lead_id: lead.id, error: err.message });
      }
    }

    return Response.json({ 
      success: true, 
      ...results,
      total_pending_leads: allLeads.length,
      leads_eligible: leadsToRemind.length
    });

  } catch (error) {
    console.error('Error running payment reminders:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
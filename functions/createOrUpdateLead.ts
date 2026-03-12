import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { 
      name, 
      email, 
      phone, 
      company,
      source, 
      description,
      budget,
      timeline,
      deal_value,
      service_sku,
      payment_status,
      payment_reference,
      amount
    } = await req.json();

    if (!name || !email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if lead already exists by email
    const existingLeads = await base44.asServiceRole.entities.Lead.filter({ email });
    
    let lead;
    let isExisting = false;
    
    if (existingLeads.length > 0) {
      // Lead exists - update and add activity log
      isExisting = true;
      const existingLead = existingLeads[0];
      
      // Merge data - keep existing non-empty values, update with new ones
      const updates = {
        name: name || existingLead.name,
        phone: phone || existingLead.phone,
        company: company || existingLead.company,
        budget: budget || existingLead.budget,
        timeline: timeline || existingLead.timeline,
        // Append to description if new info provided
        description: description 
          ? (existingLead.description 
              ? `${existingLead.description}\n\n--- New submission (${new Date().toLocaleDateString()}) ---\n${description}` 
              : description)
          : existingLead.description,
        // Update deal value if higher
        deal_value: deal_value && (!existingLead.deal_value || deal_value > existingLead.deal_value) 
          ? deal_value 
          : existingLead.deal_value,
        // Update payment info if provided
        payment_status: payment_status || existingLead.payment_status,
        payment_reference: payment_reference || existingLead.payment_reference,
        amount: amount || existingLead.amount,
        service_sku: service_sku || existingLead.service_sku,
      };
      
      lead = await base44.asServiceRole.entities.Lead.update(existingLead.id, updates);
      
      // Log activity for duplicate submission
      await base44.asServiceRole.entities.Activity.create({
        lead_id: existingLead.id,
        type: 'Note',
        description: `Duplicate submission from ${source || 'unknown source'} - Lead data updated and merged`
      });
      
    } else {
      // Create new lead
      lead = await base44.asServiceRole.entities.Lead.create({
        name,
        email,
        phone: phone || '',
        company: company || '',
        source: source || 'Website',
        status: 'New',
        description: description || '',
        budget: budget || '',
        timeline: timeline || '',
        deal_value: deal_value || 0,
        service_sku: service_sku || null,
        payment_status: payment_status || 'pending',
        payment_reference: payment_reference || null,
        amount: amount || 0,
      });
      
      // Log initial contact activity
      await base44.asServiceRole.entities.Activity.create({
        lead_id: lead.id,
        type: 'Note',
        description: `First contact via ${source || 'website'}`
      });
    }

    return Response.json({ 
      success: true, 
      lead,
      isExisting,
      message: isExisting 
        ? 'Existing lead updated - communications merged' 
        : 'New lead created'
    });

  } catch (error) {
    console.error('Error creating/updating lead:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
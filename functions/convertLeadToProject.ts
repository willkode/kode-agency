import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Default task templates when none exist for a service
const DEFAULT_TASKS = [
  { name: 'Discovery', description: 'Initial review and requirements gathering', default_priority: 'High' },
  { name: 'Requirements', description: 'Document detailed requirements', default_priority: 'High' },
  { name: 'Build', description: 'Development and implementation', default_priority: 'High' },
  { name: 'Review', description: 'Quality assurance and testing', default_priority: 'Medium' },
  { name: 'Delivery', description: 'Final delivery and handoff', default_priority: 'Medium' },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { lead_id } = await req.json();
    
    if (!lead_id) {
      return Response.json({ error: 'lead_id is required' }, { status: 400 });
    }

    // Fetch the lead
    const leads = await base44.asServiceRole.entities.Lead.filter({ id: lead_id });
    const lead = leads[0];
    
    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Check payment status
    if (lead.payment_status !== 'completed') {
      return Response.json({ 
        error: 'Cannot convert: Payment not completed',
        payment_status: lead.payment_status 
      }, { status: 400 });
    }

    // Idempotency: if project_id exists, return existing project
    if (lead.project_id) {
      const existingProjects = await base44.asServiceRole.entities.Project.filter({ id: lead.project_id });
      if (existingProjects[0]) {
        return Response.json({ 
          success: true, 
          project: existingProjects[0],
          message: 'Project already exists (idempotent)',
          already_existed: true
        });
      }
    }

    // Create the project
    const projectTitle = `${lead.name || lead.email} - ${lead.service_sku || 'Project'}`;
    const project = await base44.asServiceRole.entities.Project.create({
      title: projectTitle,
      client_name: lead.name,
      client_email: lead.email,
      client_company: lead.company || '',
      platform: lead.preferred_platform || 'Base44',
      status: 'Planning',
      priority: 'High',
      budget: lead.amount || lead.deal_value || 0,
      description: lead.description || '',
      lead_id: lead.id,
      service_sku: lead.service_sku || ''
    });

    // Update lead with project_id
    await base44.asServiceRole.entities.Lead.update(lead.id, {
      project_id: project.id
    });

    // Fetch task templates for this service_sku
    let templates = [];
    if (lead.service_sku) {
      templates = await base44.asServiceRole.entities.TaskTemplate.filter({ category: lead.service_sku });
      // Sort by sort_order if available
      templates.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }

    // Create tasks from templates or defaults
    const tasksToCreate = templates.length > 0 ? templates : DEFAULT_TASKS;
    const createdTasks = [];
    
    for (const template of tasksToCreate) {
      const task = await base44.asServiceRole.entities.Task.create({
        name: template.name,
        project_id: project.id,
        status: 'To Do',
        priority: template.default_priority || 'Medium',
        description: template.description || ''
      });
      createdTasks.push(task);
    }

    console.log(`Converted lead ${lead.id} to project ${project.id} with ${createdTasks.length} tasks`);

    return Response.json({ 
      success: true, 
      project,
      tasks_created: createdTasks.length,
      used_templates: templates.length > 0,
      already_existed: false
    });

  } catch (error) {
    console.error('Error converting lead to project:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
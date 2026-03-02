import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { service_slug, service_name, service_description, service_url } = await req.json();

    // Generate post text using LLM
    const textPrompt = `Write a compelling LinkedIn post to promote this service:

Service: ${service_name}
Description: ${service_description}
URL: ${service_url}

Requirements:
- Professional but engaging tone
- Include a clear call-to-action
- Use 1-2 relevant emojis
- Include the URL at the end
- Keep it under 200 words
- Make it feel authentic, not salesy

Write only the post text, nothing else.`;

    const postText = await base44.integrations.Core.InvokeLLM({
      prompt: textPrompt
    });

    // Generate image using AI
    const imagePrompt = `Create a professional LinkedIn marketing graphic for a tech agency service called "${service_name}". 
Style: Modern, clean, dark blue/green tech aesthetic with subtle gradients. 
Include abstract tech elements like code snippets, circuits, or geometric shapes.
Text overlay should say: "${service_name}" in bold white text.
Professional business feel, suitable for B2B marketing.
16:9 aspect ratio.`;

    const imageResult = await base44.integrations.Core.GenerateImage({
      prompt: imagePrompt
    });

    // Create the post record
    const post = await base44.entities.LinkedInPost.create({
      text: postText,
      image_url: imageResult.url,
      service_slug,
      service_url,
      status: 'draft'
    });

    return Response.json({ success: true, post });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
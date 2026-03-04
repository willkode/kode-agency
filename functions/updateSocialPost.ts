import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (apiKey !== Deno.env.get('ARES_API_KEY')) {
      return Response.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    
    const base44 = createClientFromRequest(req);

    const { 
      post_id, 
      status, 
      hashtag_notes, 
      error_message, 
      post_url, 
      published_at,
      metrics 
    } = await req.json();

    if (!post_id) {
      return Response.json({ success: false, error: 'post_id is required' }, { status: 400 });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (hashtag_notes !== undefined) updateData.hashtag_notes = hashtag_notes;
    if (error_message !== undefined) updateData.error_message = error_message;
    if (post_url !== undefined) updateData.post_url = post_url;
    if (published_at !== undefined) updateData.published_at = published_at;
    if (metrics !== undefined) updateData.metrics = metrics;

    // Update the post
    const post = await base44.asServiceRole.entities.SocialPost.update(post_id, updateData);

    // If status is approved or generate_hashtags, notify the Ares agent
    if (status === 'approved' || status === 'generate_hashtags') {
      try {
        await fetch('https://app.base44.com/api/apps/69a756e9f5df095cfa4d8633/agent/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': Deno.env.get('ARES_API_KEY')
          },
          body: JSON.stringify({
            message: `Process SocialPost id: ${post_id} status: ${status}`,
            conversation_id: '69a756eb805b811b041879f4'
          })
        });
      } catch (agentError) {
        // Log but don't fail the update if agent notification fails
        console.error('Failed to notify agent:', agentError.message);
      }
    }

    return Response.json({ success: true, post });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
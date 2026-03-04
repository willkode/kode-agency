import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

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

    return Response.json({ success: true, post });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
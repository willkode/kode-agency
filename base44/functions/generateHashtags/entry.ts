import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { post_id } = await req.json();

    if (!post_id) {
      return Response.json({ success: false, error: 'post_id is required' }, { status: 400 });
    }

    // Get the post
    const posts = await base44.asServiceRole.entities.SocialPost.filter({ id: post_id });
    if (!posts || posts.length === 0) {
      return Response.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    const post = posts[0];

    // Generate hashtags using LLM
    const prompt = `You are a social media expert. Analyze this ${post.platform} post promoting ${post.service === 'build_sprint' ? 'Build Sprint (a 2-hour live coding session service)' : 'Base44 ER (emergency app repair service)'}.

Post content:
${post.content}

${post.title ? `Title: ${post.title}` : ''}
${post.subreddit ? `Subreddit: r/${post.subreddit}` : ''}

Provide:
1. 5-10 relevant hashtags for this ${post.platform} post
2. Brief analysis of the post's tone and target audience
3. Suggestions for optimal posting times
4. Any improvements to make the post more engaging

Format your response clearly with sections.`;

    const hashtagNotes = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true
    });

    // Update the post with hashtag notes and set back to pending_review
    await base44.asServiceRole.entities.SocialPost.update(post_id, {
      hashtag_notes: hashtagNotes,
      status: 'pending_review'
    });

    return Response.json({ success: true, hashtag_notes: hashtagNotes });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const SERVICES = {
  build_sprint: {
    name: 'Build Sprint',
    description: 'Live screen-share session where I build your MVP while you watch and learn. $75/hr',
    url: 'https://kodebase.us/BuildSprint'
  },
  base44_er: {
    name: 'Base44 Emergency Room',
    description: 'Expert app review + fix service for just $50',
    url: 'https://kodebase.us/Base44ER'
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { platform, service } = await req.json();
    
    const serviceInfo = SERVICES[service];
    if (!serviceInfo) {
      return Response.json({ error: 'Invalid service' }, { status: 400 });
    }

    let textPrompt = '';
    let title = '';
    let subreddit = '';

    if (platform === 'twitter') {
      textPrompt = `Write a compelling Twitter/X post to promote this service:

Service: ${serviceInfo.name}
Description: ${serviceInfo.description}
URL: ${serviceInfo.url}

Requirements:
- Engaging, conversational tone
- MUST be under 280 characters total
- Include 2-3 relevant hashtags like #VibeCoding #NoCode #Base44 #BuildInPublic
- Include a clear call-to-action
- Use 1-2 emojis sparingly
- Include the URL
- Make it feel authentic, not salesy

Write only the tweet text, nothing else.`;
    } else if (platform === 'reddit') {
      const subreddits = ['SideProject', 'startups', 'EntrepreneurRideAlong', 'nocode', 'webdev'];
      subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
      
      textPrompt = `Write a Reddit post for r/${subreddit} to subtly promote this service:

Service: ${serviceInfo.name}
Description: ${serviceInfo.description}
URL: ${serviceInfo.url}

Requirements:
- Follow Reddit etiquette - be helpful and genuine, not promotional
- Write as if sharing a useful resource or personal experience
- Include both a title and body text
- Format as: TITLE: [title here]\n\nBODY: [body here]
- Body should be 100-200 words
- Naturally mention the service without being pushy
- End with the URL as "Check it out here: ${serviceInfo.url}"

Write only the post, nothing else.`;
    } else if (platform === 'linkedin') {
      textPrompt = `Write a compelling LinkedIn post to promote this service:

Service: ${serviceInfo.name}
Description: ${serviceInfo.description}
URL: ${serviceInfo.url}

Requirements:
- Professional but engaging tone
- Include a clear call-to-action
- Use 1-2 relevant emojis
- Include the URL at the end
- Keep it under 200 words
- Make it feel authentic, not salesy
- End with relevant hashtags including #VibeCoding #NoCode #BuildInPublic
- MUST include #Base44 and @Base44 in the hashtags

Write only the post text, nothing else.`;
    }

    const postText = await base44.integrations.Core.InvokeLLM({
      prompt: textPrompt
    });

    // Parse Reddit response for title
    let content = postText;
    if (platform === 'reddit' && postText.includes('TITLE:') && postText.includes('BODY:')) {
      const titleMatch = postText.match(/TITLE:\s*(.+?)(?:\n|BODY:)/s);
      const bodyMatch = postText.match(/BODY:\s*(.+)/s);
      title = titleMatch ? titleMatch[1].trim() : '';
      content = bodyMatch ? bodyMatch[1].trim() : postText;
    }

    // Create the post record
    const post = await base44.entities.SocialPost.create({
      platform,
      service,
      title: title || null,
      content,
      subreddit: subreddit || null,
      status: 'pending_review',
      generated_by_ai: true
    });

    return Response.json({ success: true, postId: post.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
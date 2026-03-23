import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Optimal posting times by platform (in CST/America/Chicago timezone)
// Based on engagement research for B2B tech/services
const POSTING_TIMES = {
  twitter: {
    // Twitter: 3 posts per day - morning, lunch, evening
    0: ['09:00', '12:30', '17:00'], // Sunday
    1: ['08:00', '12:00', '17:30'], // Monday
    2: ['08:00', '12:00', '17:30'], // Tuesday
    3: ['09:00', '12:00', '17:00'], // Wednesday
    4: ['08:00', '12:00', '17:30'], // Thursday
    5: ['09:00', '12:30', '16:00'], // Friday
    6: ['10:00', '13:00', '16:00']  // Saturday
  },
  linkedin: {
    // LinkedIn: 3 posts per day - morning commute, lunch, end of workday
    0: ['10:00', '14:00', '18:00'], // Sunday (lower engagement)
    1: ['07:30', '12:00', '17:00'], // Monday
    2: ['07:30', '12:00', '17:00'], // Tuesday
    3: ['08:00', '12:00', '17:30'], // Wednesday (best day)
    4: ['07:30', '12:00', '17:00'], // Thursday
    5: ['08:00', '12:00', '15:00'], // Friday (earlier end)
    6: ['10:00', '14:00', '17:00']  // Saturday
  },
  reddit: {
    // Reddit: 3 posts per day - morning, afternoon, evening
    0: ['09:00', '14:00', '20:00'], // Sunday
    1: ['08:00', '13:00', '19:00'], // Monday
    2: ['08:00', '13:00', '19:00'], // Tuesday
    3: ['08:00', '13:00', '19:00'], // Wednesday
    4: ['08:00', '13:00', '19:00'], // Thursday
    5: ['09:00', '14:00', '18:00'], // Friday
    6: ['10:00', '15:00', '20:00']  // Saturday
  }
};

const SERVICES = ['build_sprint', 'base44_er'];

const SERVICE_INFO = {
  build_sprint: {
    name: 'Build Sprint',
    description: 'A 2-hour live coding session where an expert developer builds your app features in real-time',
    url: 'https://kodebase.us/build-sprint'
  },
  base44_er: {
    name: 'Base44 Emergency Room',
    description: 'Emergency app repair service - fix critical bugs and issues fast',
    url: 'https://kodebase.us/base44-er'
  }
};

const PLATFORM_PROMPTS = {
  twitter: (service, dayNum, slotNum) => `You are a social media expert. Create a unique, engaging Twitter post promoting ${SERVICE_INFO[service].name}.

Service: ${SERVICE_INFO[service].description}
URL: ${SERVICE_INFO[service].url}

Requirements:
- Max 280 characters (leave room for link)
- Include relevant hashtags (2-3 max)
- Be conversational and authentic
- Include a clear call to action
- Make it unique - this is post #${dayNum * 3 + slotNum + 1} of a 90-post series

Vary the angle: problem/solution, testimonial-style, question, tip, statistic, or story format.

Return ONLY the tweet text, nothing else.`,

  linkedin: (service, dayNum, slotNum) => `You are a LinkedIn content expert. Create a professional, engaging LinkedIn post promoting ${SERVICE_INFO[service].name}.

Service: ${SERVICE_INFO[service].description}
URL: ${SERVICE_INFO[service].url}

Requirements:
- 150-300 words
- Professional but not corporate
- Include 3-5 relevant hashtags at the end
- Start with a hook (question, bold statement, or story)
- Include clear value proposition
- End with a call to action
- Make it unique - this is post #${dayNum * 3 + slotNum + 1} of a 90-post series

Vary the format: story, tips list, question, industry insight, case study style, or problem/solution.

Return ONLY the post text, nothing else.`,

  reddit: (service, dayNum, slotNum) => `You are a Reddit marketing expert. Create an authentic Reddit post promoting ${SERVICE_INFO[service].name}.

Service: ${SERVICE_INFO[service].description}
URL: ${SERVICE_INFO[service].url}

Requirements:
- Write like a real Reddit user, not a marketer
- Be helpful and add value first
- Subtle promotion only
- Include a title and body
- Make it unique - this is post #${dayNum * 3 + slotNum + 1} of a 90-post series

Format your response exactly like this:
TITLE: [your title here]
BODY: [your post body here]
SUBREDDIT: [suggested subreddit like SideProject, startups, webdev, etc]`
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { platform, days = 30 } = await req.json();

    if (!platform || !POSTING_TIMES[platform]) {
      return Response.json({ success: false, error: 'Valid platform is required (twitter, linkedin, reddit)' }, { status: 400 });
    }

    const posts = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start tomorrow
    startDate.setHours(0, 0, 0, 0);

    // Generate 3 posts per day for the specified number of days
    for (let dayOffset = 0; dayOffset < days; dayOffset++) {
      const postDate = new Date(startDate);
      postDate.setDate(postDate.getDate() + dayOffset);
      const dayOfWeek = postDate.getDay();
      const times = POSTING_TIMES[platform][dayOfWeek];

      for (let slotIndex = 0; slotIndex < times.length; slotIndex++) {
        const time = times[slotIndex];
        const [hours, minutes] = time.split(':').map(Number);
        
        const scheduledDate = new Date(postDate);
        scheduledDate.setHours(hours, minutes, 0, 0);

        // Alternate services
        const service = SERVICES[(dayOffset * 3 + slotIndex) % SERVICES.length];

        // Generate content using LLM
        const prompt = PLATFORM_PROMPTS[platform](service, dayOffset, slotIndex);
        
        let content, title, subreddit;
        
        try {
          const llmResponse = await base44.integrations.Core.InvokeLLM({ prompt });
          
          if (platform === 'reddit') {
            // Parse Reddit response
            const titleMatch = llmResponse.match(/TITLE:\s*(.+)/i);
            const bodyMatch = llmResponse.match(/BODY:\s*([\s\S]+?)(?=SUBREDDIT:|$)/i);
            const subredditMatch = llmResponse.match(/SUBREDDIT:\s*(\w+)/i);
            
            title = titleMatch ? titleMatch[1].trim() : 'Check this out';
            content = bodyMatch ? bodyMatch[1].trim() : llmResponse;
            subreddit = subredditMatch ? subredditMatch[1].trim() : 'SideProject';
          } else {
            content = llmResponse.trim();
          }
        } catch (llmError) {
          console.error('LLM error:', llmError.message);
          content = `Check out ${SERVICE_INFO[service].name}! ${SERVICE_INFO[service].url}`;
          if (platform === 'reddit') {
            title = `Discover ${SERVICE_INFO[service].name}`;
            subreddit = 'SideProject';
          }
        }

        const postData = {
          platform,
          service,
          content,
          status: 'scheduled',
          scheduled_for: scheduledDate.toISOString(),
          generated_by_ai: true
        };

        if (platform === 'reddit') {
          postData.title = title;
          postData.subreddit = subreddit;
        }

        posts.push(postData);
      }
    }

    // Bulk create all posts
    const createdPosts = await base44.asServiceRole.entities.SocialPost.bulkCreate(posts);

    return Response.json({ 
      success: true, 
      count: createdPosts.length,
      message: `Created ${createdPosts.length} scheduled posts for ${platform} over the next ${days} days`
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
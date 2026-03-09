import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import OAuth from 'npm:oauth-1.0a@2.2.6';
import crypto from 'node:crypto';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date().toISOString();
    
    // Find all scheduled posts that are due
    const scheduledPosts = await base44.asServiceRole.entities.SocialPost.filter({
      status: 'scheduled'
    });

    // Filter to posts where scheduled_for <= now
    const duePosts = scheduledPosts.filter(post => 
      post.scheduled_for && new Date(post.scheduled_for) <= new Date(now)
    );

    if (duePosts.length === 0) {
      return Response.json({ success: true, message: 'No posts due for publishing', published: 0 });
    }

    // Process max 3 posts per run to avoid timeouts. The automation runs every 5 min so it catches up.
    const batch = duePosts.slice(0, 3);
    const results = [];

    for (const post of batch) {
      let postUrl = null;
      let errorMessage = null;

      try {
        if (post.platform === 'twitter') {
          postUrl = await postToTwitter(post.content);
        } else if (post.platform === 'reddit') {
          postUrl = await postToReddit(post.title, post.content, post.subreddit);
        } else if (post.platform === 'linkedin') {
          postUrl = await postToLinkedIn(base44, post.content);
        } else {
          throw new Error(`Unsupported platform: ${post.platform}`);
        }
      } catch (err) {
        errorMessage = err.message;
      }

      // Update the post
      if (postUrl) {
        await base44.asServiceRole.entities.SocialPost.update(post.id, {
          status: 'published',
          post_url: postUrl,
          published_at: new Date().toISOString()
        });
        results.push({ id: post.id, status: 'published', post_url: postUrl });
      } else {
        await base44.asServiceRole.entities.SocialPost.update(post.id, {
          status: 'failed',
          error_message: errorMessage
        });
        results.push({ id: post.id, status: 'failed', error: errorMessage });
      }
    }

    const published = results.filter(r => r.status === 'published').length;
    const failed = results.filter(r => r.status === 'failed').length;

    return Response.json({ 
      success: true, 
      message: `Processed ${duePosts.length} posts: ${published} published, ${failed} failed`,
      published,
      failed,
      results
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});

async function postToTwitter(content) {
  const oauth = new OAuth({
    consumer: {
      key: Deno.env.get('TWITTER_API_KEY'),
      secret: Deno.env.get('TWITTER_API_SECRET')
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString, key) {
      return crypto.createHmac('sha1', key).update(baseString).digest('base64');
    }
  });

  const token = {
    key: Deno.env.get('TWITTER_ACCESS_TOKEN'),
    secret: Deno.env.get('TWITTER_ACCESS_TOKEN_SECRET')
  };

  const url = 'https://api.twitter.com/2/tweets';
  const requestData = { url, method: 'POST' };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...oauth.toHeader(oauth.authorize(requestData, token)),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: content })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.detail || data.title || JSON.stringify(data));
  }

  return `https://twitter.com/i/web/status/${data.data.id}`;
}

async function postToReddit(title, content, subreddit) {
  const authResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${Deno.env.get('REDDIT_CLIENT_ID')}:${Deno.env.get('REDDIT_CLIENT_SECRET')}`),
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'KodeAgency/1.0'
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: Deno.env.get('REDDIT_USERNAME'),
      password: Deno.env.get('REDDIT_PASSWORD')
    })
  });

  const authData = await authResponse.json();
  if (!authData.access_token) {
    throw new Error('Failed to get Reddit access token: ' + JSON.stringify(authData));
  }

  const submitResponse = await fetch('https://oauth.reddit.com/api/submit', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authData.access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'KodeAgency/1.0'
    },
    body: new URLSearchParams({
      sr: subreddit || 'test',
      kind: 'self',
      title: title || 'Post from Kode Agency',
      text: content
    })
  });

  const submitData = await submitResponse.json();
  
  if (submitData.json?.errors?.length > 0) {
    throw new Error(submitData.json.errors.map(e => e[1]).join(', '));
  }

  return submitData.json?.data?.url || `https://reddit.com/r/${subreddit}`;
}

async function postToLinkedIn(base44, content) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
  
  const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const userInfo = await userInfoResponse.json();
  const personUrn = `urn:li:person:${userInfo.sub}`;

  const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify({
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    })
  });

  const postData = await postResponse.json();
  
  if (!postResponse.ok) {
    throw new Error(postData.message || JSON.stringify(postData));
  }

  const postId = postData.id?.split(':').pop();
  return postId ? `https://www.linkedin.com/feed/update/${postData.id}` : 'https://linkedin.com';
}
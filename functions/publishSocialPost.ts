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
      await base44.asServiceRole.entities.SocialPost.update(post_id, {
        status: 'published',
        post_url: postUrl,
        published_at: new Date().toISOString()
      });
      return Response.json({ success: true, post_url: postUrl });
    } else {
      await base44.asServiceRole.entities.SocialPost.update(post_id, {
        status: 'failed',
        error_message: errorMessage
      });
      return Response.json({ success: false, error: errorMessage }, { status: 500 });
    }
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
  // Get Reddit access token
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

  // Submit the post
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
  
  // Get user info to get the person URN
  const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const userInfo = await userInfoResponse.json();
  const personUrn = `urn:li:person:${userInfo.sub}`;

  // Create the post
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

  // LinkedIn doesn't return a direct URL, construct one from the post ID
  const postId = postData.id?.split(':').pop();
  return postId ? `https://www.linkedin.com/feed/update/${postData.id}` : 'https://linkedin.com';
}
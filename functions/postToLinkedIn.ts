import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { postId } = await req.json();

    // Get the post
    const posts = await base44.entities.LinkedInPost.filter({ id: postId });
    if (!posts.length) {
      return Response.json({ error: 'Post not found' }, { status: 404 });
    }
    const post = posts[0];

    if (post.status === 'posted') {
      return Response.json({ error: 'Already posted' }, { status: 400 });
    }

    // Get LinkedIn access token
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('linkedin');

    // Get user profile to get the person URN
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const profile = await profileRes.json();
    const personUrn = `urn:li:person:${profile.sub}`;

    let postBody;

    if (post.image_url) {
      // Step 1: Register image upload
      const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: personUrn,
            serviceRelationships: [{
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent'
            }]
          }
        })
      });
      const registerData = await registerRes.json();
      
      const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerData.value.asset;

      // Step 2: Upload the image
      const imageRes = await fetch(post.image_url);
      const imageBlob = await imageRes.blob();
      
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'image/png'
        },
        body: imageBlob
      });

      // Step 3: Create post with image
      postBody = {
        author: personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: post.text },
            shareMediaCategory: 'IMAGE',
            media: [{
              status: 'READY',
              media: asset
            }]
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };
    } else {
      // Text-only post
      postBody = {
        author: personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: post.text },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };
    }

    // Create the LinkedIn post
    const linkedInRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postBody)
    });

    if (!linkedInRes.ok) {
      const errorText = await linkedInRes.text();
      await base44.entities.LinkedInPost.update(postId, {
        status: 'failed',
        error_message: errorText
      });
      return Response.json({ error: 'LinkedIn API error', details: errorText }, { status: 500 });
    }

    const linkedInData = await linkedInRes.json();

    // Update post record
    await base44.entities.LinkedInPost.update(postId, {
      status: 'posted',
      posted_at: new Date().toISOString(),
      linkedin_post_id: linkedInData.id
    });

    return Response.json({ success: true, linkedInPostId: linkedInData.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
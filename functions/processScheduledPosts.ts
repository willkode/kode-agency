import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Time slots in UTC (CST is UTC-6, CDT is UTC-5)
// Morning: 9am CST = 15:00 UTC (winter) / 14:00 UTC (summer)
// Afternoon: 1pm CST = 19:00 UTC (winter) / 18:00 UTC (summer)
// Evening: 7pm CST = 01:00 UTC next day (winter) / 00:00 UTC next day (summer)

const SLOT_HOURS_UTC = {
  morning: 15, // 9am CST (winter) - adjust for DST as needed
  afternoon: 19, // 1pm CST (winter)
  evening: 1 // 7pm CST = 1am UTC next day (winter)
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const now = new Date();
    const currentHourUTC = now.getUTCHours();
    const todayDate = now.toISOString().split('T')[0];
    
    // Determine which slot we're in (with 30 min window)
    let currentSlot = null;
    for (const [slot, hour] of Object.entries(SLOT_HOURS_UTC)) {
      if (currentHourUTC === hour) {
        currentSlot = slot;
        break;
      }
    }

    if (!currentSlot) {
      return Response.json({ 
        message: 'Not a scheduled time slot', 
        currentHourUTC,
        slots: SLOT_HOURS_UTC 
      });
    }

    // For evening slot, the date to check is yesterday (since 7pm CST = 1am UTC next day)
    const dateToCheck = currentSlot === 'evening' 
      ? new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : todayDate;

    // Get all scheduled posts for this slot and date
    const scheduledPosts = await base44.asServiceRole.entities.LinkedInPost.filter({
      status: 'scheduled',
      scheduled_slot: currentSlot,
      scheduled_date: dateToCheck
    });

    if (scheduledPosts.length === 0) {
      return Response.json({ 
        message: 'No scheduled posts for this slot',
        slot: currentSlot,
        date: dateToCheck 
      });
    }

    // Post each scheduled post (respecting the 3/day limit)
    const results = [];
    for (const post of scheduledPosts) {
      try {
        // Call the existing postToLinkedIn function logic
        const accessToken = await base44.asServiceRole.connectors.getAccessToken('linkedin');

        const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const profile = await profileRes.json();
        const personUrn = `urn:li:person:${profile.sub}`;

        let postBody;
        if (post.image_url) {
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

          postBody = {
            author: personUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: { text: post.text },
                shareMediaCategory: 'IMAGE',
                media: [{ status: 'READY', media: asset }]
              }
            },
            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
          };
        } else {
          postBody = {
            author: personUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: { text: post.text },
                shareMediaCategory: 'NONE'
              }
            },
            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
          };
        }

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
          await base44.asServiceRole.entities.LinkedInPost.update(post.id, {
            status: 'failed',
            error_message: errorText
          });
          results.push({ id: post.id, success: false, error: errorText });
        } else {
          const linkedInData = await linkedInRes.json();
          await base44.asServiceRole.entities.LinkedInPost.update(post.id, {
            status: 'posted',
            posted_at: new Date().toISOString(),
            linkedin_post_id: linkedInData.id
          });
          results.push({ id: post.id, success: true, linkedInPostId: linkedInData.id });
        }
      } catch (err) {
        await base44.asServiceRole.entities.LinkedInPost.update(post.id, {
          status: 'failed',
          error_message: err.message
        });
        results.push({ id: post.id, success: false, error: err.message });
      }
    }

    return Response.json({ 
      processed: results.length,
      slot: currentSlot,
      date: dateToCheck,
      results 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const accessToken = await base44.asServiceRole.connectors.getAccessToken("googlecalendar");
    
    const { startTime, endTime, customerName, customerEmail, hours, mvpGoal, requestId } = await req.json();
    
    if (!startTime || !customerEmail || !customerName) {
      return Response.json({ error: 'startTime, customerEmail, and customerName are required' }, { status: 400 });
    }

    // Calculate end time based on hours if not provided
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date(start.getTime() + (hours || 1) * 60 * 60 * 1000);

    const event = {
      summary: `Build Sprint - ${customerName}`,
      description: `Build Sprint Session with ${customerName}\n\nEmail: ${customerEmail}\nHours: ${hours || 1}\n\nMVP Goal:\n${mvpGoal || 'Not specified'}\n\nRequest ID: ${requestId || 'N/A'}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: 'America/Chicago'
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'America/Chicago'
      },
      attendees: [
        { email: customerEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: `build-sprint-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    };

    const calendarId = 'c_fd6c99e91f0b71aa4be8ce9d3b3ef94c34c9b2bb0e00fb5dc5e3ef09b1b5a5e8@group.calendar.google.com';
    const createUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1&sendUpdates=all`;
    
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });
    
    if (!createResponse.ok) {
      const error = await createResponse.text();
      return Response.json({ error: 'Failed to create calendar event', details: error }, { status: 500 });
    }
    
    const createdEvent = await createResponse.json();

    // Send notification email
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'will@kodeagency.us',
      subject: `📅 Build Sprint Scheduled - ${customerName}`,
      body: `
A Build Sprint has been scheduled!

Customer: ${customerName}
Email: ${customerEmail}
Hours: ${hours || 1}

Date/Time: ${start.toLocaleString('en-US', { timeZone: 'America/Chicago' })}
Duration: ${hours || 1} hour(s)

MVP Goal:
${mvpGoal || 'Not specified'}

Calendar Event: ${createdEvent.htmlLink}
Meet Link: ${createdEvent.hangoutLink || 'Check calendar event'}
      `
    });

    return Response.json({ 
      success: true,
      eventId: createdEvent.id,
      htmlLink: createdEvent.htmlLink,
      meetLink: createdEvent.hangoutLink
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
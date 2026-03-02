import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const accessToken = await base44.asServiceRole.connectors.getAccessToken("googlecalendar");
    
    const { date, duration = 60 } = await req.json();
    
    if (!date) {
      return Response.json({ error: 'Date is required' }, { status: 400 });
    }

    // Get the start and end of the requested date (in UTC)
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Fetch existing events for that day from the Build Sprints calendar
    const calendarId = 'c_fd6c99e91f0b71aa4be8ce9d3b3ef94c34c9b2bb0e00fb5dc5e3ef09b1b5a5e8@group.calendar.google.com';
    const eventsUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true&orderBy=startTime`;
    
    const eventsResponse = await fetch(eventsUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!eventsResponse.ok) {
      const error = await eventsResponse.text();
      return Response.json({ error: 'Failed to fetch calendar events', details: error }, { status: 500 });
    }
    
    const eventsData = await eventsResponse.json();
    const busySlots = (eventsData.items || []).map(event => ({
      start: new Date(event.start.dateTime || event.start.date).getTime(),
      end: new Date(event.end.dateTime || event.end.date).getTime()
    }));

    // Generate available slots (9 AM - 5 PM CT, which is UTC-6)
    // So 9 AM CT = 15:00 UTC, 5 PM CT = 23:00 UTC
    const slots = [];
    const slotDuration = duration * 60 * 1000; // duration in milliseconds
    
    // Business hours: 9 AM - 5 PM Central Time (UTC-6)
    const businessStartHour = 15; // 9 AM CT in UTC
    const businessEndHour = 23;   // 5 PM CT in UTC
    
    const dayStart = new Date(date);
    dayStart.setUTCHours(businessStartHour, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setUTCHours(businessEndHour, 0, 0, 0);
    
    // Generate 1-hour slots
    let currentSlot = dayStart.getTime();
    while (currentSlot + slotDuration <= dayEnd.getTime()) {
      const slotEnd = currentSlot + slotDuration;
      
      // Check if slot conflicts with any busy time
      const isAvailable = !busySlots.some(busy => 
        (currentSlot >= busy.start && currentSlot < busy.end) ||
        (slotEnd > busy.start && slotEnd <= busy.end) ||
        (currentSlot <= busy.start && slotEnd >= busy.end)
      );
      
      // Only add future slots
      if (isAvailable && currentSlot > Date.now()) {
        slots.push({
          start: new Date(currentSlot).toISOString(),
          end: new Date(slotEnd).toISOString(),
          displayTime: new Date(currentSlot).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            timeZone: 'America/Chicago'
          })
        });
      }
      
      currentSlot += 60 * 60 * 1000; // Move to next hour
    }

    return Response.json({ slots });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
// Vercel Serverless Function - api/events.js
// Fetches real events from Eventbrite API

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { lat, lng, radiusKm = 50 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing lat/lng parameters' });
  }

  const apiKey = process.env.EVENTBRITE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Eventbrite API key not configured' });
  }

  try {
    const url = new URL('https://www.eventbriteapi.com/v3/events/search/');
    url.searchParams.set('location.latitude', lat);
    url.searchParams.set('location.longitude', lng);
    url.searchParams.set('location.within', `${Math.min(radiusKm, 150)}km`);
    url.searchParams.set('start_date.range_start', new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'));
    url.searchParams.set('expand', 'venue');
    url.searchParams.set('page_size', '50');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Eventbrite API error: ${response.status}` });
    }

    const json = await response.json();
    const events = (json.events || []).map(evt => {
      const venueLat = evt.venue?.latitude ? parseFloat(evt.venue.latitude) : null;
      const venueLng = evt.venue?.longitude ? parseFloat(evt.venue.longitude) : null;
      if (!venueLat || !venueLng || isNaN(venueLat) || isNaN(venueLng)) return null;

      return {
        id: evt.id,
        name: evt.name?.text || 'Event',
        category: evt.category?.name || 'Event',
        description: evt.description?.text?.slice(0, 200) || 'No description available',
        venueAddress: evt.venue?.address?.localized_address_display || '',
        url: evt.url || '',
        lat: venueLat,
        lng: venueLng,
        start: evt.start?.utc || '',
        end: evt.end?.utc || evt.start?.utc || '',
      };
    }).filter(Boolean);

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

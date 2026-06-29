// Vercel Serverless Function - api/events.js
// Fetches real events from SeatGeek API

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { lat, lng, radiusKm = 50 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing lat/lng parameters' });
  }

  const clientId = process.env.SEATGEEK_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({ error: 'SeatGeek client ID not configured' });
  }

  try {
    // SeatGeek uses miles for range
    const radiusMi = Math.round(Math.min(radiusKm, 150) * 0.621371);

    const url = new URL('https://api.seatgeek.com/2/events');
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lng);
    url.searchParams.set('range', `${radiusMi}mi`);
    url.searchParams.set('per_page', '50');
    url.searchParams.set('client_id', clientId);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return res.status(502).json({ error: `SeatGeek API error: ${response.status}` });
    }

    const data = await response.json();
    const events = (data.events || []).map(evt => {
      const evtLat = evt.venue?.location?.lat;
      const evtLng = evt.venue?.location?.lon;
      if (!evtLat || !evtLng) return null;

      return {
        id: String(evt.id),
        name: evt.title || evt.short_title || 'Event',
        category: evt.type || evt.taxonomies?.[0]?.name || 'Event',
        description: evt.venue?.name ? `at ${evt.venue.name}` : 'No description available',
        venueAddress: [evt.venue?.address, evt.venue?.city].filter(Boolean).join(', '),
        url: evt.url || '',
        lat: evtLat,
        lng: evtLng,
        start: evt.datetime_utc ? evt.datetime_utc.replace(' ', 'T') + 'Z' : '',
        end: evt.datetime_utc ? evt.datetime_utc.replace(' ', 'T') + 'Z' : '',
      };
    }).filter(Boolean);

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

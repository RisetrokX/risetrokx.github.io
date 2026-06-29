// Vercel Serverless Function - Save as api/events.js
// This runs on Vercel and fetches real events from Ticketmaster

export default async function handler(req, res) {
  const { lat, lng, radiusKm = 50 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing lat/lng parameters' });
  }

  try {
    // Call Ticketmaster API (free, public)
    // Note: Demo key is rate-limited. Get your own free key at:
    // https://developer.ticketmaster.com/
    const TICKETMASTER_KEY = process.env.TICKETMASTER_API_KEY || 'DEMO_KEY_ADD_YOUR_OWN';
    
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events');
    url.searchParams.set('latlong', `${lat},${lng}`);
    url.searchParams.set('radius', Math.min(radiusKm, 100)); // Ticketmaster max 100km
    url.searchParams.set('unit', 'km');
    url.searchParams.set('size', '50');
    url.searchParams.set('apikey', TICKETMASTER_KEY);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('Ticketmaster API error:', response.status);
      return res.status(500).json({ events: [], error: 'Ticketmaster API unavailable' });
    }

    const data = await response.json();
    const events = (data._embedded?.events || []).map(evt => ({
      name: evt.name,
      category: evt.classifications?.[0]?.segment?.name || 'Events',
      description: evt.info || evt.description || 'No description available',
      lat: evt._embedded?.venues?.[0]?.location?.latitude || lat,
      lng: evt._embedded?.venues?.[0]?.location?.longitude || lng,
      start: evt.dates?.start?.dateTime || evt.dates?.start?.localDate + 'T00:00:00',
      end: evt.dates?.end?.dateTime || evt.dates?.end?.localDate + 'T23:59:59',
      url: evt.url,
    }));

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ events: [], error: error.message });
  }
}

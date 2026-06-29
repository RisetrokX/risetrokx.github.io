// Vercel Serverless Function - api/events.js
// Fetches real events from PredictHQ API

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { lat, lng, radiusKm = 50 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing lat/lng parameters' });
  }

  // Use env variable or fall back to built-in key
  const apiKey = process.env.PREDICTHQ_API_KEY || 'G_rVQYSQojgl2YYTddJl-CMj89JjvmaN1tbZOeaS';

  try {
    const now = new Date().toISOString().slice(0, 10);
    const phqUrl = new URL('https://api.predicthq.com/v1/events/');
    phqUrl.searchParams.set('within', `${Math.min(radiusKm, 150)}km@${lat},${lng}`);
    phqUrl.searchParams.set('active.gte', now);
    phqUrl.searchParams.set('sort', 'start');
    phqUrl.searchParams.set('limit', '50');
    phqUrl.searchParams.set('category', 'concerts,sports,community,expos,festivals,performing-arts');

    const response = await fetch(phqUrl.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: `PredictHQ API error: ${response.status}` });
    }

    const json = await response.json();
    const events = (json.results || []).map(item => {
      const location = Array.isArray(item.location) && item.location.length === 2 ? item.location : null;
      const evtLat = location ? parseFloat(location[1]) : null;
      const evtLng = location ? parseFloat(location[0]) : null;
      if (!evtLat || !evtLng || isNaN(evtLat) || isNaN(evtLng)) return null;

      return {
        id: item.id || `${item.title}|${item.start}|${evtLat}|${evtLng}`,
        name: item.title || 'Event',
        category: item.category || item.labels?.[0] || 'Event',
        description: item.description || 'Live event nearby',
        venueAddress: item.geo?.address?.formatted_address || '',
        url: item.url || '',
        lat: evtLat,
        lng: evtLng,
        start: item.start || '',
        end: item.end || item.start || '',
      };
    }).filter(Boolean);

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

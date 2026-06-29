# Events Near Me

A real-time event discovery app that shows nearby events on an interactive map. Search for events by location, filter by status (live/future), and customize your search radius and time window.

## Features

- 🗺️ Interactive Leaflet map with event markers
- 📍 Location detection (GPS/IP/search)
- 🔍 Search by city or address
- ⏱️ Customizable search radius (1-150 km) and time window
- 🏷️ Filter events by status (All/Live/Future)
- 📱 Mobile-first responsive design
- 🌙 Dark theme with glass-morphism UI

## Usage

1. **Search your city** in the search box (recommended for mobile)
2. Or tap **"My location"** to use GPS/IP location (works best on desktop or HTTPS)
3. **Adjust radius** and **end time** to customize your search
4. **Tap filter buttons** to show All/Live/Future events
5. **Click event markers** or cards to see full details with location link

## Deployment

This is a static site. Deploy to GitHub Pages:

1. Create a repository named `risetrokx.github.io`
2. Push this code to the repository
3. Your site will be live at `https://risetrokx.github.io`

### Local Development

Open `index.html` in a browser, or serve locally:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## API

The app fetches events from `/api/events` or uses sample data. To use live data, set up a backend that returns:

```json
{
  "events": [
    {
      "name": "Event Title",
      "category": "Live music",
      "description": "Event description...",
      "lat": 52.23,
      "lng": 21.01,
      "start": "2026-06-29T19:00:00",
      "end": "2026-06-29T23:00:00",
      "url": "https://example.com/event"
    }
  ]
}
```

## Browser Support

Works on:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies

- HTML5, CSS3, Vanilla JavaScript
- [Leaflet.js](https://leafletjs.com/) — mapping
- [ipapi.co](https://ipapi.co/) — IP geolocation fallback
- Browser Geolocation API — GPS

## Notes

- GPS location detection works best on HTTPS or localhost
- On HTTP, the app falls back to IP-based location (city-level accuracy)
- Cached locations are stored in browser localStorage (max 6 hours old)
- Sample event data is hardcoded for demo purposes

---

Made with ❤️ for event discovery

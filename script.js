let events = [];
const defaultLocation = { lat: 0, lng: 0 };
let radiusKm = 30;
const eventList = document.getElementById('eventList');
const countEvents = document.getElementById('countEvents');
const countLive = document.getElementById('countLive');
const countFuture = document.getElementById('countFuture');
const locationStatus = document.getElementById('locationStatus');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const radiusKmInput = document.getElementById('radiusKmInput');

let statusHideTimer = null;
function showStatus(msg, { persist = false } = {}) {
  if (!locationStatus) return;
  clearTimeout(statusHideTimer);
  locationStatus.textContent = msg;
  locationStatus.style.opacity = '1';
  if (!persist) {
    statusHideTimer = setTimeout(() => {
      locationStatus.style.opacity = '0';
    }, 3000);
  }
}
const endDateInput = document.getElementById('endDateInput');
const filterButtons = document.querySelectorAll('.bottom-filter');

let activeFilter = 'all';

const sampleCities = [
  {
    name: 'Warsaw',
    lat: 52.2297,
    lng: 21.0122,
    events: [
      {
        name: 'Moonlit Jazz Market',
        category: 'Live music',
        description: 'A riverside jazz pop-up with art stalls, cocktails, and late-night grooves.',
        lat: 52.2280,
        lng: 21.0140,
        start: '2026-06-29T19:00:00',
        end: '2026-06-29T23:30:00'
      },
      {
        name: 'Street Food Festival',
        category: 'Food & drink',
        description: 'Sample flavors from local kitchens under lantern-lit tents.',
        lat: 52.2370,
        lng: 21.0175,
        start: '2026-06-30T12:00:00',
        end: '2026-06-30T20:00:00'
      },
      {
        name: 'Gallery After Dark',
        category: 'Art',
        description: 'An immersive exhibition with projected paintings and live visuals.',
        lat: 52.2354,
        lng: 21.0094,
        start: '2026-06-29T21:00:00',
        end: '2026-06-30T01:00:00'
      }
    ]
  },
  {
    name: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    events: [
      {
        name: 'Brooklyn Summer Jam',
        category: 'Music',
        description: 'Live bands, food trucks, and summer cocktails under the Brooklyn Bridge.',
        lat: 40.7061,
        lng: -73.9969,
        start: '2026-06-29T18:00:00',
        end: '2026-06-29T23:00:00'
      },
      {
        name: 'Central Park Jazz Afternoon',
        category: 'Live music',
        description: 'Free jazz sets and picnic seating in the park.',
        lat: 40.7812,
        lng: -73.9665,
        start: '2026-06-30T14:00:00',
        end: '2026-06-30T17:00:00'
      }
    ]
  },
  {
    name: 'London',
    lat: 51.5074,
    lng: -0.1278,
    events: [
      {
        name: 'Southbank Street Food Market',
        category: 'Food & drink',
        description: 'International street food with live DJ sets on the Thames.',
        lat: 51.5055,
        lng: -0.1157,
        start: '2026-06-29T17:00:00',
        end: '2026-06-29T22:00:00'
      },
      {
        name: 'West End Theater Showcase',
        category: 'Theater',
        description: 'A curated evening of musical theater previews.',
        lat: 51.5128,
        lng: -0.1125,
        start: '2026-06-30T19:30:00',
        end: '2026-06-30T22:30:00'
      }
    ]
  },
  {
    name: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    events: [
      {
        name: 'Rive Gauche Night Market',
        category: 'Food & drink',
        description: 'Parisian street food, live performers, and craft stalls.',
        lat: 48.8529,
        lng: 2.3499,
        start: '2026-06-29T18:00:00',
        end: '2026-06-29T23:00:00'
      },
      {
        name: 'Louvre After Hours Tour',
        category: 'Art',
        description: 'A curated evening tour of the Louvre with live piano.',
        lat: 48.8606,
        lng: 2.3376,
        start: '2026-06-30T20:00:00',
        end: '2026-06-30T22:30:00'
      }
    ]
  },
  {
    name: 'Sydney',
    lat: -33.8688,
    lng: 151.2093,
    events: [
      {
        name: 'Harborfront Food Fest',
        category: 'Food & drink',
        description: 'Beachside food trucks, local brews, and sunset concerts.',
        lat: -33.8650,
        lng: 151.2094,
        start: '2026-06-29T16:00:00',
        end: '2026-06-29T21:00:00'
      },
      {
        name: 'Opera House Lights',
        category: 'Culture',
        description: 'Outdoor projection show at the Sydney Opera House.',
        lat: -33.8568,
        lng: 151.2153,
        start: '2026-06-30T19:00:00',
        end: '2026-06-30T20:30:00'
      }
    ]
  },
  {
    name: 'Tokyo',
    lat: 35.6895,
    lng: 139.6917,
    events: [
      {
        name: 'Shibuya Night Market',
        category: 'Food & drink',
        description: 'Ramen stalls, neon lights, and live street performances.',
        lat: 35.6580,
        lng: 139.7016,
        start: '2026-06-29T18:00:00',
        end: '2026-06-29T23:00:00'
      },
      {
        name: 'Ueno Summer Jazz',
        category: 'Live music',
        description: 'Outdoor jazz sets in the park with chilled cocktails.',
        lat: 35.7138,
        lng: 139.7745,
        start: '2026-06-30T15:00:00',
        end: '2026-06-30T18:00:00'
      }
    ]
  },
  {
    name: 'Berlin',
    lat: 52.5200,
    lng: 13.4050,
    events: [
      {
        name: 'Friedrichshain Music Crawl',
        category: 'Music',
        description: 'A row of pop-up stages and DJs across the neighborhood.',
        lat: 52.5155,
        lng: 13.4545,
        start: '2026-06-29T19:00:00',
        end: '2026-06-30T02:00:00'
      },
      {
        name: 'Tech Startup Meetup',
        category: 'Community',
        description: 'Founders share growth stories over coffee and snacks.',
        lat: 52.5206,
        lng: 13.3862,
        start: '2026-06-30T17:30:00',
        end: '2026-06-30T20:00:00'
      }
    ]
  },
  {
    name: 'Toronto',
    lat: 43.6532,
    lng: -79.3832,
    events: [
      {
        name: 'Harbourfront Live Sessions',
        category: 'Music',
        description: 'Open-air performances with waterfront views.',
        lat: 43.6405,
        lng: -79.3817,
        start: '2026-06-29T18:30:00',
        end: '2026-06-29T22:30:00'
      },
      {
        name: 'Distillery District Art Walk',
        category: 'Art',
        description: 'Gallery showcases and live painting in the historic district.',
        lat: 43.6503,
        lng: -79.3590,
        start: '2026-06-30T16:00:00',
        end: '2026-06-30T20:00:00'
      }
    ]
  }
];

let map = null;
let userMarker = null;
const markers = [];

function createMap() {
  if (typeof L === 'undefined') {
    showStatus('Map library failed to load. Check your internet connection or browser security settings.', { persist: true });
    return;
  }

  if (map) {
    return;
  }

  map = L.map('map', { zoomControl: true, scrollWheelZoom: true }).setView([20, 10], 2);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  userMarker = L.circleMarker([0, 0], {
    radius: 11,
    fillColor: '#57d3ff',
    color: '#90f0ff',
    weight: 2,
    fillOpacity: 0.92,
  }).addTo(map).bindPopup('Your location');
}

function parseEvent(evt) {
  return {
    ...evt,
    startDate: new Date(evt.start),
    endDate: new Date(evt.end),
  };
}

function getCategoryColor(category) {
  const c = (category || '').toLowerCase();
  if (c.includes('concert') || c.includes('music')) return '#f97316';
  if (c.includes('sport')) return '#22c55e';
  if (c.includes('festival')) return '#f472b6';
  if (c.includes('performing') || c.includes('theatre') || c.includes('theater')) return '#2dd4bf';
  if (c.includes('community')) return '#a78bfa';
  if (c.includes('conference') || c.includes('expo')) return '#60a5fa';
  if (c.includes('food') || c.includes('drink')) return '#fb923c';
  if (c.includes('art')) return '#e879f9';
  if (c.includes('wellness') || c.includes('health')) return '#34d399';
  return '#7f88ff';
}

function createPinIcon(color, shouldPulse) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 24 14 24s14-14.667 14-24C28 6.268 21.732 0 14 0z" fill="${color}"/><circle cx="14" cy="14" r="6" fill="rgba(255,255,255,0.9)"/></svg>`;
  return L.divIcon({
    className: 'pin-marker',
    html: shouldPulse
      ? `<div class="pin-wrap pin-bounce"><div class="pin-ring" style="background:${color}"></div>${svg}</div>`
      : `<div class="pin-wrap">${svg}</div>`,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -42]
  });
}

function dedupeEvents(eventArray) {
  const seen = new Set();
  return eventArray.filter(evt => {
    const normalizedName = (evt.name || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedStart = evt.start ? new Date(evt.start).toISOString().slice(0, 16) : '';
    const normalizedEnd = evt.end ? new Date(evt.end).toISOString().slice(0, 16) : '';
    const normalizedUrl = (evt.url || '').trim().toLowerCase();
    const normalizedCategory = (evt.category || '').trim().toLowerCase();
    const normalizedVenue = (evt.venueName || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedAddress = (evt.venueAddress || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedDescription = (evt.description || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedLat = typeof evt.lat === 'number' ? evt.lat.toFixed(4) : String(evt.lat);
    const normalizedLng = typeof evt.lng === 'number' ? evt.lng.toFixed(4) : String(evt.lng);
    const key = `${normalizedName}|${normalizedUrl}|${normalizedStart}|${normalizedEnd}|${normalizedCategory}|${normalizedLat}|${normalizedLng}|${normalizedVenue}|${normalizedAddress}|${normalizedDescription}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function isOngoing(evt, now) {
  return evt.startDate <= now && now <= evt.endDate;
}

function isUpcoming(evt, now) {
  return now < evt.startDate;
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = degrees => degrees * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateTimeNoYear(date) {
  return date.toLocaleString([], {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatForDateTimeInput(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getWindowEndDate(now = new Date()) {
  if (!endDateInput || !endDateInput.value) {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  const parsed = new Date(endDateInput.value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }

  return parsed;
}

function ensureDetailsModal() {
  let modal = document.getElementById('eventDetailsModal');
  if (modal) {
    return modal;
  }

  modal = document.createElement('div');
  modal.id = 'eventDetailsModal';
  modal.className = 'event-details-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="event-details-backdrop" data-close-details="true"></div>
    <div class="event-details-panel" role="dialog" aria-modal="true" aria-label="Event details">
      <button class="event-details-close" data-close-details="true" aria-label="Close details">×</button>
      <h3 class="event-details-title" id="eventDetailsTitle"></h3>
      <p class="event-details-meta" id="eventDetailsMeta"></p>
      <p class="event-details-location" id="eventDetailsLocation"></p>
      <p class="event-details-description" id="eventDetailsDescription"></p>
      <div class="event-details-actions">
        <a id="eventDetailsNavigate" class="action action-nav" target="_blank" rel="noopener noreferrer">Navigate</a>
        <a id="eventDetailsSource" class="action action-details-link" target="_blank" rel="noopener noreferrer">Event page</a>
      </div>
    </div>
  `;

  modal.addEventListener('click', (e) => {
    if (e.target && e.target.dataset && e.target.dataset.closeDetails === 'true') {
      closeEventDetails();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeEventDetails();
    }
  });

  document.body.appendChild(modal);
  return modal;
}

function openEventDetails(evt) {
  const modal = ensureDetailsModal();
  const title = modal.querySelector('#eventDetailsTitle');
  const meta = modal.querySelector('#eventDetailsMeta');
  const location = modal.querySelector('#eventDetailsLocation');
  const description = modal.querySelector('#eventDetailsDescription');
  const navigate = modal.querySelector('#eventDetailsNavigate');
  const source = modal.querySelector('#eventDetailsSource');

  const whenText = `${formatDateTimeNoYear(evt.startDate)} - ${formatDateTimeNoYear(evt.endDate)}`;
  const distanceText = typeof evt.distance === 'number' ? `${evt.distance.toFixed(1)} km away` : '';
  const venueBits = [evt.venueName, evt.venueAddress].filter(Boolean);
  const navLabel = encodeURIComponent(evt.name || 'Event');
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${evt.lat},${evt.lng}&destination_place_name=${navLabel}&travelmode=walking`;

  title.textContent = evt.name || 'Event details';
  meta.textContent = [evt.category, whenText, distanceText].filter(Boolean).join(' • ');
  location.textContent = venueBits.length ? venueBits.join(' • ') : `${evt.lat.toFixed(5)}, ${evt.lng.toFixed(5)}`;
  description.textContent = evt.description || 'No additional description available.';

  navigate.href = navUrl;
  if (evt.url) {
    source.href = evt.url;
    source.textContent = 'Event page';
  } else {
    const searchQuery = encodeURIComponent(`${evt.name || 'Event'} ${evt.venueName || ''} ${evt.venueAddress || ''}`.trim());
    source.href = `https://www.google.com/search?q=${searchQuery}`;
    source.textContent = 'Search event';
  }
  source.style.display = 'inline-flex';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeEventDetails() {
  const modal = document.getElementById('eventDetailsModal');
  if (!modal) {
    return;
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

async function loadFallbackEvents(location = defaultLocation) {
  const nearestCity = sampleCities.reduce((best, city) => {
    const distance = getDistanceKm(location.lat, location.lng, city.lat, city.lng);
    if (!best || distance < best.distance) {
      return { city, distance };
    }
    return best;
  }, null);

  if (nearestCity && nearestCity.distance <= 250) {
    events = nearestCity.city.events.map(evt => ({
      ...evt,
      start: evt.start,
      end: evt.end
    }));
    showStatus(`Using sample events near ${nearestCity.city.name}`);
  } else {
    events = sampleCities.flatMap(city => city.events);
    showStatus('Using global sample events for demo mode');
  }
}



async function fetchEventsForLocation(location) {
  try {
    // Call Vercel backend API directly (it's already deployed and working!)
    const vercelUrl = 'https://risetrokx-github-io.vercel.app/api/events';
    
    const url = new URL(vercelUrl);
    url.searchParams.set('lat', location.lat);
    url.searchParams.set('lng', location.lng);
    url.searchParams.set('radiusKm', radiusKm);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }

    const apiEvents = await response.json();

    if (!Array.isArray(apiEvents) || apiEvents.length === 0) {
      throw new Error('No events found in this area');
    }
    
    events = dedupeEvents(apiEvents);
    showStatus(`Loaded ${apiEvents.length} events nearby`);
  } catch (error) {
    showStatus('No live events available; showing demo events');
    await loadFallbackEvents(location);
  }
}

async function searchLocation(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'EventMapApp/1.0'
    }
  });
  if (!response.ok) {
    throw new Error('Search service unavailable');
  }
  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error('No matches found');
  }
  return {
    lat: parseFloat(results[0].lat),
    lng: parseFloat(results[0].lon),
    source: 'search'
  };
}

function buildAndroidEventWidget(eventsData) {
  return {
    generatedAt: new Date().toISOString(),
    location: currentLocation || defaultLocation,
    count: eventsData.length,
    events: eventsData.map(evt => ({
      title: evt.name,
      category: evt.category,
      description: evt.description,
      start: evt.start,
      end: evt.end,
      distance: `${evt.distance.toFixed(1)} km`,
      lat: evt.lat,
      lng: evt.lng
    }))
  };
}

window.buildAndroidEventWidget = buildAndroidEventWidget;

function updateEvents(userLocation) {
  if (!map) {
    createMap();
  }

  const now = new Date();
  const enriched = dedupeEvents(events).map(parseEvent).map(evt => {
    const distance = getDistanceKm(userLocation.lat, userLocation.lng, evt.lat, evt.lng);
    return { ...evt, distance, isLive: isOngoing(evt, now), isFuture: isUpcoming(evt, now) };
  }).sort((a, b) => {
    if (a.isLive !== b.isLive) return a.isLive ? -1 : 1;
    return a.startDate - b.startDate;
  });

  const timeWindowCutoff = getWindowEndDate(now);
  const nearbyEvents = enriched.filter(evt => {
    if (evt.distance > radiusKm) return false;
    return evt.isLive || (evt.startDate > now && evt.startDate <= timeWindowCutoff);
  });
  const visibleEvents = nearbyEvents.filter(evt => {
    if (activeFilter === 'live') return evt.isLive;
    if (activeFilter === 'future') return evt.isFuture;
    return true;
  });
  // do NOT fall back to global events — keep list empty and show a proper message

  if (countEvents) countEvents.textContent = visibleEvents.length;
  if (countLive) countLive.textContent = visibleEvents.filter(evt => evt.isLive).length;
  if (countFuture) countFuture.textContent = visibleEvents.filter(evt => evt.isFuture).length;
  if (eventList) eventList.innerHTML = '';

  if (map) {
    markers.forEach(marker => map.removeLayer(marker));
  }
  markers.length = 0;

  visibleEvents.forEach(evt => {
    const color = getCategoryColor(evt.category);
    const isSoon = !evt.isLive && evt.isFuture && (evt.startDate.getTime() - now.getTime()) < 3 * 60 * 60 * 1000;
    const shouldPulse = evt.isLive || isSoon;
    let marker = null;
    if (map) {
      const label = encodeURIComponent(evt.name);
      const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${evt.lat},${evt.lng}&destination_place_name=${label}&travelmode=walking`;
      marker = L.marker([evt.lat, evt.lng], {
        icon: createPinIcon(color, shouldPulse)
      }).addTo(map);
      const popupContent = document.createElement('div');
      popupContent.className = 'event-popup';
      popupContent.innerHTML = `
        <strong class="event-popup-title">${evt.name}</strong>
        <span class="event-popup-meta">${evt.category} · ${formatDateTimeNoYear(evt.startDate)} - ${formatDateTimeNoYear(evt.endDate)}</span>
        <div class="event-popup-actions">
          <a href="${navUrl}" target="_blank" rel="noopener noreferrer" class="event-popup-nav">Navigate</a>
          <button type="button" class="popup-details-btn event-popup-details">Details</button>
        </div>
      `;
      popupContent.querySelector('.popup-details-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openEventDetails(evt);
      });
      marker.bindPopup(popupContent, { maxWidth: 320, minWidth: 220, autoPanPadding: [16, 16] });
      markers.push(marker);
    }

    if (eventList) {
      const card = document.createElement('article');
      card.className = 'event-card';
      card.innerHTML = `
        <div class="event-card-stripe" style="background:${color}"></div>
        <div class="event-top">
          <h3 class="event-title">${evt.name}</h3>
          <span class="tag" style="background:${color}22;color:${color};border:1px solid ${color}44">${evt.category}</span>
        </div>
        <div class="event-meta">
          <span>${formatDateTimeNoYear(evt.startDate)} — ${formatDateTimeNoYear(evt.endDate)}</span>
          <span>${evt.distance.toFixed(1)} km away</span>
        </div>
        <p class="event-desc">${evt.description}</p>
        <div class="event-footer">
          <span class="tag ${evt.isLive ? 'live' : isSoon ? 'soon' : 'future'}">${evt.isLive ? '● Live now' : isSoon ? '⚡ Soon' : 'Upcoming'}</span>
          <div class="footer-actions">
            <button class="action action-nav">Navigate</button>
            <button class="action action-details">Details</button>
            <button class="action action-map">Show on map</button>
          </div>
        </div>
      `;

      card.querySelector('.action-nav').addEventListener('click', (e) => {
        e.stopPropagation();
        const label = encodeURIComponent(evt.name);
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${evt.lat},${evt.lng}&destination_place_name=${label}&travelmode=walking`, '_blank');
      });

      card.querySelector('.action-details').addEventListener('click', (e) => {
        e.stopPropagation();
        openEventDetails(evt);
      });

      card.querySelector('.action-map').addEventListener('click', () => {
        if (map && marker) {
          map.flyTo([evt.lat, evt.lng], 15, { duration: 1.2 });
          marker.openPopup();
        }
      });

      eventList.appendChild(card);
    }
  });

  // Keep the map centered on the selected user/search location instead of auto-fitting all events.

  if (eventList && !visibleEvents.length) {
    const filterLabel = activeFilter === 'all' ? '' : ` for ${activeFilter} events`;
    eventList.innerHTML = `<p class="empty-state">No events found until ${formatDateTimeNoYear(timeWindowCutoff)} within ${radiusKm} km${filterLabel}. Try another filter or adjust your settings.</p>`;
  }
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number.parseFloat(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

function applyCustomizationAndRefresh() {
  if (radiusKmInput) {
    radiusKm = clampNumber(radiusKmInput.value, 1, 150, 30);
    radiusKmInput.value = String(Math.round(radiusKm));
  }
  if (endDateInput) {
    const parsed = new Date(endDateInput.value);
    if (Number.isNaN(parsed.getTime())) {
      const fallback = new Date(Date.now() + 24 * 60 * 60 * 1000);
      endDateInput.value = formatForDateTimeInput(fallback);
    }
  }

  if (currentLocation) {
    updateEvents(currentLocation);
  }
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  updateEvents(currentLocation || defaultLocation);
}

let currentLocation = null;

function supportsLocation() {
  return 'geolocation' in navigator;
}

function savePreciseLocation(lat, lng, accuracy) {
  if (!Number.isFinite(accuracy) || accuracy > 600) {
    return;
  }
  try {
    localStorage.setItem('LAST_PRECISE_LOCATION', JSON.stringify({ lat, lng, accuracy, ts: Date.now() }));
  } catch {}
}

function getCachedPreciseLocation(maxAgeHours = 6) {
  try {
    const raw = localStorage.getItem('LAST_PRECISE_LOCATION');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.lat !== 'number' || typeof parsed.lng !== 'number' || typeof parsed.ts !== 'number') {
      return null;
    }
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
    if (Date.now() - parsed.ts > maxAgeMs) {
      return null;
    }
    return { lat: parsed.lat, lng: parsed.lng, source: 'cached' };
  } catch {
    return null;
  }
}

function fetchIpLocation() {
  // Try multiple IP geolocation services for better mobile compatibility
  const services = [
    () => fetch('https://ipapi.co/json/').then(r => r.ok ? r.json() : null).then(d => d && d.latitude && d.longitude ? { lat: d.latitude, lng: d.longitude } : null),
    () => fetch('https://ip-api.com/json/').then(r => r.ok ? r.json() : null).then(d => d && d.status === 'success' ? { lat: d.lat, lng: d.lon } : null),
    () => fetch('https://geolocation-db.com/json/geoip/me').then(r => r.ok ? r.json() : null).then(d => d && d.latitude && d.longitude ? { lat: d.latitude, lng: d.longitude } : null),
  ];

  return services.reduce((promise, service) => {
    return promise.then(result => result ? result : service().catch(() => null));
  }, Promise.resolve(null));
}

function getGeoPosition(options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

async function getBestGeoPosition() {
  // On mobile, enableHighAccuracy often requires HTTPS. Use fast attempts first.
  const fastAttempt = getGeoPosition({ enableHighAccuracy: false, timeout: 15000, maximumAge: 0 }).catch(() => null);
  
  // Only try high accuracy if fast succeeded or on desktop
  const preciseAttempt = fastAttempt.then(result => {
    if (result) return result; // If fast worked, skip precise
    return getGeoPosition({ enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }).catch(() => null);
  });

  const precise = await preciseAttempt;
  if (precise) return precise;

  throw new Error('No location fix available');
}

async function locateUser({ allowApproximate = true, allowCached = false } = {}) {
  if (supportsLocation()) {
    try {
      const position = await getBestGeoPosition();
      const precise = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        source: 'device'
      };
      savePreciseLocation(precise.lat, precise.lng, precise.accuracy);
      return precise;
    } catch (error) {
      if (allowApproximate) {
        const ipLocation = await fetchIpLocation();
        if (ipLocation) {
          return { ...ipLocation, accuracy: 3000, source: 'ip' };
        }
      }
      if (allowCached) {
        const cachedLocation = getCachedPreciseLocation();
        if (cachedLocation) {
          return cachedLocation;
        }
      }
      throw error;
    }
  }

  if (allowCached) {
    const cachedLocation = getCachedPreciseLocation();
    if (cachedLocation) {
      return cachedLocation;
    }
  }

  if (allowApproximate) {
    const ipLocation = await fetchIpLocation();
    if (ipLocation) {
      return { ...ipLocation, accuracy: 3000, source: 'ip' };
    }
  }
  return { ...defaultLocation, source: 'default' };
}

async function setMapLocation(location, source) {
  currentLocation = location;

  if (map) {
    userMarker.setLatLng(location);
    map.setView([location.lat, location.lng], 13);
    map.invalidateSize();
  }

  if (source === 'device') {
    const accuracyMeters = Number.isFinite(location.accuracy) ? Math.round(location.accuracy) : null;
    showStatus(accuracyMeters ? `GPS fix (±${accuracyMeters} m)` : 'Located successfully (GPS)');
  } else if (source === 'cached') {
    showStatus('Using cached location');
  } else if (source === 'ip') {
    showStatus('Using IP location (city-level approx)');
  } else if (source === 'search') {
    showStatus('Location from search');
  } else {
    showStatus('Map ready');
  }

  await fetchEventsForLocation(location);
  updateEvents(location);
}

function getLocationFailureMessage(error) {
  if (!error) return 'Unable to determine location. Showing default city view.';
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location denied. Allow location access in your browser settings.';
    case error.POSITION_UNAVAILABLE:
      return 'Location unavailable. Showing default city view.';
    case error.TIMEOUT:
      return 'Location request timed out. Showing default city view.';
    default:
      return error.message || 'Unable to determine location. Showing default city view.';
  }
}

refreshBtn.addEventListener('click', async () => {
  showStatus('Finding your location…', { persist: true });
  try {
    const location = await locateUser({ allowApproximate: true, allowCached: false });
    await setMapLocation(location, location.source);
  } catch (error) {
        showStatus('Location unavailable. Check GPS permission or search your city.', { persist: true });
    await setMapLocation(defaultLocation, 'default');
  }
});

async function searchForLocation() {
  const query = searchInput.value.trim();
  if (!query) {
    showStatus('Enter a city or address to search.');
    return;
  }

  showStatus('Searching address…', { persist: true });
  try {
    const location = await searchLocation(query);
    await setMapLocation(location, location.source);
  } catch (error) {
    showStatus(error.message || 'Search failed', { persist: true });
  }
}

searchBtn.addEventListener('click', searchForLocation);
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    searchForLocation();
  }
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

if (radiusKmInput) {
  radiusKmInput.addEventListener('change', applyCustomizationAndRefresh);
}

if (endDateInput) {
  if (!endDateInput.value) {
    endDateInput.value = formatForDateTimeInput(new Date(Date.now() + 24 * 60 * 60 * 1000));
  }
  endDateInput.addEventListener('change', applyCustomizationAndRefresh);
}

async function initApp() {
  createMap();

  document.getElementById('locateMeBtn').addEventListener('click', () => {
    showStatus('Requesting location (may take 20 sec)…', { persist: true });
    locateUser({ allowApproximate: true, allowCached: true })
      .then(location => setMapLocation(location, location.source))
      .catch(async (error) => {
        showStatus('GPS not available on HTTP. Search your city above instead.', { persist: true });
        if (currentLocation && map) {
          map.flyTo([currentLocation.lat, currentLocation.lng], 14, { duration: 1.2 });
        }
      });
  });

  try {
    const location = await locateUser({ allowApproximate: true, allowCached: true });
    await setMapLocation(location, location.source);
  } catch (error) {
    showStatus('Search your city to get started');
  }
}

initApp();

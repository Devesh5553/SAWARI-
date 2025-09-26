import React, { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import allRoutes from '../config/allRoutes';

// Lightweight Leaflet loader via CDN to avoid adding npm deps
function ensureLeafletLoaded() {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    // Inject CSS
    const leafletCssId = 'leaflet-css-cdn';
    if (!document.getElementById(leafletCssId)) {
      const link = document.createElement('link');
      link.id = leafletCssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Inject JS
    const leafletJsId = 'leaflet-js-cdn';
    if (document.getElementById(leafletJsId)) {
      const onReady = () => window.L ? resolve(window.L) : reject(new Error('Leaflet failed to load'));
      setTimeout(onReady, 50);
      return;
    }
    const script = document.createElement('script');
    script.id = leafletJsId;
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.body.appendChild(script);
  });
}

const POLL_MS = 7000; // 7s

export default function ActiveRouteMap({ routeNo }) {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const stopsLayerRef = useRef(null);
  const [error, setError] = useState('');
  const [currentStop, setCurrentStop] = useState('');
  const [nextStop, setNextStop] = useState('');
  const [mapReady, setMapReady] = useState(false);

  // Initialize map once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const L = await ensureLeafletLoaded();
        if (cancelled) return;
        if (!mapRef.current) return;

        // Create map centered on Mumbai region roughly
        const map = L.map(mapRef.current, { zoomControl: true });
        map.setView([19.076, 72.878], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        mapObjRef.current = map;
        setMapReady(true);
      } catch (e) {
        setError('Failed to load map library');
      }
    })();
    return () => {
      cancelled = true;
      if (mapObjRef.current) {
        mapObjRef.current.remove();
        mapObjRef.current = null;
      }
    };
  }, []);

  // Draw the route polyline for the selected route
  useEffect(() => {
    const map = mapObjRef.current;
    if (!map || !routeNo || !mapReady) return;

    // Clear previous route layer
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (stopsLayerRef.current) {
      map.removeLayer(stopsLayerRef.current);
      stopsLayerRef.current = null;
    }

    const key = (routeNo || '').trim().toUpperCase();
    const stops = allRoutes?.[key];
    if (!Array.isArray(stops) || stops.length === 0 || !window.L) return;

    const L = window.L;
    const latlngs = stops.map(s => [s.lat, s.lng]);

    // Create a layered highlight: a light outline under a colored stroke
    const outline = L.polyline(latlngs, { color: '#ffffff', weight: 8, opacity: 0.9, lineJoin: 'round' });
    const main = L.polyline(latlngs, { color: '#2563eb', weight: 5, opacity: 0.95, lineJoin: 'round' });
    const group = L.layerGroup([outline, main]);
    group.addTo(map);
    routeLayerRef.current = group;

    // Pan to route center without changing user's current zoom level
    if (latlngs.length > 1) {
      const bounds = L.latLngBounds(latlngs);
      const center = bounds.getCenter();
      map.panTo(center);
    }

    // Add small dot markers for each stop with tooltip and popup
    const stopsGroup = L.layerGroup();
    stops.forEach(s => {
      const cm = L.circleMarker([s.lat, s.lng], {
        radius: 4,
        color: '#1d4ed8',
        weight: 1,
        fillColor: '#1d4ed8',
        fillOpacity: 1,
      });
      if (s.stop_name) {
        cm.bindTooltip(s.stop_name, { direction: 'top', offset: [0, -6] });
        cm.bindPopup(`<b>${s.stop_name}</b>`);
      }
      cm.addTo(stopsGroup);
    });
    stopsGroup.addTo(map);
    stopsLayerRef.current = stopsGroup;
  }, [routeNo, mapReady]);

  // Fetch and plot active buses for the route
  useEffect(() => {
    if (!routeNo) return;
    let timerId;
    let aborted = false;
    const controller = new AbortController();

    // Haversine helper to find nearest stop
    const dist = (a, b) => {
      const toRad = d => (d * Math.PI) / 180;
      const R = 6371e3;
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const lat1 = toRad(a.lat);
      const lat2 = toRad(b.lat);
      const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
      const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
      return R * y;
    };

    const fetchAndRender = async () => {
      try {
        setError('');
        const res = await fetch(`${API_BASE_URL}/buses/routes/${encodeURIComponent(routeNo)}/active-buses`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        if (!Array.isArray(data)) return;

        // Update markers
        const map = mapObjRef.current;
        if (!map) return;

        // Clear existing markers
        markersRef.current.forEach(m => map.removeLayer(m));
        markersRef.current = [];

        if (data.length === 0) {
          setCurrentStop('');
          setNextStop('');
          return;
        }

        const L = window.L;
        const latlngs = [];

        // Custom bus icon using a divIcon (emoji), enlarged for better visibility
        const busIcon = L.divIcon({
          className: 'bus-marker',
          html: '<div style="font-size:28px;line-height:28px">🚌</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        data.forEach(bus => {
          const lat = parseFloat(bus.lat);
          const lng = parseFloat(bus.lng);
          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            latlngs.push([lat, lng]);
            const marker = L.marker([lat, lng], { title: `${bus.route_no} #${bus.bus_id}` , icon: busIcon })
              .bindPopup(`<b>${bus.route_no}</b><br/>Bus #${bus.bus_id}<br/>${bus.status || ''} ${bus.direction || ''}`)
              .addTo(map);
            markersRef.current.push(marker);
          }
        });

        // Do not auto-fit or recenter on bus updates; let the user control the view

        // Compute current and next stops for the first bus
        const firstBus = data[0];
        const key = (routeNo || '').trim().toUpperCase();
        const stops = allRoutes?.[key];
        if (firstBus && Array.isArray(stops) && stops.length > 0) {
          const busPoint = { lat: parseFloat(firstBus.lat), lng: parseFloat(firstBus.lng) };
          let bestIdx = 0;
          let bestD = Infinity;
          stops.forEach((s, i) => {
            const d = dist(busPoint, { lat: s.lat, lng: s.lng });
            if (d < bestD) {
              bestD = d;
              bestIdx = i;
            }
          });
          const dirUp = (firstBus.direction || 'UP').toUpperCase() === 'UP';
          const nextIdx = dirUp ? Math.min(bestIdx + 1, stops.length - 1) : Math.max(bestIdx - 1, 0);
          setCurrentStop(stops[bestIdx]?.stop_name || '');
          setNextStop(stops[nextIdx]?.stop_name || '');
        } else {
          setCurrentStop('');
          setNextStop('');
        }
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError('Failed to fetch active buses');
        }
      }
    };

    // initial fetch and then poll
    fetchAndRender();
    timerId = setInterval(fetchAndRender, POLL_MS);

    return () => {
      aborted = true;
      controller.abort();
      if (timerId) clearInterval(timerId);
    };
  }, [routeNo]);

  return (
    <div className="w-full rounded-xl overflow-hidden ring-1 ring-gray-200 bg-white">
      <div className="w-full h-96 bg-gray-100 relative">
        <div ref={mapRef} className="w-full h-full" />
        {error ? (
          <div className="absolute top-2 left-2 text-xs bg-white/90 px-2 py-1 rounded text-red-600 ring-1 ring-red-200">
            {error}
          </div>
        ) : null}
      </div>
      <div className="p-3 text-sm text-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <span className="text-gray-500">Current stop: </span>
          <span className="font-medium">{currentStop || '—'}</span>
        </div>
        <div>
          <span className="text-gray-500">Next stop: </span>
          <span className="font-medium">{nextStop || '—'}</span>
        </div>
      </div>
    </div>
  );
}

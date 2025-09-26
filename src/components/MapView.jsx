import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icon issue in Leaflet when using bundlers
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: icon2x,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ buses = [], selectedRoute }) => {
  const center = useMemo(() => {
    // Default to Thane center if no buses loaded yet
    if (buses.length) {
      return [buses[0].location.lat, buses[0].location.lng];
    }
    return [19.2183, 72.9781];
  }, [buses]);

  // Only render map on client to avoid SSR/DOM timing issues
  const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';

  return (
    <div className="h-[420px] w-full">
      {!isClient ? (
        <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">Loading map...</div>
      ) : (
        <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {buses.map(bus => (
            <Marker key={bus.id} position={[bus.location.lat, bus.location.lng]}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{bus.route}</div>
                  <div className="text-sm">To: {bus.destination}</div>
                  <div className="text-sm">ETA: {bus.eta}</div>
                  <div className="text-sm">Status: {bus.status}</div>
                  <div className="text-sm">Occupancy: {bus.occupancy}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapView;

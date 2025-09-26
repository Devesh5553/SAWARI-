import React, { useState } from 'react';

const LocationPrompt = ({ open, onAllow, onDeny }) => {
  const [error, setError] = useState('');
  if (!open) return null;

  const requestLocation = () => {
    setError('');
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        onAllow?.({ lat: latitude, lng: longitude });
      },
      (err) => {
        setError(err.message || 'Unable to retrieve your location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900">Allow location access?</h3>
          <p className="mt-2 text-gray-600 text-sm">
            We can use your location to show the nearest bus stops and sort upcoming buses around you.
          </p>

          {error && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {error}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={() => onDeny?.()}
              className="px-4 py-2 rounded-lg bg-white ring-1 ring-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Not now
            </button>
            <button
              onClick={requestLocation}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:opacity-95"
            >
              Allow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPrompt;

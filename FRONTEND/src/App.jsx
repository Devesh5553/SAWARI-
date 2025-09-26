import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import SearchBar from './components/SearchBar';
import BusList from './components/BusList';
import FeatureHighlights from './components/FeatureHighlights';
import AdminDashboard from './components/AdminDashboard';
import { Bus, MapPin, Clock, Smartphone, BarChart3, Shield } from 'lucide-react';
import DeviceMockup from './components/DeviceMockup';
import { buses as allBuses } from './data/buses';
import LocationPrompt from './components/LocationPrompt';

function App() {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  // Load stored location or show prompt on first visit
  useEffect(() => {
    try {
      const stored = localStorage.getItem('userLocation');
      const denied = localStorage.getItem('locationDenied');
      if (stored) {
        setUserLocation(JSON.parse(stored));
      } else if (denied !== 'true') {
        setShowLocationPrompt(true);
      }
    } catch (_) {
      // ignore storage errors
    }
  }, []);

  // Mock data for demonstration (centralized)
  useEffect(() => {
    const mapped = allBuses.map(b => ({
      id: b.id,
      route: b.route,
      destination: b.destination,
      eta: `${b.etaMin} min`,
      location: b.location,
      occupancy: b.occupancy,
      status: b.status,
      etaMin: b.etaMin,
      start: b.start,
      estimatedJourneyMin: b.estimatedJourneyMin,
    }));

    setTimeout(() => {
      setBuses(mapped);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleRouteSearch = (route) => {
    setSelectedRoute(route);
    // Could also filter based on route here if desired
  };

  // Haversine distance in km
  const distanceKm = (a, b) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  // If userLocation known, prioritize nearest buses (and optionally filter within radius)
  const displayedBuses = useMemo(() => {
    if (!userLocation) return buses;
    const withDist = buses.map(b => ({ ...b, _distKm: distanceKm(userLocation, { lat: b.location.lat, lng: b.location.lng }) }));
    // Optional: filter within 8km; if none, just sort all
    const within = withDist.filter(b => b._distKm <= 8);
    const list = (within.length ? within : withDist).sort((a, b) => a._distKm - b._distKm);
    return list.map(({ _distKm, ...rest }) => rest);
  }, [buses, userLocation]);

  const onAllowLocation = (coords) => {
    setUserLocation(coords);
    setShowLocationPrompt(false);
    try { localStorage.setItem('userLocation', JSON.stringify(coords)); } catch (_) {}
  };
  const onDenyLocation = () => {
    setShowLocationPrompt(false);
    try { localStorage.setItem('locationDenied', 'true'); } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <LocationPrompt open={showLocationPrompt} onAllow={onAllowLocation} onDeny={onDenyLocation} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Track Your Bus in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Real-Time</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Never miss your bus again with SAWARI's intelligent tracking system. 
              Get live updates, ETAs, and seamless journey planning.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar onSearch={handleRouteSearch} />
          </div>

          {/* Feature Highlights */}
          <FeatureHighlights />

          {/* Browser + Phone Mockup Preview */}
          <DeviceMockup />
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                    Live Bus Locations
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live</span>
                  </div>
                </div>
              </div>
              <MapView buses={displayedBuses} selectedRoute={selectedRoute} userLocation={userLocation} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bus List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  Upcoming Buses
                </h2>
              </div>
              <BusList buses={displayedBuses} isLoading={isLoading} />
            </div>

            {/* Admin Dashboard */}
            <AdminDashboard />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Thousands Daily
            </h2>
            <p className="text-lg text-gray-600">
              Making public transportation smarter and more reliable
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Daily Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-600">Bus Routes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Live Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

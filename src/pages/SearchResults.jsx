import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buses as allBuses } from '../data/buses';
import Header from '../components/Header';
import ActiveRouteMap from '../components/ActiveRouteMap';
import { ArrowLeft, ArrowRight, MapPin, Clock, Bus, Home } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SearchResults = () => {
  const navigate = useNavigate();
  const query = useQuery().get('q')?.trim() || '';
  const [apiResults, setApiResults] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return allBuses
      .filter(b => b.route.toLowerCase().includes(q) || b.destination.toLowerCase().includes(q))
      .sort((a, b) => a.etaMin - b.etaMin);
  }, [query]);

  // Next bus = earliest etaMin in the filtered list
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [query]);

  // Fetch backend results as user navigates to this page
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setApiResults([]);
      return;
    }
    const controller = new AbortController();
    const run = async () => {
      try {
        setApiLoading(true);
        const res = await fetch(`${API_BASE_URL}/buses/search?query=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setApiResults(data);
          } else if (Array.isArray(data?.response)) {
            setApiResults(data.response);
          } else {
            setApiResults([]);
          }
        } else {
          setApiResults([]);
        }
      } catch (e) {
        if (e.name !== 'AbortError') {
          setApiResults([]);
        }
      } finally {
        setApiLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [query]);

  const current = filtered[index];

  const goPrev = () => {
    setIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
  };

  const goNext = () => {
    setIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
  };

  return (
    <div>
      <Header />
      <section className="max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white ring-1 ring-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Home className="w-4 h-4" /> Home
          </button>
        </div>

        {query && filtered.length === 0 && apiResults.length === 0 && !apiLoading && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-700">
            No buses found matching your query. Try another route or destination.
          </div>
        )}

        {query && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <div className="text-lg font-semibold text-gray-900 mb-3">Live buses on route {query}</div>
            <ActiveRouteMap routeNo={query} />
          </div>
        )}

        {apiResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <div className="text-lg font-semibold text-gray-900 mb-3">Matches</div>
            <ul className="divide-y divide-gray-100">
              {apiResults.map((b, idx) => (
                <li
                  key={`${b.route_no}-${idx}`}
                  className="py-3 cursor-pointer hover:bg-gray-50 px-2 rounded-lg"
                  onClick={() => navigate(`/results?q=${encodeURIComponent(b.route_no || '')}`)}
                >
                  <div className="font-semibold text-gray-900">{b.route_no}</div>
                  <div className="text-sm text-gray-600">{b.source} - {b.destination}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {false && current && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bus className="w-5 h-5" />
                <div>
                  <div className="text-sm text-gray-600">Next departing bus</div>
                  <div className="text-xl font-semibold text-gray-900">{current.route}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                  <Clock className="w-4 h-4" /> Departs in {current.etaMin} min
                </div>
              </div>
            </div>

            <div className="p-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">From</div>
                    <div className="font-medium text-gray-900">{current.start}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">To</div>
                    <div className="font-medium text-gray-900">{current.destination}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Estimated journey</div>
                    <div className="font-medium text-gray-900">{current.estimatedJourneyMin} min</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full bg-green-500 animate-pulse" />
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium text-gray-900">{current.status}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-sm text-gray-600 mb-2">Other upcoming buses on this route</div>
                <div className="space-y-2">
                  {filtered.map((b, i) => (
                    <div
                      key={b.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border ${i === index ? 'bg-white border-blue-200 ring-1 ring-blue-100' : 'bg-white border-gray-100'}`}
                    >
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{b.route} → {b.destination}</div>
                        <div className="text-gray-500">Departs in {b.etaMin} min • {b.status}</div>
                      </div>
                      <button
                        className={`text-sm font-medium px-2.5 py-1 rounded ${i === index ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setIndex(i)}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={filtered.length <= 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white ring-1 ring-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
              <div className="text-sm text-gray-600">
                {filtered.length > 0 && (
                  <>Bus {index + 1} of {filtered.length}</>
                )}
              </div>
              <button
                onClick={goNext}
                disabled={filtered.length <= 1}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:opacity-95 disabled:opacity-50"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResults;

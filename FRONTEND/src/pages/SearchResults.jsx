import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buses as allBuses } from '../data/buses';
import Header from '../components/Header';
import { ArrowLeft, ArrowRight, MapPin, Clock, Bus, Home } from 'lucide-react';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SearchResults = () => {
  const navigate = useNavigate();
  const query = useQuery().get('q')?.trim() || '';

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

  const current = filtered[index];

  const goPrev = () => {
    setIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
  };
  const goNext = () => {
    setIndex(prev => (prev + 1) % filtered.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Search Results{query ? ` for "${query}"` : ''}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white ring-1 ring-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Home className="w-4 h-4" /> Home
          </button>
        </div>

        {query && filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-700">
            No buses found matching your query. Try another route or destination.
          </div>
        )}

        {current && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Bus className="w-5 h-5" />
                </div>
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

import React from 'react';
import { Bus, Clock, AlertTriangle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const color = status === 'On Time' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>{status}</span>
  );
};

const OccupancyPill = ({ level }) => {
  const map = {
    Low: 'bg-blue-50 text-blue-700',
    Medium: 'bg-purple-50 text-purple-700',
    High: 'bg-red-50 text-red-700',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[level] || 'bg-gray-100 text-gray-700'}`}>{level} occupancy</span>;
};

const BusList = ({ buses = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {buses.map((bus) => (
        <div key={bus.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{bus.route}</div>
                <div className="text-sm text-gray-600">To {bus.destination}</div>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={bus.status} />
                  <OccupancyPill level={bus.occupancy} />
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end text-gray-700 font-semibold">
                <Clock className="w-4 h-4 mr-1 text-blue-600" /> {bus.eta}
              </div>
              {bus.status !== 'On Time' && (
                <div className="flex items-center justify-end text-xs text-yellow-700 mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" /> May vary due to traffic
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {buses.length === 0 && (
        <div className="p-6 text-center text-gray-600">No buses found for the selected route.</div>
      )}
    </div>
  );
};

export default BusList;

import React from 'react';
import { Radar, MessageSquare, BarChart3 } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, accent }) => (
  <div className="p-5 rounded-2xl bg-white shadow ring-1 ring-gray-100 hover:shadow-md transition">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent} text-white mb-3`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="font-semibold text-gray-900">{title}</div>
    <div className="text-sm text-gray-600 mt-1">{desc}</div>
  </div>
);

const FeatureHighlights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FeatureCard
        icon={Radar}
        title="Real-time Tracking"
        desc="Live GPS locations, ETAs, and route progress"
        accent="bg-gradient-to-r from-blue-600 to-indigo-600"
      />
      <FeatureCard
        icon={MessageSquare}
        title="SMS Updates"
        desc="Notify passengers about delays or changes"
        accent="bg-gradient-to-r from-green-600 to-emerald-600"
      />
      <FeatureCard
        icon={BarChart3}
        title="Data Insights"
        desc="Analytics for authorities to optimize routes"
        accent="bg-gradient-to-r from-purple-600 to-fuchsia-600"
      />
    </div>
  );
};

export default FeatureHighlights;

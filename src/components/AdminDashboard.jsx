import React from 'react';
import { LayoutDashboard, BellRing, FileBarChart2, Settings } from 'lucide-react';

const Tile = ({ icon: Icon, title, desc, color }) => (
  <div className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition bg-white">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} text-white mb-3`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="font-semibold text-gray-900">{title}</div>
    <div className="text-sm text-gray-600">{desc}</div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <LayoutDashboard className="w-5 h-5 text-purple-600 mr-2" />
          Admin Dashboard
        </h2>
      </div>
      <div className="p-6 grid grid-cols-2 gap-4">
        <Tile icon={LayoutDashboard} title="Fleet" desc="Manage buses & routes" color="bg-indigo-600" />
        <Tile icon={BellRing} title="Alerts" desc="Broadcast SMS alerts" color="bg-emerald-600" />
        <Tile icon={FileBarChart2} title="Reports" desc="Insights & analytics" color="bg-fuchsia-600" />
        <Tile icon={Settings} title="Settings" desc="Permissions & configs" color="bg-orange-500" />
      </div>
    </div>
  );
};

export default AdminDashboard;

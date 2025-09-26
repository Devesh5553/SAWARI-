import React from 'react';
import { Bus, Bell, Settings, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">SAWARI</div>
              <div className="text-xs text-gray-500 -mt-1">Real-time Bus Tracker</div>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Features</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Routes</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Time Table</button>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
            <Link to="/login" className="ml-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold shadow">
              <div className="flex items-center space-x-2">
                <UserCircle2 className="w-5 h-5" />
                <span>Login</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

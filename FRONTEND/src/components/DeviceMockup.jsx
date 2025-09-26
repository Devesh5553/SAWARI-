import React from 'react';
import { MapPin, MessageSquare, BarChart3, Bell } from 'lucide-react';

const BrowserChrome = ({ children }) => (
  <div className="rounded-2xl shadow-lg overflow-hidden bg-white ring-1 ring-gray-200">
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200/80">
      <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
      <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
      <div className="ml-3 flex-1">
        <div className="h-7 rounded-md bg-white border border-gray-200 px-3 flex items-center text-gray-500 text-xs truncate shadow-sm">
          https://sawari.app
        </div>
      </div>
    </div>
    <div className="bg-white">{children}</div>
  </div>
);

const PhoneChrome = ({ children }) => (
  <div className="rounded-[2.2rem] p-3 bg-neutral-900 shadow-2xl w-[260px]">
    <div className="bg-white rounded-[1.7rem] overflow-hidden border border-gray-200">
      <div className="h-5 bg-black"></div>
      {children}
    </div>
  </div>
);

const FeatureChip = ({ icon: Icon, label, colorClass }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
    <Icon className="w-3.5 h-3.5" />
    <span>{label}</span>
  </div>
);

const DeviceMockup = () => {
  return (
    <div className="mt-10">
      {/* Option B: side-by-side perfectly aligned */}
      <div className="max-w-6xl mx-auto flex items-end justify-center gap-10 px-4">
        {/* Left: Website mock */}
        <div className="hidden lg:flex w-[600px] justify-end">
          <BrowserChrome>
            <div className="h-[460px] p-6 flex flex-col">
              {/* Mock hero with search */}
              <div>
                <div className="text-lg font-semibold text-gray-900">Track Your Bus</div>
                <div className="mt-2 h-10 rounded-xl border border-gray-200 bg-gray-50"></div>
              </div>
              {/* Mock map block */}
              <div className="mt-4 flex-1 rounded-xl bg-[url('https://tile.openstreetmap.org/5/28/25.png')] bg-cover bg-center border border-gray-100"></div>
              {/* Feature chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                <FeatureChip icon={MapPin} label="Real-time Tracking" colorClass="bg-blue-50 text-blue-700" />
                <FeatureChip icon={MessageSquare} label="SMS Updates" colorClass="bg-emerald-50 text-emerald-700" />
                <FeatureChip icon={BarChart3} label="Data Insights" colorClass="bg-purple-50 text-purple-700" />
              </div>
            </div>
          </BrowserChrome>
        </div>

        {/* Center: Phone */}
        <div className="flex-shrink-0 flex justify-center">
          <PhoneChrome>
            <div className="h-[460px] w-full bg-white">
              <div className="px-3 pt-3 pb-2 border-b border-gray-200 flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-700">SAWARI</div>
                <Bell className="w-4 h-4 text-gray-500" />
              </div>
              <div className="p-3 space-y-2">
                <div className="p-2.5 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-800">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <div className="text-sm font-medium">Real-time Tracking</div>
                  </div>
                  <div className="mt-1 text-[11px] text-gray-600">Live locations and ETAs for every route</div>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-800">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <div className="text-sm font-medium">SMS Updates</div>
                  </div>
                  <div className="mt-1 text-[11px] text-gray-600">Delay alerts and stop notifications</div>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-800">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <div className="text-sm font-medium">Data Insights</div>
                  </div>
                  <div className="mt-1 text-[11px] text-gray-600">Operational analytics for authorities</div>
                </div>
              </div>
            </div>
          </PhoneChrome>
        </div>
      </div>
    </div>
  );
};

export default DeviceMockup;

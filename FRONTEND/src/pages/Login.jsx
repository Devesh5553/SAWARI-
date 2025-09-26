import React, { useState } from 'react';
import { Bus, Mail, Lock, ArrowRight } from 'lucide-react';

const Input = ({ icon: Icon, type = 'text', placeholder, value, onChange }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={type}
      className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left side: brand and copy */}
        <div className="hidden lg:block">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">SAWARI</div>
              <div className="text-sm text-gray-500 -mt-1">Real-time Bus Tracker</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Welcome back
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Manage routeS and view live insights, all in one place.
          </p>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Live bus tracking</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-500 rounded-full"></span> Passenger alerts</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Delays</li>
          </ul>
        </div>

        {/* Right side: form */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl ring-1 ring-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Sign in</h2>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
        
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:opacity-95 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : (<>
                Continue <ArrowRight className="w-4 h-4" />
              </>)}
            </button>

            <div className="text-xs text-gray-500 text-center mt-2">
              Don't have an account? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Sign up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

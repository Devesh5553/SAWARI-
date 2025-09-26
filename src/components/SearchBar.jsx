import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    onSearch?.(q);
    if (q) {
      navigate(`/results?q=${encodeURIComponent(q)}`);
    }
  };

  // Debounced fetch for suggestions as user types
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/buses/search?query=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
          } else if (Array.isArray(data?.response)) {
            setSuggestions(data.response);
          } else {
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="flex-1 flex items-center bg-white rounded-xl shadow ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition relative">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <input
          type="text"
          placeholder="Enter route number or destination..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          className="w-full px-3 py-3 rounded-xl outline-none text-gray-800 placeholder:text-gray-400"
        />
        {showDropdown && query.trim() && suggestions.length > 0 && (
          <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-auto">
            {suggestions.map((item, idx) => (
              <li
                key={`${item.route_no}-${idx}`}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  const sel = item.route_no || '';
                  setQuery(sel);
                  onSearch?.(sel);
                  setShowDropdown(false);
                  if (sel) {
                    navigate(`/results?q=${encodeURIComponent(sel)}`);
                  }
                }}
              >
                <div className="font-semibold text-gray-900">{item.route_no}</div>
                <div className="text-sm text-gray-600 truncate">
                  {item.source} - {item.destination}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="submit"
        className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:opacity-95"
      >
        Search
      </button>
      <button
        type="button"
        className="p-3 rounded-xl bg-white shadow ring-1 ring-gray-200 text-gray-700 hover:bg-gray-50"
        title="Filters"
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBar;

import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    onSearch?.(q);
    if (q) {
      navigate(`/results?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="flex-1 flex items-center bg-white rounded-xl shadow ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <input
          type="text"
          placeholder="Enter route number or destination..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-3 rounded-xl outline-none text-gray-800 placeholder:text-gray-400"
        />
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

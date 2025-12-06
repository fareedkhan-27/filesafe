import React, { useState } from 'react';
import { Search, Mic } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Ask: When does my passport expire?"
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleVoiceInput = () => {
    // TODO: Implement Web Speech API
    // For now, just a placeholder
    alert('Voice input coming soon!');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" aria-hidden="true">
          <Search size={22} strokeWidth={2} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-14 pr-14 py-4.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                     placeholder:text-gray-400 dark:placeholder:text-gray-500
                     focus:border-primary-500 dark:focus:border-primary-400
                     focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/50
                     text-base font-medium transition-all shadow-sm"
          aria-label="Search your documents"
          aria-describedby="search-hint"
        />
        <span id="search-hint" className="sr-only">
          Search by document name, type, or ask questions like "When does my passport expire?"
        </span>

        <button
          type="button"
          onClick={handleVoiceInput}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500
                     hover:text-primary-600 dark:hover:text-primary-400 active:scale-95 transition-all"
          aria-label="Voice search (coming soon)"
          title="Voice search"
        >
          <Mic size={22} strokeWidth={2} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

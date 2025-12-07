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
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
          <Search size={20} strokeWidth={2.5} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-slate-200
                     bg-slate-50 text-slate-900
                     placeholder:text-slate-500
                     focus:border-primary-500 focus:bg-white
                     focus:ring-4 focus:ring-primary-500/10
                     text-base font-medium transition-all shadow-sm
                     hover:border-slate-300"
          aria-label="Search your documents"
          aria-describedby="search-hint"
        />
        <span id="search-hint" className="sr-only">
          Search by document name, type, or ask questions like "When does my passport expire?"
        </span>

        <button
          type="button"
          onClick={handleVoiceInput}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400
                     hover:text-primary-600 active:scale-95 transition-all p-1 rounded-lg hover:bg-slate-100"
          aria-label="Voice search (coming soon)"
          title="Voice search"
        >
          <Mic size={20} strokeWidth={2.5} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

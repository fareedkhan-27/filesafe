import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import SearchBar from '../components/SearchBar';
import ProfileSelector from '../components/ProfileSelector';
import QuickChip from '../components/QuickChip';
import DocumentCard from '../components/DocumentCard';
import UserMenu from '../components/UserMenu';
import { search, getQuickSearchSuggestions } from '../services/searchEngine';
import { SearchResult } from '../types/vault';
import { getExpiringDocuments } from '../services/vaultStorage';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { profiles, documents, currentProfileId, setCurrentProfileId } = useVault();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showingExpiring, setShowingExpiring] = useState(false);

  const currentProfile = profiles.find(p => p.id === currentProfileId);

  useEffect(() => {
    if (currentProfile) {
      const newSuggestions = getQuickSearchSuggestions(currentProfile, documents);
      setSuggestions(newSuggestions);
    }
  }, [currentProfile, documents]);

  const handleSearch = (query: string) => {
    const result = search(query, documents, profiles, currentProfileId);
    setSearchResult(result);
    setShowingExpiring(false);
  };

  const handleQuickChipClick = async (suggestion: string) => {
    try {
      // Handle the expiring documents chip
      if (suggestion === "⏰ Expiring" || suggestion === "Next expiring document") {
        const expiringDocs = await getExpiringDocuments(90);
        setSearchResult({
          type: expiringDocs.length === 1 ? 'document' : 'multiple',
          documents: expiringDocs,
          highlightedField: 'expiry_date',
          query: "Expiring documents"
        });
        setShowingExpiring(true);
      } else {
        // For other chips, extract the document type and search
        // The emoji and short text will still match keywords in search
        handleSearch(suggestion);
      }
    } catch (error) {
      // Silent fail - search will just show no results
      setSearchResult(null);
    }
  };

  const handleDocumentClick = (documentId: string) => {
    navigate(`/document/${documentId}`);
  };

  const myDocuments = documents.filter(d => d.profileId === currentProfileId);

  return (
    <div className="min-h-screen bg-slate-900 pb-24 md:pb-20 safe-bottom">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10 safe-top shadow-lg">
        <div className="px-6 py-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline gap-3">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">FileSafe</h1>
                <p className="text-base text-slate-400 mt-1">Your secure document vault</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg">
                v1.1.0
              </span>
            </div>
            <UserMenu />
          </div>

          {/* Profile Selector */}
          {profiles.length > 0 && (
            <div className="mb-5">
              <ProfileSelector
                profiles={profiles}
                currentProfileId={currentProfileId}
                onChange={setCurrentProfileId}
              />
            </div>
          )}

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />

          {/* Quick Suggestions */}
          <div className="flex gap-3 mt-5 overflow-x-auto pb-3 hide-scrollbar -mx-6 px-6">
            {suggestions.map((suggestion, index) => (
              <QuickChip
                key={index}
                label={suggestion}
                onClick={() => handleQuickChipClick(suggestion)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main id="main-content" className="px-6 py-6">
        {searchResult ? (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-white">
                {showingExpiring ? 'Expiring Documents' : 'Search Results'}
              </h2>
              <button
                onClick={() => setSearchResult(null)}
                className="text-base text-cyan-400 font-semibold hover:bg-cyan-500/10 px-5 py-2.5 rounded-xl transition-all active:scale-95"
                aria-label="Clear search results and return to all documents"
              >
                Clear
              </button>
            </div>

            {searchResult.documents.length === 0 ? (
              <div className="card text-center py-12">
                <FileText className="mx-auto text-slate-600 mb-3" size={56} />
                <p className="text-lg text-slate-300">No documents found</p>
                <p className="text-base text-slate-400 mt-2">Try a different search</p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResult.documents.map(doc => {
                  const docProfile = profiles.find(p => p.id === doc.profileId);
                  return (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      profile={docProfile}
                      highlightedField={searchResult.highlightedField}
                      onClick={() => handleDocumentClick(doc.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* My Documents */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-white">
                {currentProfile?.name}'s Documents
              </h2>
              <button
                onClick={() => navigate('/documents/new')}
                className="flex items-center gap-2 text-base text-white bg-gradient-to-r from-cyan-500 to-teal-500 font-semibold hover:from-cyan-600 hover:to-teal-600 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 active:scale-95"
                aria-label="Add new document to your vault"
              >
                <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
                Add
              </button>
            </div>

            {myDocuments.length === 0 ? (
              <div className="space-y-6">
                {/* Welcome Message */}
                <div className="card text-center py-12">
                  <FileText className="mx-auto text-slate-600 mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Let's add your first document!
                  </h3>
                  <p className="text-lg text-slate-400 mb-2">
                    Choose what you'd like to add:
                  </p>
                </div>

                {/* Document Type Suggestions */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Passport */}
                  <button
                    onClick={() => navigate('/documents/new?type=passport')}
                    className="card hover:shadow-xl transition-all duration-200 active:scale-98 text-left p-6 group"
                    aria-label="Add a new passport - Most commonly used, quick to add"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl group-hover:scale-110 transition-transform" aria-hidden="true">🛂</div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                          Passport
                        </h4>
                        <p className="text-sm text-slate-400">
                          Most commonly used • Quick to add
                        </p>
                      </div>
                      <div className="text-slate-600 group-hover:text-cyan-400 transition-colors" aria-hidden="true">
                        →
                      </div>
                    </div>
                  </button>

                  {/* Driver's License */}
                  <button
                    onClick={() => navigate('/documents/new?type=driving_license')}
                    className="card hover:shadow-xl transition-all duration-200 active:scale-98 text-left p-6 group"
                    aria-label="Add a new driver's license - For identification and driving"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl group-hover:scale-110 transition-transform" aria-hidden="true">🚗</div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                          Driver's License
                        </h4>
                        <p className="text-sm text-slate-400">
                          For identification and driving
                        </p>
                      </div>
                      <div className="text-slate-600 group-hover:text-cyan-400 transition-colors" aria-hidden="true">
                        →
                      </div>
                    </div>
                  </button>

                  {/* National ID */}
                  <button
                    onClick={() => navigate('/documents/new?type=national_id')}
                    className="card hover:shadow-xl transition-all duration-200 active:scale-98 text-left p-6 group"
                    aria-label="Add a new national ID - Government issued identification"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl group-hover:scale-110 transition-transform" aria-hidden="true">🪪</div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                          National ID
                        </h4>
                        <p className="text-sm text-slate-400">
                          Government issued identification
                        </p>
                      </div>
                      <div className="text-slate-600 group-hover:text-cyan-400 transition-colors" aria-hidden="true">
                        →
                      </div>
                    </div>
                  </button>
                </div>

                {/* Browse All Option */}
                <div className="text-center">
                  <button
                    onClick={() => navigate('/documents/new')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium text-base hover:underline transition-colors"
                    aria-label="Browse all available document types to add"
                  >
                    Or browse all document types →
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myDocuments.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onClick={() => handleDocumentClick(doc.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Version Footer */}
      <div className="fixed bottom-20 right-4 z-10">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full px-3 py-1.5 text-xs text-slate-400">
          v1.1.0
        </div>
      </div>

      {/* Hide scrollbar for horizontal scroll */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { UserProfile, Community } from '../types';
import {
  Search,
  X,
  Users,
  Rocket,
  Video,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToUser: (userId: string) => void;
  onNavigateToCommunity: (commId: string) => void;
  onExploreMore: (query: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToUser,
  onNavigateToCommunity,
  onExploreMore,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'startups' | 'creators' | 'communities'>('all');
  const [results, setResults] = useState<{
    people: UserProfile[];
    startups: UserProfile[];
    creators: UserProfile[];
    communities: Community[];
  }>({ people: [], startups: [], creators: [], communities: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ people: [], startups: [], creators: [], communities: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ people: [], startups: [], creators: [], communities: [] });
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await api.searchGlobal(query.trim());
        setResults(data);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalHits =
    results.people.length +
    results.startups.length +
    results.creators.length +
    results.communities.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across people, startups, creators, communities, or skills..."
            className="flex-1 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin shrink-0" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs font-semibold"
          >
            Esc
          </button>
        </div>

        {/* Filter Tabs */}
        {query.trim() && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Results ({totalHits})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('people')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                activeTab === 'people'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              People ({results.people.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('startups')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                activeTab === 'startups'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Startups ({results.startups.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('creators')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                activeTab === 'creators'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Creators & Brands ({results.creators.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('communities')}
              className={`px-3 py-1 rounded-full font-medium transition-colors ${
                activeTab === 'communities'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Communities ({results.communities.length})
            </button>
          </div>
        )}

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-5 flex-1">
          {!query.trim() ? (
            <div className="py-8 text-center">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-800">
                Discover the right people on Networkth
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Try searching for "Distributed Systems", "AI Founders", "Stanford", "Content Creators", or "Observability".
              </p>
            </div>
          ) : totalHits === 0 && !isLoading ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No direct matches found for "{query}". Try searching broader terms or view the Discover page.
            </div>
          ) : (
            <>
              {/* People Section */}
              {(activeTab === 'all' || activeTab === 'people') && results.people.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    People & Professionals
                  </h4>
                  <div className="space-y-1.5">
                    {results.people.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onNavigateToUser(p.id);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {p.headline}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                          {p.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Startups Section */}
              {(activeTab === 'all' || activeTab === 'startups') && results.startups.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Rocket className="w-3.5 h-3.5" />
                    Startups & Founders
                  </h4>
                  <div className="space-y-1.5">
                    {results.startups.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onNavigateToUser(s.id);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {s.headline}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md shrink-0">
                          {s.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Creators & Brands Section */}
              {(activeTab === 'all' || activeTab === 'creators') && results.creators.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    Creators & Brands
                  </h4>
                  <div className="space-y-1.5">
                    {results.creators.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigateToUser(c.id);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {c.headline}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md shrink-0">
                          {c.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Communities Section */}
              {(activeTab === 'all' || activeTab === 'communities') && results.communities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Communities
                  </h4>
                  <div className="space-y-1.5">
                    {results.communities.map((comm) => (
                      <div
                        key={comm.id}
                        onClick={() => {
                          onNavigateToCommunity(comm.id);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <img
                          src={comm.avatar}
                          alt={comm.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                            {comm.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {comm.memberCount.toLocaleString()} members • {comm.category}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md shrink-0">
                          Community
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {query.trim() && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Showing top results for "{query}"
            </span>
            <button
              type="button"
              onClick={() => {
                onExploreMore(query);
                onClose();
              }}
              className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all on Discover page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

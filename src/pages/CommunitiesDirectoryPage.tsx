import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Community } from '../types';
import { CommunityCard } from '../components/CommunityCard';
import { Search, Users, X, Compass } from 'lucide-react';

interface CommunitiesDirectoryPageProps {
  onViewCommunity: (commId: string) => void;
}

export const CommunitiesDirectoryPage: React.FC<CommunitiesDirectoryPageProps> = ({
  onViewCommunity,
}) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getCommunities().then((res) => {
      setCommunities(res.communities);
      setIsLoading(false);
    });
  }, []);

  const categories = [
    'All',
    'AI & Machine Learning',
    'Software & Systems',
    'Startups & Founders',
    'Tech Media & Creators',
    'Developer Platforms',
    'Collegiate Communities',
    'Product & Design',
    'Cloud & DevOps',
  ];

  const filteredCommunities = communities.filter((comm) => {
    if (selectedCategory !== 'All' && comm.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = comm.name.toLowerCase().includes(q);
      const matchesDesc = comm.description.toLowerCase().includes(q);
      const matchesTags = comm.tags.some((t) => t.toLowerCase().includes(q));
      return matchesName || matchesDesc || matchesTags;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>NICHE HUBS & ECOSYSTEMS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Communities
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-2xl">
            Join verified practitioner hubs across AI, Systems, Web Development, Collegiate Hackathons, and Startup Founders.
          </p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community hubs by topic or language..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            Loading communities...
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center max-w-md mx-auto">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">No communities found</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try adjusting your search terms or clearing the selected category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCommunities.map((comm) => (
              <CommunityCard
                key={comm.id}
                community={comm}
                onViewCommunity={onViewCommunity}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

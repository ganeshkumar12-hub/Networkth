import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { UserProfile, Community, UserRole } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { CommunityCard } from '../components/CommunityCard';
import { ConnectModal } from '../components/ConnectModal';
import { SwipeMatchDeck, DeckCategory } from '../components/SwipeMatchDeck';
import {
  Search,
  Filter,
  Users,
  Compass,
  Sparkles,
  MapPin,
  Briefcase,
  Loader2,
  X,
  LayoutGrid,
} from 'lucide-react';

interface DiscoverPageProps {
  initialRoleFilter?: string;
  onNavigateToUser: (userId: string) => void;
  onNavigateToCommunity: (commId: string) => void;
  onOpenMessage: (userId: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  initialRoleFilter,
  onNavigateToUser,
  onNavigateToCommunity,
  onOpenMessage,
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>(initialRoleFilter || 'All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'deck'>('grid');

  // Connect modal state
  const [connectModalUser, setConnectModalUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (initialRoleFilter) {
      setSelectedRole(initialRoleFilter);
    }
  }, [initialRoleFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, commRes] = await Promise.all([
        api.getUsers(),
        api.getCommunities(),
      ]);
      setUsers(usersRes.users);
      setCommunities(commRes.communities);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const roles = [
    'All',
    'Student',
    'Working Professional',
    'Founder',
    'Startup',
    'Creator',
    'Brand',
    'Developer',
    'Community',
  ];

  const availabilities = [
    'All',
    'Open to Connect',
    'Mentoring',
    'Collaborating',
    'Hiring',
    'Seeking Beta Users',
  ];

  const industries = [
    'All',
    'Artificial Intelligence',
    'Distributed Systems & FinTech',
    'Tech Media & Education',
    'Cloud & Developer Infrastructure',
    'Higher Education & CS',
    'FinTech & Banking',
  ];

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (selectedRole !== 'All' && selectedRole !== 'Community') {
        if (u.role !== selectedRole) return false;
      }

      // Availability
      if (selectedAvailability !== 'All' && u.availability !== selectedAvailability) {
        return false;
      }

      // Industry
      if (selectedIndustry !== 'All' && u.industry !== selectedIndustry) {
        return false;
      }

      // Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesHeadline = u.headline.toLowerCase().includes(q);
        const matchesSkills = u.skills.some((s) => s.toLowerCase().includes(q));
        const matchesIndustry = u.industry.toLowerCase().includes(q);
        const matchesLocation = u.location.toLowerCase().includes(q);
        return matchesName || matchesHeadline || matchesSkills || matchesIndustry || matchesLocation;
      }

      return true;
    });
  }, [users, selectedRole, selectedAvailability, selectedIndustry, searchQuery]);

  // Filtered communities
  const filteredCommunities = useMemo(() => {
    if (selectedRole !== 'All' && selectedRole !== 'Community') {
      return [];
    }

    return communities.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        const matchesTags = c.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = c.category.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesTags || matchesCategory;
      }
      return true;
    });
  }, [communities, selectedRole, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>DIRECTORY & EXPLORATION</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Discover the Right People
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-2xl">
                Filter verified students, staff engineers, founders, and specialized tech hubs by role synergy and intent.
              </p>
            </div>

            {/* Quick stats pill */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl shrink-0 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-900">{users.length}</span> Members
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div>
                <span className="font-bold text-slate-900">{communities.length}</span> Hubs
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live Matching
              </div>
            </div>
          </div>

          {/* Search bar & filter inputs */}
          <div className="mt-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, engineering skill, company, university, or keyword..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

            {/* Availability Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="py-3 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Availabilities</option>
                {availabilities.slice(1).map((av) => (
                  <option key={av} value={av}>
                    {av}
                  </option>
                ))}
              </select>

              {/* Industry Filter */}
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="py-3 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 max-w-[180px]"
              >
                <option value="All">All Industries</option>
                {industries.slice(1).map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role Filter Tabs & View Mode Switcher */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedRole === role
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* View Mode Switcher (Grid vs Swipe Match Deck) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('deck')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'deck'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Swipe Match Deck</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Matching profiles and communities...</p>
          </div>
        ) : viewMode === 'deck' ? (
          <div>
            <SwipeMatchDeck
              title="Synergy Decision Deck"
              subtitle="Scroll trackpad or swipe cards: Left to Reject/Pass, Right to Select profiles across startups, students, professionals, brands, and creators."
              initialCategory={
                selectedRole === 'Startup' || selectedRole === 'Founder'
                  ? 'startups'
                  : selectedRole === 'Student'
                  ? 'students'
                  : selectedRole === 'Working Professional' || selectedRole === 'Mentor / Industry Expert'
                  ? 'professionals'
                  : selectedRole === 'Brand'
                  ? 'brands'
                  : selectedRole === 'Creator'
                  ? 'creators'
                  : 'all'
              }
              allowedCategories={['all', 'startups', 'students', 'professionals', 'brands', 'creators']}
              onViewProfile={onNavigateToUser}
              onOpenMessage={onOpenMessage}
              onRequestConnect={(u) => setConnectModalUser(u)}
            />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Communities Results (if applicable) */}
            {selectedRole === 'Community' || (selectedRole === 'All' && filteredCommunities.length > 0) ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Communities ({filteredCommunities.length})</span>
                  </h3>
                </div>

                {filteredCommunities.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                    No communities match your search.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredCommunities.map((comm) => (
                      <CommunityCard
                        key={comm.id}
                        community={comm}
                        onViewCommunity={onNavigateToCommunity}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* People & Profiles Results */}
            {selectedRole !== 'Community' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>People & Profiles ({filteredUsers.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Showing verified members
                  </span>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center max-w-lg mx-auto">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-slate-800">No profiles found</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Try adjusting your keywords or clearing the active filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('All');
                        setSelectedAvailability('All');
                        setSelectedIndustry('All');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredUsers.map((user) => (
                      <ProfileCard
                        key={user.id}
                        user={user}
                        onViewProfile={onNavigateToUser}
                        onOpenMessage={onOpenMessage}
                        onRequestConnect={(u) => setConnectModalUser(u)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Connect Modal */}
      <ConnectModal
        targetUser={connectModalUser}
        isOpen={!!connectModalUser}
        onClose={() => setConnectModalUser(null)}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
};

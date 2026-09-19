import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserProfile, Community, Opportunity } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { CommunityCard } from '../components/CommunityCard';
import { OpportunityCard } from '../components/OpportunityCard';
import { ConnectModal } from '../components/ConnectModal';
import { SwipeMatchDeck } from '../components/SwipeMatchDeck';
import {
  Rocket,
  Flame,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';

interface StartupsPageProps {
  onViewProfile: (userId: string) => void;
  onViewCommunity: (commId: string) => void;
  onOpenMessage: (userId: string) => void;
  onExploreDirectory: (role?: string) => void;
}

export const StartupsPage: React.FC<StartupsPageProps> = ({
  onViewProfile,
  onViewCommunity,
  onOpenMessage,
  onExploreDirectory,
}) => {
  const [startups, setStartups] = useState<UserProfile[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [connectModalUser, setConnectModalUser] = useState<UserProfile | null>(null);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');

  useEffect(() => {
    api.getUsers().then((res) => {
      setStartups(
        res.users.filter((u) => u.role === 'Startup' || u.role === 'Founder')
      );
    });

    api.getCommunities().then((res) => {
      setCommunities(res.communities);
    });

    api.getOpportunities().then((res) => {
      setOpportunities(
        res.opportunities.filter(
          (o) =>
            o.type === 'Early Access' ||
            o.type === 'DevRel' ||
            o.targetAudiences.includes('Developers')
        )
      );
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      {/* Banner */}
      <div className="bg-gradient-to-b from-orange-950 via-slate-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>COMMUNITY-LED GROWTH & EARLY USERS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Find the communities where your users already are.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8">
            Acquire high-intent beta users, recruit technical evangelists, and partner directly with student developers and specialized practitioner groups.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-200 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Beta User Acquisition</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Developer Relations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Campus Activations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Founder Circles</span>
            </div>
          </div>

          {/* View Switcher Controls */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <button
              type="button"
              onClick={() => setViewMode('deck')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'deck'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Scroll Match Deck (Left = Reject, Right = Select)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-600" />
              <span>Directory Grid</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Match Deck Mode */}
        {viewMode === 'deck' && (
          <div>
            <SwipeMatchDeck
              title="Startup & Founder Match Deck"
              subtitle="Scroll trackpad or swipe cards: Left to Reject/Pass, Right to Select founders, technical co-founders, and beta testers."
              initialCategory="startups"
              allowedCategories={['startups', 'professionals', 'students', 'all']}
              onViewProfile={onViewProfile}
              onOpenMessage={onOpenMessage}
              onRequestConnect={(u) => setConnectModalUser(u)}
            />
          </div>
        )}

        {/* Directory Grid View */}
        {viewMode === 'grid' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-orange-600" />
                  <span>Featured Startups & Builders</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Early-stage companies launching beta access and welcoming community feedback.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onExploreDirectory('Startup')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Explore all startups</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {startups.slice(0, 4).map((s) => (
                <ProfileCard
                  key={s.id}
                  user={s}
                  onViewProfile={onViewProfile}
                  onOpenMessage={onOpenMessage}
                  onRequestConnect={(u) => setConnectModalUser(u)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Beta Programs & DevRel Opportunities */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Active Beta Programs & Evangelism
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Test frontier infrastructure and get direct access to founding engineering teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onApplyOrConnect={(o) => alert(`Joined ${o.title}! Founding team will reach out with early invite codes.`)}
              />
            ))}
          </div>
        </div>

        {/* Target Communities to Partner With */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>High-Density Target Communities</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Embed your product into active developer hubs and collegiate clubs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {communities.slice(0, 3).map((comm) => (
              <CommunityCard
                key={comm.id}
                community={comm}
                onViewCommunity={onViewCommunity}
              />
            ))}
          </div>
        </div>
      </div>

      <ConnectModal
        targetUser={connectModalUser}
        isOpen={!!connectModalUser}
        onClose={() => setConnectModalUser(null)}
        onSuccess={() => {}}
      />
    </div>
  );
};

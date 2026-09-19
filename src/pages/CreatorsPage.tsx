import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserProfile, Opportunity } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { OpportunityCard } from '../components/OpportunityCard';
import { ConnectModal } from '../components/ConnectModal';
import { SwipeMatchDeck } from '../components/SwipeMatchDeck';
import {
  Video,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  LayoutGrid,
} from 'lucide-react';

interface CreatorsPageProps {
  onViewProfile: (userId: string) => void;
  onOpenMessage: (userId: string) => void;
  onExploreDirectory: (role?: string) => void;
}

export const CreatorsPage: React.FC<CreatorsPageProps> = ({
  onViewProfile,
  onOpenMessage,
  onExploreDirectory,
}) => {
  const [creators, setCreators] = useState<UserProfile[]>([]);
  const [brands, setBrands] = useState<UserProfile[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [connectModalUser, setConnectModalUser] = useState<UserProfile | null>(null);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');

  useEffect(() => {
    api.getUsers().then((res) => {
      setCreators(res.users.filter((u) => u.role === 'Creator'));
      setBrands(res.users.filter((u) => u.role === 'Brand'));
    });

    api.getOpportunities().then((res) => {
      setOpportunities(
        res.opportunities.filter(
          (o) =>
            o.type === 'Brand Partnership' ||
            o.targetAudiences.includes('Creators') ||
            o.targetAudiences.includes('Brands')
        )
      );
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      {/* Banner */}
      <div className="bg-gradient-to-b from-pink-950 via-slate-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-xs font-bold mb-4">
            <Video className="w-4 h-4 text-pink-400" />
            <span>AUTHENTIC CREATOR DISCOVERY & BRAND SPONSORSHIP</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Turn relevant connections into meaningful collaborations.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8">
            Connect developer platforms with trusted technical video essayists, newsletter writers, and educators. Zero agency commissions; 100% direct alignment.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-200 mb-8">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
              <span>Direct Brand Partnerships</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Developer Campaign Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Milestone Agreement Chat</span>
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
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
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
              title="Creators & Brands Match Deck"
              subtitle="Scroll trackpad or swipe cards: Left to Reject/Pass, Right to Select creators, tech educators, and developer brands."
              initialCategory="creators"
              allowedCategories={['creators', 'brands', 'all']}
              onViewProfile={onViewProfile}
              onOpenMessage={onOpenMessage}
              onRequestConnect={(u) => setConnectModalUser(u)}
            />
          </div>
        )}

        {/* Directory Grid View */}
        {viewMode === 'grid' && (
          <>
            {/* Creators Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Video className="w-5 h-5 text-pink-600" />
                    <span>Technical Creators</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Video essayists, system educators, and developer voices building high-trust audiences.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onExploreDirectory('Creator')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Explore all creators</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {creators.map((c) => (
                  <ProfileCard
                    key={c.id}
                    user={c}
                    onViewProfile={onViewProfile}
                    onOpenMessage={onOpenMessage}
                    onRequestConnect={(u) => setConnectModalUser(u)}
                  />
                ))}
              </div>
            </div>

            {/* Brands Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>Developer Brands & Platforms</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Infrastructure companies seeking authentic developer education and hackathon sponsorships.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onExploreDirectory('Brand')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Explore all brands</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {brands.map((b) => (
                  <ProfileCard
                    key={b.id}
                    user={b}
                    onViewProfile={onViewProfile}
                    onOpenMessage={onOpenMessage}
                    onRequestConnect={(u) => setConnectModalUser(u)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Brand Sponsorship Opportunities */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>Sponsored Developer Campaigns</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Active developer tool grants and creator sponsorship calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onApplyOrConnect={(o) => alert(`Applied to sponsor campaign "${o.title}"! Brand will review your creator stats.`)}
              />
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>Developer Brands & Platforms</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Infrastructure companies seeking authentic developer education and hackathon sponsorships.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onExploreDirectory('Brand')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Explore all brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {brands.map((b) => (
              <ProfileCard
                key={b.id}
                user={b}
                onViewProfile={onViewProfile}
                onOpenMessage={onOpenMessage}
                onRequestConnect={(u) => setConnectModalUser(u)}
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

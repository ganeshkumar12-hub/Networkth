import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserProfile, ConnectionRecord, Community, Opportunity } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { CommunityCard } from '../components/CommunityCard';
import { OpportunityCard } from '../components/OpportunityCard';
import { ConnectModal } from '../components/ConnectModal';
import {
  Users,
  UserCheck,
  Clock,
  Check,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Compass,
  GraduationCap,
  Rocket,
  Briefcase,
  Flame,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateToUser: (userId: string) => void;
  onNavigateToCommunity: (commId: string) => void;
  onOpenMessage: (userId: string) => void;
  onExploreDirectory: (role?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToUser,
  onNavigateToCommunity,
  onOpenMessage,
  onExploreDirectory,
}) => {
  const { user, openAuthModal } = useAuth();
  const [connections, setConnections] = useState<UserProfile[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Array<ConnectionRecord & { user: UserProfile }>>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<Array<ConnectionRecord & { user: UserProfile }>>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<UserProfile[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'connections' | 'requests'>('overview');
  const [connectModalUser, setConnectModalUser] = useState<UserProfile | null>(null);

  const loadDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [connRes, allUsersRes, commRes, oppRes] = await Promise.all([
        api.getConnections(),
        api.getUsers(),
        api.getCommunities(),
        api.getOpportunities(),
      ]);

      setConnections(connRes.connected.map((c) => c.user));
      setIncomingRequests(connRes.pendingReceived);
      setOutgoingRequests(connRes.pendingSent);
      setCommunities(commRes.communities);
      setOpportunities(oppRes.opportunities);

      // Synergy recommendation logic based on user role
      const potentialMatches = allUsersRes.users.filter((u) => u.id !== user.id);
      let targeted: UserProfile[] = [];

      if (user.role === 'Student') {
        targeted = potentialMatches.filter((u) => u.role === 'Working Professional' || u.role === 'Founder');
      } else if (user.role === 'Working Professional') {
        targeted = potentialMatches.filter((u) => u.role === 'Student' || u.role === 'Startup');
      } else if (user.role === 'Founder' || user.role === 'Startup') {
        targeted = potentialMatches.filter((u) => u.role === 'Developer' || u.role === 'Creator' || u.role === 'Student');
      } else if (user.role === 'Creator') {
        targeted = potentialMatches.filter((u) => u.role === 'Brand' || u.role === 'Startup');
      } else if (user.role === 'Brand') {
        targeted = potentialMatches.filter((u) => u.role === 'Creator' || u.role === 'Community');
      } else {
        targeted = potentialMatches;
      }

      setRecommendedUsers(targeted.slice(0, 4));
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.respondToConnection(requestId, 'accept');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to accept request');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await api.respondToConnection(requestId, 'reject');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to decline request');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafbfd] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full text-center shadow-sm">
          <Sparkles className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Log in to view Dashboard</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Manage your incoming mentorship requests, startup connections, and real-time network messages.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Log In to Networkth
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Welcome back, {user.name}
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {user.headline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToUser(user.id)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
              >
                View Public Profile
              </button>
              <button
                type="button"
                onClick={() => onExploreDirectory()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Directory</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">Connections</span>
                <UserCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {connections.length}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                Active reciprocal network
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">Pending Requests</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {incomingRequests.length}
              </div>
              <div className="text-[10px] text-amber-600 font-medium mt-0.5">
                {incomingRequests.length > 0 ? 'Action required' : 'Up to date'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">Communities</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {user.communities?.length || 0}
              </div>
              <div className="text-[10px] text-indigo-600 font-medium mt-0.5">
                Active discussion hubs
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold">Profile Views</span>
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                128
              </div>
              <div className="text-[10px] text-purple-600 font-medium mt-0.5">
                +24% this week
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-4 mt-8 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Synergy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('connections')}
              className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                activeTab === 'connections'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              My Network ({connections.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Pending Requests</span>
              {incomingRequests.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {incomingRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Incoming requests alert banner if any */}
            {incomingRequests.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      You have {incomingRequests.length} incoming connection request{incomingRequests.length > 1 ? 's' : ''}!
                    </h4>
                    <p className="text-[11px] text-amber-700">
                      Respond to build meaningful connections.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('requests')}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  Review Requests
                </button>
              </div>
            )}

            {/* Role-tailored Recommended Matches */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Recommended Matches for {user.role}s</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-synergy connections matched for your profile goals.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onExploreDirectory()}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Explore all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recommendedUsers.map((recUser) => (
                  <ProfileCard
                    key={recUser.id}
                    user={recUser}
                    onViewProfile={onNavigateToUser}
                    onOpenMessage={onOpenMessage}
                    onRequestConnect={(u) => setConnectModalUser(u)}
                  />
                ))}
              </div>
            </div>

            {/* Active Opportunities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Opportunities & Collaboration Calls
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mentorship slots, brand campaigns, and early-access beta tester programs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {opportunities.slice(0, 3).map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onApplyOrConnect={(o) => {
                      alert(`Applying to "${o.title}". The creator ${o.creatorName} has been notified!`);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* My Active Communities */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Your Community Hubs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {communities.slice(0, 3).map((comm) => (
                  <CommunityCard
                    key={comm.id}
                    community={comm}
                    onViewCommunity={onNavigateToCommunity}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONNECTIONS TAB */}
        {activeTab === 'connections' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Connected Members ({connections.length})
              </h3>
              <button
                type="button"
                onClick={() => onExploreDirectory()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Find More Connections
              </button>
            </div>

            {connections.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center max-w-md mx-auto">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-800">No connections yet</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                  Start connecting with students, mentors, founders, and creators in the discovery directory.
                </p>
                <button
                  type="button"
                  onClick={() => onExploreDirectory()}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors"
                >
                  Browse Discovery Directory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {connections.map((c) => (
                  <ProfileCard
                    key={c.id}
                    user={{ ...c, connectionStatus: 'connected' }}
                    onViewProfile={onNavigateToUser}
                    onOpenMessage={onOpenMessage}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div className="space-y-8">
            {/* Incoming Requests */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>Incoming Connection Requests</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                  {incomingRequests.length}
                </span>
              </h3>

              {incomingRequests.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                  No incoming connection requests right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={req.user.avatar}
                          alt={req.user.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              onClick={() => onNavigateToUser(req.user.id)}
                              className="text-xs font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                            >
                              {req.user.name}
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {req.user.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 max-w-xl">
                            {req.user.headline}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Requested {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(req.id)}
                          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineRequest(req.id)}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outgoing Requests */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>Sent Requests (Awaiting Acceptance)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {outgoingRequests.length}
                </span>
              </h3>

              {outgoingRequests.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                  You haven't sent any pending requests.
                </div>
              ) : (
                <div className="space-y-3">
                  {outgoingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={req.user.avatar}
                          alt={req.user.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {req.user.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {req.user.role}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Pending response
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConnectModal
        targetUser={connectModalUser}
        isOpen={!!connectModalUser}
        onClose={() => setConnectModalUser(null)}
        onSuccess={() => loadDashboardData()}
      />
    </div>
  );
};

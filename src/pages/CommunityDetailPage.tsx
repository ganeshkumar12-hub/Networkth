import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Community, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { ProfileCard } from '../components/ProfileCard';
import { ConnectModal } from '../components/ConnectModal';
import {
  Users,
  MessageSquare,
  Check,
  Plus,
  Send,
  Sparkles,
  ArrowLeft,
  Calendar,
  Layers,
  Share2,
} from 'lucide-react';

interface CommunityDetailPageProps {
  communityId: string;
  onBack: () => void;
  onViewUser: (userId: string) => void;
  onOpenMessage: (userId: string) => void;
}

export const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({
  communityId,
  onBack,
  onViewUser,
  onOpenMessage,
}) => {
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [discussions, setDiscussions] = useState<
    Array<{
      id: string;
      authorName: string;
      authorRole: string;
      authorAvatar: string;
      text: string;
      createdAt: string;
    }>
  >([]);
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [activeTab, setActiveTab] = useState<'discussions' | 'members'>('discussions');
  const [isLoading, setIsLoading] = useState(true);
  const [connectModalUser, setConnectModalUser] = useState<UserProfile | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const commRes = await api.getCommunityById(communityId);
      setCommunity(commRes.community);

      // Check joined
      if (user && user.communities.includes(commRes.community.name)) {
        setIsJoined(true);
      }

      // Fetch all users to filter members
      const usersRes = await api.getUsers();
      const commMembers = usersRes.users.filter((u) =>
        u.communities.includes(commRes.community.name)
      );
      setMembers(commMembers);

      // Default mock discussions
      setDiscussions([
        {
          id: 'disc-1',
          authorName: commMembers[0]?.name || 'Elena Rostova',
          authorRole: commMembers[0]?.role || 'Founder',
          authorAvatar: commMembers[0]?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          text: `Welcome to ${commRes.community.name}! We're organizing a community AMA session next Thursday discussing practical production deployments. What topics should we prioritize?`,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'disc-2',
          authorName: commMembers[1]?.name || 'David Vance',
          authorRole: commMembers[1]?.role || 'Working Professional',
          authorAvatar: commMembers[1]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          text: `Happy to offer architectural reviews for any student projects or startup MVPs posted in this hub over the weekend!`,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ]);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [communityId, user]);

  const handleToggleJoin = async () => {
    if (!user) {
      alert('Please log in to join this community.');
      return;
    }
    if (!community) return;

    try {
      const res = await api.toggleJoinCommunity(community.id);
      setIsJoined(res.joined);
      setCommunity((prev) =>
        prev ? { ...prev, memberCount: res.memberCount } : prev
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update membership');
    }
  };

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !user) return;

    setIsPosting(true);
    const newEntry = {
      id: `disc-${Date.now()}`,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      text: newPostText.trim(),
      createdAt: new Date().toISOString(),
    };

    setDiscussions([newEntry, ...discussions]);
    setNewPostText('');
    setIsPosting(false);
  };

  if (isLoading || !community) {
    return (
      <div className="min-h-screen bg-[#fafbfd] flex items-center justify-center p-8">
        <div className="text-center text-slate-400 text-xs">
          <Sparkles className="w-6 h-6 text-indigo-500 animate-spin mx-auto mb-2" />
          Loading community hub...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      {/* Back button */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 mb-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to directory</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Banner Header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden mb-6">
          <div
            className={`h-40 sm:h-52 w-full bg-gradient-to-r ${community.bannerGradient} relative p-6 flex items-start justify-between`}
          >
            <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
              {community.category}
            </span>
          </div>

          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
              <div className="flex items-end gap-4">
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-md bg-white shrink-0"
                />
                <div className="pb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {community.name}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{community.memberCount.toLocaleString()} members</span>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <button
                type="button"
                onClick={handleToggleJoin}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  isJoined
                    ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isJoined ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Joined Community</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Join Community</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl mb-4">
              {community.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-xl"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('discussions')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'discussions'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Discussions & Posts ({discussions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === 'members'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Members in this Hub ({members.length})
          </button>
        </div>

        {/* Discussions Tab Content */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            {/* Create Post Form */}
            {user ? (
              <form
                onSubmit={handlePostDiscussion}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      rows={2}
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      placeholder={`Share an update, ask a technical question, or start a collaboration in ${community.name}...`}
                      className="w-full text-xs text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={isPosting || !newPostText.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post to Community</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800 flex items-center justify-between">
                <span>Join or log in to participate in {community.name} discussions.</span>
              </div>
            )}

            {/* Post feed */}
            <div className="space-y-4">
              {discussions.map((disc) => (
                <div
                  key={disc.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={disc.authorAvatar}
                        alt={disc.authorName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {disc.authorName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {disc.authorRole}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(disc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {disc.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab Content */}
        {activeTab === 'members' && (
          <div>
            {members.length === 0 ? (
              <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
                No members found in this community yet. Be the first to join!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {members.map((m) => (
                  <ProfileCard
                    key={m.id}
                    user={m}
                    onViewProfile={onViewUser}
                    onOpenMessage={onOpenMessage}
                    onRequestConnect={(u) => setConnectModalUser(u)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ConnectModal
        targetUser={connectModalUser}
        isOpen={!!connectModalUser}
        onClose={() => setConnectModalUser(null)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};

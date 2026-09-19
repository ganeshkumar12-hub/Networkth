import React, { useState } from 'react';
import { Community } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Users, ArrowUpRight, Check, Plus } from 'lucide-react';

interface CommunityCardProps {
  community: Community;
  onViewCommunity?: (communityId: string) => void;
  className?: string;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onViewCommunity,
  className = '',
}) => {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(
    user ? user.communities.includes(community.name) : false
  );
  const [memberCount, setMemberCount] = useState(community.memberCount);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleJoinToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to join communities.');
      return;
    }

    try {
      setIsUpdating(true);
      const res = await api.toggleJoinCommunity(community.id);
      setIsJoined(res.joined);
      setMemberCount(res.memberCount);
    } catch (err: any) {
      alert(err.message || 'Failed to update community membership');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      onClick={() => onViewCommunity && onViewCommunity(community.id)}
      className={`group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div>
        {/* Banner Gradient */}
        <div className={`h-16 w-full bg-gradient-to-r ${community.bannerGradient || 'from-indigo-600 to-purple-600'} relative p-3 flex items-start justify-between`}>
          <span className="bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
            {community.category}
          </span>
          <ArrowUpRight className="w-4 h-4 text-white/70 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {/* Community Info */}
        <div className="p-4 pt-3">
          <div className="flex items-center gap-3 mb-2 -mt-7">
            <img
              src={community.avatar}
              alt={community.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm shrink-0 bg-white"
            />
            <div className="pt-4 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                {community.name}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{memberCount.toLocaleString()} members</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
            {community.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {community.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="p-4 pt-0 mt-2">
        <button
          type="button"
          onClick={handleJoinToggle}
          disabled={isUpdating}
          className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            isJoined
              ? 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
          }`}
        >
          {isJoined ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Joined
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Join Community
            </>
          )}
        </button>
      </div>
    </div>
  );
};

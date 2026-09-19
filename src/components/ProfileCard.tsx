import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  MapPin,
  Check,
  Clock,
  UserPlus,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface ProfileCardProps {
  user: UserProfile & { connectionStatus?: 'none' | 'pending' | 'received' | 'connected' };
  onViewProfile?: (userId: string) => void;
  onOpenMessage?: (userId: string) => void;
  onRequestConnect?: (user: UserProfile) => void;
  className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onViewProfile,
  onOpenMessage,
  onRequestConnect,
  className = '',
}) => {
  const { user: currentUser } = useAuth();
  const [status, setStatus] = useState<'none' | 'pending' | 'received' | 'connected'>(
    user.connectionStatus || 'none'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    Student: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Working Professional': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    Founder: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    Startup: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    Creator: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    Brand: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Developer: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    Community: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Mentor / Industry Expert': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  };

  const badgeStyle = roleColors[user.role] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  const isMe = currentUser?.id === user.id;

  const handleQuickConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      alert('Please log in to connect.');
      return;
    }
    if (onRequestConnect) {
      onRequestConnect(user);
      return;
    }

    try {
      setIsSubmitting(true);
      await api.requestConnection(user.id, 'Hi, I saw your profile on Networkth and would love to connect!');
      setStatus('pending');
    } catch (err: any) {
      alert(err.message || 'Failed to send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => onViewProfile && onViewProfile(user.id)}
      className={`group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div>
        {/* Header: Avatar + Role Badge + Availability */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs"
            />
            {user.availability === 'Open to Connect' && (
              <span
                title="Open to Connect"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
              />
            )}
            {user.availability === 'Mentoring' && (
              <span
                title="Active Mentor"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 border-2 border-white rounded-full"
              />
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
            >
              {user.role}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {user.availability}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-2">
          <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
            <span>{user.name}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </h4>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {user.headline}
          </p>
        </div>

        {/* Location & Industry */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[110px]">{user.location}</span>
          </span>
          <span>•</span>
          <span className="truncate max-w-[120px]">{user.industry}</span>
        </div>

        {/* Skills preview */}
        {user.skills && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {user.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-medium text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {user.skills.length > 3 && (
              <span className="text-[10px] text-slate-400 py-0.5 px-1 font-medium">
                +{user.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        {!isMe ? (
          <>
            {status === 'connected' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenMessage && onOpenMessage(user.id);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                Message
              </button>
            ) : status === 'pending' ? (
              <button
                type="button"
                disabled
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold cursor-default"
              >
                <Clock className="w-3.5 h-3.5" />
                Pending
              </button>
            ) : status === 'received' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile && onViewProfile(user.id);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Respond
              </button>
            ) : (
              <button
                type="button"
                onClick={handleQuickConnect}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {isSubmitting ? 'Sending...' : 'Connect'}
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMessage && onOpenMessage(user.id);
              }}
              title="Send a direct message"
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full text-center py-1.5 text-xs font-medium text-slate-400 bg-slate-50 rounded-xl">
            This is you
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { X, Send, Sparkles } from 'lucide-react';

interface ConnectModalProps {
  targetUser: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  targetUser,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !targetUser) return null;

  const defaultSuggestedNotes: Record<string, string> = {
    Student: `Hi ${targetUser.name}, I noticed your background in ${targetUser.skills[0] || 'tech'} and would love to connect to discuss industry paths and learn from each other!`,
    'Working Professional': `Hi ${targetUser.name}, I admire your engineering work at ${targetUser.experience[0]?.company || 'your company'} and would value connecting to exchange thoughts on ${targetUser.industry || 'tech'}.`,
    Founder: `Hi ${targetUser.name}, congratulations on building ${targetUser.experience[0]?.company || 'your startup'}! Would love to connect and follow your journey.`,
    Startup: `Hi ${targetUser.name}, interested in your product launch and would love to stay connected as early testers or partners.`,
    Creator: `Hi ${targetUser.name}, really enjoy your content on ${targetUser.industry}. Would love to connect for potential collaborations!`,
    Brand: `Hi ${targetUser.name}, interested in your developer campaigns and community sponsorship opportunities.`,
  };

  const handleUsePreset = () => {
    const preset = defaultSuggestedNotes[targetUser.role] || `Hi ${targetUser.name}, I would love to connect with you on Networkth!`;
    setNote(preset);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.requestConnection(targetUser.id, note.trim() || undefined);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send connection request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <img
            src={targetUser.avatar}
            alt={targetUser.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-xs"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Connect with {targetUser.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              {targetUser.headline}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Personalized Note (Optional)
            </label>
            <button
              type="button"
              onClick={handleUsePreset}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Use prompt template
            </button>
          </div>

          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Introduce yourself and share why you want to connect (e.g., mentorship, campaign collaboration, early feedback)..."
            className="w-full text-xs text-slate-800 border border-slate-200 rounded-2xl p-3.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4 resize-none leading-relaxed placeholder:text-slate-400"
          />

          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

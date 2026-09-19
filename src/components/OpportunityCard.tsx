import React from 'react';
import { Opportunity } from '../types';
import { Tag, MapPin, ArrowRight } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onApplyOrConnect?: (opp: Opportunity) => void;
  className?: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onApplyOrConnect,
  className = '',
}) => {
  const typeStyles: Record<string, { bg: string; text: string; border: string }> = {
    Mentorship: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    'Brand Partnership': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Early Access': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    DevRel: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Campus Activation': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Collaboration: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  };

  const style = typeStyles[opportunity.type] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}
          >
            {opportunity.type}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {opportunity.location}
          </span>
        </div>

        <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
          {opportunity.title}
        </h4>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {opportunity.description}
        </p>

        {/* Creator Info */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 mb-4">
          <img
            src={opportunity.creatorAvatar}
            alt={opportunity.creatorName}
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 truncate">
              {opportunity.creatorName}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {opportunity.creatorRole}
            </div>
          </div>
        </div>

        {/* Target Audience Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 self-center mr-1">
            <Tag className="w-3 h-3" />
            For:
          </span>
          {opportunity.targetAudiences.map((aud) => (
            <span
              key={aud}
              className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
            >
              {aud}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onApplyOrConnect && onApplyOrConnect(opportunity)}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
      >
        <span>{opportunity.linkText || 'Connect & Explore'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

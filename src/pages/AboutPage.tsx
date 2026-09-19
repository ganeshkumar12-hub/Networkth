import React from 'react';
import {
  Sparkles,
  Target,
  Users,
  Compass,
  CheckCircle2,
  Heart,
  Globe2,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      <div className="bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OUR MISSION & THESIS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            The right people already exist.
          </h1>
          <p className="text-lg sm:text-xl font-medium text-indigo-600 mb-6">
            “Finding and connecting with the right ones is the difficult part.”
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Networkth was created to solve the fragmented discovery problem across LinkedIn, Instagram, WhatsApp groups, college communities, events, startup communities, creator networks, and personal contacts.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        {/* Core Positioning */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>What Networkth Is (and Isn't)</span>
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-900">Networkth is NOT trying to replace LinkedIn.</strong> LinkedIn functions as a digital resume repository and general corporate directory. But finding high-signal peers who actually match your current goal — whether that is finding a distributed systems mentor, booking early testers for your AI product, or discovering developer-centric creator partnerships — is virtually impossible through algorithmic news feeds.
            </p>
            <p>
              Our core value proposition is:
            </p>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 font-bold text-sm text-center">
              RELEVANT DISCOVERY + MEANINGFUL CONNECTION
            </div>
            <p>
              Every profile on Networkth specifies what they are building, their explicit role archetype, and who they are seeking to connect with.
            </p>
          </div>
        </div>

        {/* The 5-Step Value Engine */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <span>The Core Value Engine</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
            {[
              { step: 'Discover', desc: 'Find relevant people and communities without noise' },
              { step: 'Connect', desc: 'Start contextual conversations with personal synergy notes' },
              { step: 'Collaborate', desc: 'Work together around common technical and startup goals' },
              { step: 'Create Value', desc: 'Exchange knowledge, feedback, and resources bidirectionally' },
              { step: 'Opportunity', desc: 'Turn connections into real outcomes and partnerships' },
            ].map((item, i) => (
              <div
                key={item.step}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 block mb-1">
                    0{i + 1}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mb-1.5">{item.step}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Principles */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Our Principles</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Context Over Cold Outreaches</strong>
                <span>Requests require intent and alignment, eliminating automated spam.</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Reciprocal Value Creation</strong>
                <span>Networking thrives when both parties provide genuine, mutual benefit.</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Democratizing Access</strong>
                <span>Collegiate students deserve equal access to senior mentors and founders.</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Ecosystem Transparency</strong>
                <span>Direct brand-to-creator and startup-to-community relationships without middlemen.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

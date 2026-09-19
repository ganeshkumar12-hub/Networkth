import React from 'react';
import {
  Compass,
  MessageSquare,
  Handshake,
  Lightbulb,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface HowItWorksPageProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onGetStarted,
  onExplore,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      tagline: 'Find relevant people and communities.',
      description:
        'Instead of broad algorithmic feeds, Networkth is structured by direct role synergy. Whether you are a student looking for a systems mentor, a founder recruiting early adopters, or a brand discovering technical creators, find the exact match.',
      icon: Compass,
      color: 'bg-blue-600',
    },
    {
      num: '02',
      title: 'Connect',
      tagline: 'Start meaningful conversations.',
      description:
        'Reach out with contextual connection requests that include personalized synergy notes. No cold copy-paste sales templates; every connection is grounded in mutual value.',
      icon: MessageSquare,
      color: 'bg-indigo-600',
    },
    {
      num: '03',
      title: 'Collaborate',
      tagline: 'Work together around common goals.',
      description:
        'Build together. Form hackathon teams, book 1-on-1 career navigation calls, exchange code reviews, or agree on sponsored developer content deliverables.',
      icon: Handshake,
      color: 'bg-purple-600',
    },
    {
      num: '04',
      title: 'Create Value',
      tagline: 'Exchange knowledge, resources and opportunities.',
      description:
        'Value flows bidirectionally. Senior engineers give guidance and receive fresh perspectives; startups get early feedback and provide students with portfolio-grade experience.',
      icon: Lightbulb,
      color: 'bg-amber-600',
    },
    {
      num: '05',
      title: 'Opportunity',
      tagline: 'Turn connections into real outcomes.',
      description:
        'Networkth connections translate into real-world career advancements, angel investments, full-time offers, high-impact creator campaigns, and long-term professional relationships.',
      icon: Trophy,
      color: 'bg-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      <div className="bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE NETWORKTH METHOD</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            How Networkth Works
          </h1>
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
            From fragmented discovery across 8 different apps to a structured 5-step flow designed for meaningful professional connection.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-start gap-8"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
              >
                <Icon className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 text-indigo-600 font-mono text-xs font-bold uppercase mb-1">
                  <span>Step {s.num}</span>
                  <span>•</span>
                  <span>{s.tagline}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div className="p-10 rounded-3xl bg-slate-900 text-white text-center">
          <h3 className="text-2xl font-extrabold mb-3">
            Ready to experience purposeful networking?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-md mx-auto">
            Join students, founders, staff engineers, and tech creators on Networkth.
          </p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={onExplore}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Explore Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

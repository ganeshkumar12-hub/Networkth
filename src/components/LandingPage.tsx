import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NetworkVisualization } from './NetworkVisualization';
import { HorizontalCarousel } from './HorizontalCarousel';
import { initialUsers, initialCommunities } from '../../server/seedData';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Rocket,
  Flame,
  Code2,
  Video,
  Building2,
  Users,
  Compass,
  MessageSquare,
  Handshake,
  Lightbulb,
  Trophy,
  CheckCircle2,
  Share2,
  Globe2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string, param?: string) => void;
  onOpenConnectModal?: (user: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
}) => {
  const { openAuthModal } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [activeCoreIndex, setActiveCoreIndex] = useState(0);

  // 9A: Network Types Data
  const networkTypes = [
    {
      role: 'Students',
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-600',
      headline: 'Aspiring builders & researchers',
      description: 'Discover mentors, land early startup collaborations, and build a network before graduating.',
      tag: 'Talent & Aspirants',
      filterRole: 'Student',
    },
    {
      role: 'Working Professionals',
      icon: Briefcase,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      iconBg: 'bg-sky-600',
      headline: 'Senior engineers & directors',
      description: 'Mentor the next generation, discover early-stage advisory opportunities, and share technical knowledge.',
      tag: 'Industry Leaders',
      filterRole: 'Working Professional',
    },
    {
      role: 'Founders',
      icon: Rocket,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-600',
      headline: 'Early-stage builders & visionaries',
      description: 'Meet compatible technical co-founders, early evangelists, and industry advisors.',
      tag: 'Builders',
      filterRole: 'Founder',
    },
    {
      role: 'Startups',
      icon: Flame,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      iconBg: 'bg-orange-600',
      headline: 'Venture products finding traction',
      description: 'Find active developer communities, recruit early beta adopters, and scale product feedback.',
      tag: 'Ecosystems',
      filterRole: 'Startup',
    },
    {
      role: 'Developers',
      icon: Code2,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-600',
      headline: 'Systems hackers & builders',
      description: 'Connect with open-source maintainers, discover high-caliber engineering teams, and explore DevRel.',
      tag: 'Craft',
      filterRole: 'Developer',
    },
    {
      role: 'Creators',
      icon: Video,
      color: 'bg-pink-50 text-pink-700 border-pink-200',
      iconBg: 'bg-pink-600',
      headline: 'Tech media & video essayists',
      description: 'Discover developer-first brands, secure authentic sponsorship campaigns, and grow high-trust audiences.',
      tag: 'Media Voices',
      filterRole: 'Creator',
    },
    {
      role: 'Brands',
      icon: Building2,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-600',
      headline: 'Developer platforms & sponsors',
      description: 'Directly discover niche technical creators and collegiate hackathons with zero agency overhead.',
      tag: 'Sponsors',
      filterRole: 'Brand',
    },
    {
      role: 'Communities',
      icon: Users,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-600',
      headline: 'Collegiate & niche tech circles',
      description: 'Partner with frontier startups, host founder sessions, and deliver high-value opportunities to members.',
      tag: 'Growth Hubs',
      filterRole: 'Community',
    },
  ];

  // 9B: Use Cases Data
  const useCases = [
    {
      title: 'Mentorship',
      icon: Compass,
      desc: 'Structured 1-on-1 career path guidance between senior industry leads and hungry students.',
      color: 'border-teal-200 bg-teal-50/50',
      cta: 'Explore Mentors',
      tab: 'students',
    },
    {
      title: 'Community Discovery',
      icon: Globe2,
      desc: 'Uncover high-density specialized hubs across AI, Systems, Web, and Campus Hackathons.',
      color: 'border-blue-200 bg-blue-50/50',
      cta: 'Browse Hubs',
      tab: 'communities',
    },
    {
      title: 'Beta Users',
      icon: Flame,
      desc: 'Connect your product directly with early technical adopters eager to test frontier software.',
      color: 'border-orange-200 bg-orange-50/50',
      cta: 'Find Beta Testers',
      tab: 'startups',
    },
    {
      title: 'Product Feedback',
      icon: MessageSquare,
      desc: 'Get genuine, deep architectural and UX feedback from engineers who actually use your stack.',
      color: 'border-indigo-200 bg-indigo-50/50',
      cta: 'Request Feedback',
      tab: 'startups',
    },
    {
      title: 'Founder Networking',
      icon: Rocket,
      desc: 'Peer-to-peer founder circles sharing playbooks on fundraising, product launches, and hiring.',
      color: 'border-purple-200 bg-purple-50/50',
      cta: 'Join Founders',
      tab: 'discover',
    },
    {
      title: 'Creator Partnerships',
      icon: Video,
      desc: 'Direct matchmaking between tech brands and creators for authentic tutorial sponsorships.',
      color: 'border-pink-200 bg-pink-50/50',
      cta: 'Discover Creators',
      tab: 'creators',
    },
    {
      title: 'Campus Activations',
      icon: GraduationCap,
      desc: 'Engage top collegiate CS clubs and hackathons with official grants, APIs, and swags.',
      color: 'border-sky-200 bg-sky-50/50',
      cta: 'Launch on Campus',
      tab: 'students',
    },
    {
      title: 'Developer Relations',
      icon: Code2,
      desc: 'Cultivate grassroots dev advocates and technical ambassadors around your open source tools.',
      color: 'border-emerald-200 bg-emerald-50/50',
      cta: 'Explore DevRel',
      tab: 'startups',
    },
    {
      title: 'Community-Led Growth',
      icon: Users,
      desc: 'Distribute products organically by embedding value directly into niche practitioner groups.',
      color: 'border-amber-200 bg-amber-50/50',
      cta: 'Connect With Hubs',
      tab: 'communities',
    },
  ];

  // 9C: Core Networks Prominent Carousel Data
  const coreNetworks = [
    {
      title: 'Students ↔ Working Professionals',
      badge: 'Mentorship & Career Pipeline',
      headline: 'Turn academic potential into high-velocity industry impact.',
      description: 'Bridging ambitious students with senior staff engineers and directors. Zero cold LinkedIn spam; only genuine knowledge transfer and high-trust referrals.',
      useCases: [
        '1-on-1 technical roadmap & mock interview sessions',
        'Direct career advice from practitioners at Stripe, Google, and Figma',
        'Research-to-production publication feedback',
        'High-context internship and junior engineering opportunities',
      ],
      primaryCTA: 'Explore Student & Mentor Network',
      targetTab: 'students',
      accentColor: 'from-blue-600 via-indigo-600 to-sky-600',
      stats: '4,200+ Mentorship Sessions Completed',
      sampleUsers: [
        { name: 'David Vance', role: 'Principal Eng @ Stripe', avatar: initialUsers[1].avatar },
        { name: 'Maya Chen', role: 'CS Senior @ Stanford', avatar: initialUsers[2].avatar },
        { name: 'Sarah Jenkins', role: 'VP Design @ Moneta', avatar: initialUsers[6].avatar },
      ],
    },
    {
      title: 'Brands ↔ Creators',
      badge: 'Authentic Reach & Value Creation',
      headline: 'Direct brand collaborations without agency middlemen.',
      description: 'Modern developer platforms and developer tools connect directly with trusted technical video essayists, newsletter writers, and educators.',
      useCases: [
        'Developer tool walkthroughs and benchmark video essays',
        'Sponsored hackathon challenges and live streaming builds',
        'Transparent audience demographic and tech stack alignment',
        'Milestone-based campaign management and direct messaging',
      ],
      primaryCTA: 'Explore Creator & Brand Hub',
      targetTab: 'creators',
      accentColor: 'from-pink-600 via-rose-600 to-purple-600',
      stats: '$340k+ Transacted in Creator Collaborations',
      sampleUsers: [
        { name: 'Alex Rivera', role: 'Tech Creator (480K)', avatar: initialUsers[3].avatar },
        { name: 'Lumina Cloud', role: 'Developer Platform', avatar: initialUsers[4].avatar },
      ],
    },
    {
      title: 'Startups ↔ Target Communities',
      badge: 'Community-Led Growth & Feedback',
      headline: 'Find where your future power users already gather.',
      description: 'Stop shouting into empty social feeds. Embed your product directly inside passionate collegiate clubs, AI developer networks, and open-source guilds.',
      useCases: [
        'Fast early beta user onboarding with direct Slack/Discord channels',
        'Community founder AMA sessions and product teardowns',
        'Grassroots developer advocacy and SDK feedback loops',
        'Collegiate hackathon sponsorships and developer grants',
      ],
      primaryCTA: 'Discover Startup Opportunities',
      targetTab: 'startups',
      accentColor: 'from-orange-600 via-amber-600 to-rose-600',
      stats: '180+ Startups Launched to Communities',
      sampleUsers: [
        { name: 'Elena Rostova', role: 'Founder @ SynthAI', avatar: initialUsers[0].avatar },
        { name: 'PulseMetrics', role: 'Observability SaaS', avatar: initialUsers[7].avatar },
      ],
    },
  ];

  // 8: How It Works Steps
  const howItWorksSteps = [
    {
      number: '01',
      title: 'Discover',
      tagline: 'Find relevant people and communities.',
      description: 'Filter through verified profiles tailored to your role. Whether you are a student seeking a distributed systems mentor or a founder recruiting beta testers, discover exactly who matters.',
      icon: Compass,
      metric: 'Over 80+ niche engineering & creator categories',
    },
    {
      number: '02',
      title: 'Connect',
      tagline: 'Start meaningful conversations.',
      description: 'Send high-context connection requests with personalized synergy notes. No unsolicited marketing spam or cold sales pitches.',
      icon: MessageSquare,
      metric: '82% connection acceptance rate across verified roles',
    },
    {
      number: '03',
      title: 'Collaborate',
      tagline: 'Work together around common goals.',
      description: 'Form study circles, launch joint open-source projects, book 1-on-1 mentorship calls, or sponsor creator video walkthroughs.',
      icon: Handshake,
      metric: 'Real-time collaborative messaging & discussion hubs',
    },
    {
      number: '04',
      title: 'Create Value',
      tagline: 'Exchange knowledge, resources and opportunities.',
      description: 'Trade deep architectural feedback for product access, offer mentorship in exchange for fresh perspectives, or share sponsored tools with students.',
      icon: Lightbulb,
      metric: 'Reciprocal synergy engineered for mutual benefit',
    },
    {
      number: '05',
      title: 'Opportunity',
      tagline: 'Turn connections into real outcomes.',
      description: 'Connections evolve into internships, angel investments, full-time offers, high-impact campaigns, and sticky product adoption.',
      icon: Trophy,
      metric: 'Hundreds of documented career & startup milestones',
    },
  ];

  return (
    <div className="w-full bg-[#fafbfd] text-slate-900 overflow-hidden">
      {/* ========================================================
          6. HERO SECTION
          ======================================================== */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-6 tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>THE PROFESSIONAL DISCOVERY NETWORK</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] mb-6">
              Meet the Right People.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 bg-clip-text text-transparent">
                Create the Right Opportunities.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              Networkth helps you discover and connect with relevant people, communities, creators, professionals and startups — <span className="font-semibold text-slate-800">without the noise</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-10">
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('discover')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-sm border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
              >
                Explore Networkth
              </button>
            </div>

            {/* Micro stats / Trust proof */}
            <div className="pt-6 border-t border-slate-200/70 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>9 Curated Profile Types</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Verified Direct Synergy</span>
              </div>
              <div className="flex items-center gap-2 hidden sm:flex">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>No Cold Spam</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Network Visualization */}
          <div className="lg:col-span-6 flex justify-center">
            <NetworkVisualization />
          </div>
        </div>
      </section>

      {/* ========================================================
          7. PROBLEM SECTION
          ======================================================== */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-indigo-900/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold font-mono tracking-widest text-indigo-400 uppercase mb-3 block">
              The Fundamental Disconnect
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
              Networking isn’t broken.{' '}
              <span className="text-indigo-400">Discovery is.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              The right people already exist. Finding and connecting with the right ones is the difficult part. Today, high-value discovery is scattered across an endless maze of fragmented channels:
            </p>
          </div>

          {/* Fragmented Channels Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-16">
            {[
              { name: 'LinkedIn', desc: 'Overloaded with sales inboxes and algorithmic hype' },
              { name: 'Instagram', desc: 'Visual media with low professional context' },
              { name: 'WhatsApp Groups', desc: 'Chaotic messages lost in unsearchable threads' },
              { name: 'College Clubs', desc: 'Isolated bubbles with limited industry reach' },
              { name: 'Tech Events', desc: 'Fleeting business cards and awkward small-talk' },
              { name: 'Startup Communities', desc: 'Scattered across 50+ closed Slack servers' },
              { name: 'Creator Networks', desc: 'Expensive agency middlemen taking 30%' },
              { name: 'Personal Contacts', desc: 'Constrained only to immediate first-degree ties' },
            ].map((channel) => (
              <div
                key={channel.name}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {channel.name}
                </div>
                <div className="text-[11px] text-slate-400 leading-normal">
                  {channel.desc}
                </div>
              </div>
            ))}
          </div>

          {/* The Networkth Resolution Callout */}
          <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-indigo-950/70 to-slate-900 border border-indigo-500/30 text-center shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              “Networkth brings relevant discovery and meaningful connection into one place.”
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto mb-6">
              By structuring profiles by explicit role synergy (Students ↔ Professionals, Brands ↔ Creators, Startups ↔ Communities), we replace algorithmic vanity metrics with genuine mutual value.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('discover')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <span>See How We Structure Discovery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. HOW NETWORKTH WORKS (5-STEP SECTION)
          ======================================================== */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold font-mono tracking-widest text-indigo-600 uppercase mb-2 block">
            The 5-Step Value Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            How Networkth Works
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            A deliberate progression designed to turn discovery into lasting professional outcomes.
          </p>
        </div>

        {/* Step Tabs / Progress Line */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 mb-12">
          {howItWorksSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStep === idx;
            return (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-xs font-extrabold ${
                      isCurrent ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  >
                    {step.number}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900">{step.title}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {step.tagline}
                </div>
              </button>
            );
          })}
        </div>

        {/* Step Highlight Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-between"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 text-indigo-600 font-mono text-xs font-bold uppercase mb-2">
              <span>Step {howItWorksSteps[activeStep].number}</span>
              <span>•</span>
              <span>{howItWorksSteps[activeStep].tagline}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              {howItWorksSteps[activeStep].title}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              {howItWorksSteps[activeStep].description}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{howItWorksSteps[activeStep].metric}</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveStep((prev) => Math.min(howItWorksSteps.length - 1, prev + 1))
              }
              disabled={activeStep === howItWorksSteps.length - 1}
              className="p-3 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          9A. NETWORK TYPES CAROUSEL ("Connect With the Right People")
          ======================================================== */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-y border-slate-200/70 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <HorizontalCarousel
          title="Connect With the Right People"
          subtitle="Explore the 8 fundamental participant roles fueling our discovery engine. Drag or use arrows to scroll."
          ariaLabel="Network types carousel"
          autoScroll={true}
          autoScrollSpeed={4000}
        >
          {networkTypes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                onClick={() => onNavigate('discover', item.filterRole)}
                className="shrink-0 w-72 sm:w-80 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${item.iconBg} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.color}`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                    {item.role}
                  </h4>
                  <div className="text-xs font-semibold text-slate-500 mb-3">
                    {item.headline}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>Discover {item.role}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </HorizontalCarousel>
      </section>

      {/* ========================================================
          9B. USE CASE CAROUSEL ("Everything Starts With the Right Connection")
          ======================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <HorizontalCarousel
          title="Everything Starts With the Right Connection"
          subtitle="From collegiate research mentorship to venture early access and developer advocacy."
          ariaLabel="Use cases carousel"
          autoScroll={true}
          autoScrollSpeed={5000}
        >
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                onClick={() => onNavigate(uc.tab)}
                className={`shrink-0 w-72 sm:w-76 rounded-3xl border ${uc.color} p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group bg-white`}
                style={{ scrollSnapAlign: 'start' }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs mb-4 group-hover:text-indigo-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {uc.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {uc.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-indigo-600">
                  <span>{uc.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </HorizontalCarousel>
      </section>

      {/* ========================================================
          9C. CORE NETWORK CAROUSEL (Prominent Slider with Dots & Controls)
          ======================================================== */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase mb-2 block">
                The Core Networks
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Three Pillars of Meaningful Connection
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore the primary high-synergy corridors connecting members on Networkth.
              </p>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 mr-2">
                {coreNetworks.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveCoreIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeCoreIndex === i ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveCoreIndex((prev) => (prev > 0 ? prev - 1 : coreNetworks.length - 1))
                }
                aria-label="Previous core network"
                className="p-2.5 rounded-full border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveCoreIndex((prev) => (prev < coreNetworks.length - 1 ? prev + 1 : 0))
                }
                aria-label="Next core network"
                className="p-2.5 rounded-full border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Prominent Card */}
          <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div
              className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${coreNetworks[activeCoreIndex].accentColor} opacity-15 blur-3xl pointer-events-none`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7">
                <span className="inline-block px-3 py-1 rounded-full bg-slate-700/80 border border-slate-600 text-indigo-300 text-xs font-bold mb-4">
                  {coreNetworks[activeCoreIndex].badge}
                </span>

                <h4 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  {coreNetworks[activeCoreIndex].title}
                </h4>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-medium">
                  {coreNetworks[activeCoreIndex].headline}
                </p>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {coreNetworks[activeCoreIndex].description}
                </p>

                {/* Key Use Cases List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                  {coreNetworks[activeCoreIndex].useCases.map((uc, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{uc}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate(coreNetworks[activeCoreIndex].targetTab)}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>{coreNetworks[activeCoreIndex].primaryCTA}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-400 font-mono">
                    {coreNetworks[activeCoreIndex].stats}
                  </span>
                </div>
              </div>

              {/* Sample Profiles Showcase on Right */}
              <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                    <span>Active In This Network</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="space-y-3">
                    {coreNetworks[activeCoreIndex].sampleUsers.map((u, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60"
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">{u.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{u.role}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onNavigate('discover')}
                          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mt-6 text-center">
                  Direct synergy matching ensures zero irrelevant notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          11. STARTUP SECTION
          ======================================================== */}
      <section id="startups" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-widest text-orange-400 uppercase mb-3 block">
              For Startups & Founders
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
              Find the communities where your users already are.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
              Skip generic ad spending. Connect directly with targeted communities of students, developers, working professionals, and technical creators eager to become early beta users and advocates.
            </p>

            {/* Target Audiences Badges */}
            <div className="mb-8">
              <span className="text-xs font-bold text-slate-400 block mb-3 uppercase tracking-wider">
                Target Audiences Available for Discovery:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Students',
                  'Developers',
                  'Working Professionals',
                  'Founders',
                  'Creators',
                  'College Communities',
                  'Technology Communities',
                  'Professional Communities',
                ].map((aud) => (
                  <span
                    key={aud}
                    className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                  >
                    {aud}
                  </span>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-10 text-xs text-slate-300">
              {[
                'Beta-user acquisition',
                'Product launches',
                'DevRel partnerships',
                'Product feedback',
                'Campus activations',
                'Founder sessions',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('startups')}
              className="px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Connect With Your Audience</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          12. STUDENT SECTION
          ======================================================== */}
      <section id="students" className="py-16 sm:py-24 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-600 uppercase mb-2 block">
              For University Students & Early Builders
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
              Build a network that moves your career forward.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed mb-6">
              Transitioning from classroom assignments to high-stakes industry impact shouldn't depend on who your parents know. Networkth gives every student direct discoverability with senior practitioners.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { title: 'Working Professionals', desc: 'Direct access to staff engineers and managers from top tech companies.' },
                { title: 'Dedicated Mentors', desc: 'Book verified 1-on-1 career navigation and portfolio review slots.' },
                { title: 'Industry Experts', desc: 'Get practical feedback on machine learning and systems research.' },
                { title: 'Student Communities', desc: 'Collaborate with campus founders and collegiate hackathon leads worldwide.' },
                { title: 'Career Opportunities', desc: 'Access exclusive junior roles, grants, and startup internships.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('students')}
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Build Your Network</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Featured Mentor & Student Connection
            </div>

            {/* Simulated Live Connection Box */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
                <img
                  src={initialUsers[1].avatar}
                  alt={initialUsers[1].name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900">{initialUsers[1].name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{initialUsers[1].headline}</div>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                    Open for Mentorship
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold flex items-center gap-1.5">
                  <Handshake className="w-3.5 h-3.5" />
                  <span>Direct Mentorship Match</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
                <img
                  src={initialUsers[2].avatar}
                  alt={initialUsers[2].name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900">{initialUsers[2].name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{initialUsers[2].headline}</div>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    Stanford CS Senior
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          13. CREATOR + BRAND SECTION
          ======================================================== */}
      <section id="creators" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-pink-600 uppercase mb-2 block">
            For Technical Voices & Developer Brands
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Turn relevant connections into meaningful collaborations.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Cut out opaque agency commissions. Align developer products with authentic engineering creators who genuinely understand the technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Creators Card */}
          <div className="bg-white rounded-3xl border border-pink-200 p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center mb-6">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Technical Creators</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Monetize your craft by connecting directly with devtool startups and infrastructure platforms that respect editorial independence and technical rigor.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500" />
                  <span>Direct brand pitches without agency commission</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500" />
                  <span>Audience relevance scoring based on genuine dev stack</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500" />
                  <span>Campaign agreements and milestone deliverables</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('creators')}
              className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Explore Creator Network
            </button>
          </div>

          {/* Brands Card */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">For Developer Brands</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Discover niche podcast hosts, YouTube educators, and open-source tutorial authors whose audience matches your precise developer persona.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Transparent reach & engagement metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Filter creators by programming languages & topics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Direct messaging with creator talent</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('creators')}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Discover Creator Partners
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          14. COMMUNITY DISCOVERY CAROUSEL
          ======================================================== */}
      <section id="communities" className="py-16 sm:py-24 bg-slate-50/80 border-t border-slate-200 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <HorizontalCarousel
          title="Community Discovery"
          subtitle="Explore specialized hubs where practitioners gather. Real horizontal scrolling with boundary indicators."
          ariaLabel="Communities carousel"
        >
          {initialCommunities.map((comm) => (
            <div
              key={comm.id}
              onClick={() => onNavigate('community', comm.id)}
              className="shrink-0 w-80 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer group"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div>
                <div
                  className={`h-20 w-full bg-gradient-to-r ${comm.bannerGradient} relative p-4 flex items-start justify-between`}
                >
                  <span className="bg-black/35 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
                    {comm.category}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </div>

                <div className="p-5 pt-3">
                  <div className="flex items-center gap-3 mb-3 -mt-8">
                    <img
                      src={comm.avatar}
                      alt={comm.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0 bg-white"
                    />
                    <div className="pt-5 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {comm.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {comm.memberCount.toLocaleString()} members
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {comm.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {comm.tags.map((tag) => (
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

              <div className="p-5 pt-0 mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('community', comm.id);
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Explore Community Hub
                </button>
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          The right people already exist.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl mx-auto">
          Finding and connecting with the right ones is why we built Networkth. Create your profile and start discovering today.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('signup')}
          className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Join Networkth Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};

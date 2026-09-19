import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserProfile, Opportunity } from '../types';
import { ProfileCard } from '../components/ProfileCard';
import { OpportunityCard } from '../components/OpportunityCard';
import { ConnectModal } from '../components/ConnectModal';
import { SwipeMatchDeck } from '../components/SwipeMatchDeck';
import {
  GraduationCap,
  Briefcase,
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Layers,
  LayoutGrid,
  Search,
} from 'lucide-react';

interface StudentsPageProps {
  onViewProfile: (userId: string) => void;
  onOpenMessage: (userId: string) => void;
  onExploreDirectory: (role?: string) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  onViewProfile,
  onOpenMessage,
  onExploreDirectory,
}) => {
  const [mentors, setMentors] = useState<UserProfile[]>([]);
  const [studentPeers, setStudentPeers] = useState<UserProfile[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [connectModalUser, setConnectModalUser] = useState<UserProfile | null>(null);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [searchMentorQuery, setSearchMentorQuery] = useState<string>('');

  const companies = [
    'All',
    'Google',
    'Amazon',
    'PayPal',
    'Flipkart',
    'Swiggy',
    'Paytm',
    'Zepto',
    'Blinkit',
    'Infosys',
    'HCL Tech',
    'Accenture',
    'Deloitte',
  ];

  const filteredMentors = mentors.filter((m) => {
    const matchesCo =
      selectedCompany === 'All' ||
      m.headline.toLowerCase().includes(selectedCompany.toLowerCase()) ||
      m.bio.toLowerCase().includes(selectedCompany.toLowerCase()) ||
      (m.outreachMeta?.companyOrInstitution &&
        m.outreachMeta.companyOrInstitution.toLowerCase().includes(selectedCompany.toLowerCase()));

    const matchesSearch =
      !searchMentorQuery ||
      m.name.toLowerCase().includes(searchMentorQuery.toLowerCase()) ||
      m.headline.toLowerCase().includes(searchMentorQuery.toLowerCase()) ||
      m.skills.some((sk) => sk.toLowerCase().includes(searchMentorQuery.toLowerCase()));

    return matchesCo && matchesSearch;
  });

  useEffect(() => {
    api.getUsers().then((res) => {
      setMentors(
        res.users.filter(
          (u) =>
            u.role === 'Working Professional' ||
            u.availability === 'Mentoring' ||
            u.role === 'Mentor / Industry Expert'
        )
      );
      setStudentPeers(res.users.filter((u) => u.role === 'Student'));
    });

    api.getOpportunities().then((res) => {
      setOpportunities(
        res.opportunities.filter(
          (o) =>
            o.type === 'Mentorship' ||
            o.type === 'Campus Activation' ||
            o.targetAudiences.includes('Students')
        )
      );
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-4">
            <GraduationCap className="w-4 h-4 text-blue-300" />
            <span>FOR STUDENTS • INDUSTRY PROFESSIONALS & MENTORS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Connect with Working Professionals & Senior Mentors.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8">
            In this section, students can discover and match with working professionals from Google, Amazon, Flipkart, Swiggy, Paytm, Zepto, Blinkit, Infosys, and HCL Tech for 1-on-1 mentorship, system design roadmaps, and career guidance.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-200 mb-8">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>84+ Verified Working Professionals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Mentors from Google, Amazon, Flipkart & Swiggy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Direct Resume & Engineering Feedback</span>
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
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
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
              title="Industry Professionals & Mentors (For Students)"
              subtitle="Scroll trackpad or swipe cards: Left to Reject, Right to Select working professionals from Google, Amazon, Swiggy, and Flipkart for mentorship & referrals."
              initialCategory="students"
              allowedCategories={['students', 'professionals', 'all']}
              onViewProfile={onViewProfile}
              onOpenMessage={onOpenMessage}
              onRequestConnect={(u) => setConnectModalUser(u)}
            />
          </div>
        )}

        {/* Directory Grid View */}
        {viewMode === 'grid' && (
          <>
            {/* Verified Mentors Section (Working Professionals for Students) */}
            <div>
              {/* Search & Company Filter Controls */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search mentors by name, company (Google, Amazon, Swiggy, Paytm), or skill..."
                      value={searchMentorQuery}
                      onChange={(e) => setSearchMentorQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {companies.map((co) => (
                      <button
                        key={co}
                        type="button"
                        onClick={() => setSelectedCompany(co)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                          selectedCompany === co
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {co}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <span>Industry Mentors & Working Professionals</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                      {filteredMentors.length} available
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Engineers, tech leads, and mentors from Big Tech, unicorns, and top IT firms ready to support students.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onExploreDirectory('Working Professional')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View all in directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {filteredMentors.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">No mentors match this filter</h4>
                  <p className="text-xs text-slate-500 mt-1">Try selecting 'All' companies or clearing the search query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredMentors.slice(0, 16).map((m) => (
                    <ProfileCard
                      key={m.id}
                      user={m}
                      onViewProfile={onViewProfile}
                      onOpenMessage={onOpenMessage}
                      onRequestConnect={(u) => setConnectModalUser(u)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Collegiate Student Peers */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Collegiate Student Peers</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect with fellow student builders across engineering colleges and hackathon teams.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onExploreDirectory('Student')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore all students</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {studentPeers.slice(0, 4).map((s) => (
                  <ProfileCard
                    key={s.id}
                    user={s}
                    onViewProfile={onViewProfile}
                    onOpenMessage={onOpenMessage}
                    onRequestConnect={(u) => setConnectModalUser(u)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Mentorship Opportunities */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Active Mentorship & Campus Calls
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Apply directly for mock reviews, hackathon grants, and internship pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {opportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onApplyOrConnect={(o) => alert(`Applied to ${o.title}! Mentors will review your profile.`)}
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

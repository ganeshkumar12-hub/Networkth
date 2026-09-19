import React, { useState, useEffect } from 'react';
import { UserProfile, Opportunity } from '../types';
import { api } from '../services/api';
import { ProfileCard } from '../components/ProfileCard';
import { SwipeMatchDeck } from '../components/SwipeMatchDeck';
import { ConnectModal } from '../components/ConnectModal';
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  LayoutGrid,
  CheckCircle2,
  Users,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Award,
  BookOpen,
  Code2,
} from 'lucide-react';

interface ProfessionalsPageProps {
  onViewProfile: (userId: string) => void;
  onOpenMessage: (userId: string) => void;
  onExploreDirectory: (role?: string) => void;
}

export const ProfessionalsPage: React.FC<ProfessionalsPageProps> = ({
  onViewProfile,
  onOpenMessage,
  onExploreDirectory,
}) => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [connectModalUser, setConnectModalUser] = useState<UserProfile | null>(null);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');

  useEffect(() => {
    api.getUsers().then((res) => {
      // In professionals section, students should be there!
      const studentProfiles = res.users.filter((u) => u.role === 'Student');
      setStudents(studentProfiles);
    });
  }, []);

  const institutions = [
    'All',
    'Matrusri',
    'Malla Reddy',
    'GRIET',
    'MGIT',
    'CBIT',
    'Vasavi',
    'KMIT',
    'VNR VJIET',
    'JNTUH',
    'OUCE',
  ];

  const filteredStudents = students.filter((s) => {
    const matchesInst =
      selectedInstitution === 'All' ||
      s.headline.toLowerCase().includes(selectedInstitution.toLowerCase()) ||
      s.bio.toLowerCase().includes(selectedInstitution.toLowerCase()) ||
      (s.outreachMeta?.companyOrInstitution &&
        s.outreachMeta.companyOrInstitution.toLowerCase().includes(selectedInstitution.toLowerCase()));

    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.skills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.headline.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesInst && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fafbfd] pb-24">
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold mb-4">
            <Briefcase className="w-4 h-4 text-indigo-300" />
            <span>FOR PROFESSIONALS • COLLEGIATE STUDENT TALENT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Discover & Mentor Top Collegiate Student Talent.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8">
            In this section, working professionals and engineering leaders can discover, evaluate, and connect directly with high-agency collegiate developers, campus leads, and student researchers from premier institutions.
          </p>

          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-200 mb-8">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Collegiate Coders & Campus Leads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Top Campuses: CBIT, Vasavi, KMIT, VNR VJIET & JNTUH</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Direct Mentorship, Hackathon Teams & Hiring Pipeline</span>
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
              title="Collegiate Student Talent Deck (For Professionals)"
              subtitle="Scroll trackpad or swipe cards: Left to Reject, Right to Select collegiate developers from Matrusri, Malla Reddy, GRIET, MGIT, CBIT, Vasavi, and JNTUH for mentorship & recruitment."
              initialCategory="professionals"
              allowedCategories={['professionals', 'students', 'all']}
              onViewProfile={onViewProfile}
              onOpenMessage={onOpenMessage}
              onRequestConnect={(u) => setConnectModalUser(u)}
            />
          </div>
        )}

        {/* Directory Grid View */}
        {viewMode === 'grid' && (
          <>
            <div>
              {/* Institution Filter & Search Controls */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search student names, skills (React, Python, Machine Learning), or colleges..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {institutions.map((inst) => (
                      <button
                        key={inst}
                        type="button"
                        onClick={() => setSelectedInstitution(inst)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                          selectedInstitution === inst
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {inst}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <span>Collegiate Developers & Campus Builders</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Pre-screened engineering students eager to connect with industry mentors for system design reviews, internship opportunities, and guidance.
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

              {filteredStudents.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                  <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No students match your filter</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try switching institutions or clearing your search term.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInstitution('All');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredStudents.map((s) => (
                    <ProfileCard
                      key={s.id}
                      user={s}
                      onViewProfile={onViewProfile}
                      onOpenMessage={onOpenMessage}
                      onRequestConnect={(u) => setConnectModalUser(u)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Professional Mentorship Value Cards */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl">
            <span className="text-indigo-300 font-bold text-xs uppercase tracking-wider">
              Mentorship & Campus Recruitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 mb-4">
              Give Back to Emerging Developers & Scout 10x Engineering Talent Early
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Networkth pairs experienced engineers with top college builders. Help students bridge the gap between academic CS curriculum and production software architectures, or source high-agency interns for your team before campus placement drives.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Code & Architecture Reviews</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Critique student repos and open source PRs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Mock System Design</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Prepare promising candidates for big tech interviews.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Fast-Track Hiring</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hire directly with verified outreach details.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {connectModalUser && (
        <ConnectModal
          targetUser={connectModalUser}
          isOpen={!!connectModalUser}
          onClose={() => setConnectModalUser(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
};

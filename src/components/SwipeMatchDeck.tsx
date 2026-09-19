import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { UserProfile, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ConnectModal } from './ConnectModal';
import {
  X,
  Check,
  RotateCcw,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Building2,
  Video,
  Rocket,
  Flame,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  UserCheck,
  CheckCircle2,
  SlidersHorizontal,
  Bookmark,
  Users,
  Info,
} from 'lucide-react';

export type DeckCategory =
  | 'all'
  | 'startups'
  | 'students'
  | 'professionals'
  | 'brands'
  | 'creators';

interface SwipeMatchDeckProps {
  title?: string;
  subtitle?: string;
  initialCategory?: DeckCategory;
  allowedCategories?: DeckCategory[];
  onViewProfile: (userId: string) => void;
  onOpenMessage: (userId: string) => void;
  onRequestConnect?: (user: UserProfile) => void;
  customUsers?: UserProfile[];
  className?: string;
  compactMode?: boolean;
}

export const SwipeMatchDeck: React.FC<SwipeMatchDeckProps> = ({
  title = 'Synergy Match Deck',
  subtitle = 'Scroll or swipe Left to Reject, Right to Select candidates for your network',
  initialCategory = 'all',
  allowedCategories = ['all', 'startups', 'students', 'professionals', 'brands', 'creators'],
  onViewProfile,
  onOpenMessage,
  onRequestConnect,
  customUsers,
  className = '',
  compactMode = false,
}) => {
  const { user: currentUser } = useAuth();
  const [allFetchedUsers, setAllFetchedUsers] = useState<UserProfile[]>([]);
  const [activeCategory, setActiveCategory] = useState<DeckCategory>(initialCategory);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<UserProfile[]>([]);
  const [history, setHistory] = useState<Array<{ user: UserProfile; action: 'selected' | 'rejected' }>>([]);
  const [showSelectedDrawer, setShowSelectedDrawer] = useState(false);
  const [connectModalUser, setConnectModalUser] = useState<UserProfile | null>(null);
  const [lastActionToast, setLastActionToast] = useState<{ text: string; type: 'select' | 'reject' | 'undo' } | null>(null);

  // Cooldown flag to prevent double-swiping with rapid trackpad wheel gestures
  const isSwipingRef = useRef(false);

  // Fetch users if not passed via props
  useEffect(() => {
    if (customUsers && customUsers.length > 0) {
      setAllFetchedUsers(customUsers);
    } else {
      api.getUsers().then((res) => {
        setAllFetchedUsers(res.users);
      });
    }
  }, [customUsers]);

  // Filter candidates based on category
  const candidates = useMemo(() => {
    let list = allFetchedUsers.filter((u) => u.id !== currentUser?.id && u.status === 'active');

    if (activeCategory === 'startups') {
      list = list.filter((u) => u.role === 'Startup' || u.role === 'Founder');
    } else if (activeCategory === 'students') {
      list = list.filter((u) => u.role === 'Student');
    } else if (activeCategory === 'professionals') {
      list = list.filter(
        (u) => u.role === 'Working Professional' || u.role === 'Mentor / Industry Expert'
      );
    } else if (activeCategory === 'brands') {
      list = list.filter((u) => u.role === 'Brand');
    } else if (activeCategory === 'creators') {
      list = list.filter((u) => u.role === 'Creator');
    }

    return list;
  }, [allFetchedUsers, activeCategory, currentUser?.id]);

  // Reset index if category changes
  useEffect(() => {
    setCurrentIndex(0);
    setSwipeDirection(null);
  }, [activeCategory]);

  const currentCandidate = candidates[currentIndex] || null;
  const nextCandidate = candidates[currentIndex + 1] || null;

  // Motion drag value for current card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const stampSelectOpacity = useTransform(x, [20, 100], [0, 1]);
  const stampRejectOpacity = useTransform(x, [-20, -100], [0, 1]);

  // Trigger swipe in either direction
  const triggerSwipe = (direction: 'left' | 'right') => {
    if (!currentCandidate || isSwipingRef.current) return;
    isSwipingRef.current = true;
    setSwipeDirection(direction);

    const user = currentCandidate;
    if (direction === 'right') {
      // Selected
      setSelectedUsers((prev) => (prev.some((u) => u.id === user.id) ? prev : [...prev, user]));
      setHistory((prev) => [...prev, { user, action: 'selected' }]);
      showFeedback(`Selected ${user.name} for your network!`, 'select');
    } else {
      // Rejected
      setRejectedUsers((prev) => (prev.some((u) => u.id === user.id) ? prev : [...prev, user]));
      setHistory((prev) => [...prev, { user, action: 'rejected' }]);
      showFeedback(`Passed on ${user.name}`, 'reject');
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      x.set(0);
      isSwipingRef.current = false;
    }, 280);
  };

  const showFeedback = (text: string, type: 'select' | 'reject' | 'undo') => {
    setLastActionToast({ text, type });
    setTimeout(() => {
      setLastActionToast((prev) => (prev?.text === text ? null : prev));
    }, 2400);
  };

  // Undo last swipe action
  const handleUndo = () => {
    if (history.length === 0 || currentIndex === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    if (last.action === 'selected') {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== last.user.id));
    } else {
      setRejectedUsers((prev) => prev.filter((u) => u.id !== last.user.id));
    }

    setCurrentIndex((prev) => Math.max(0, prev - 1));
    showFeedback(`Restored ${last.user.name}`, 'undo');
  };

  // Reset entire deck
  const handleResetDeck = () => {
    setCurrentIndex(0);
    setHistory([]);
    setSelectedUsers([]);
    setRejectedUsers([]);
    showFeedback('Deck shuffled & reset to start!', 'undo');
  };

  // Wheel / Trackpad scroll detection
  const handleWheel = (e: React.WheelEvent) => {
    // Detect horizontal scroll or Shift+wheel
    const delta =
      Math.abs(e.deltaX) > Math.abs(e.deltaY)
        ? e.deltaX
        : e.shiftKey
        ? e.deltaY
        : 0;

    if (Math.abs(delta) > 35) {
      if (isSwipingRef.current) return;
      if (delta > 0) {
        // Scrolled Right -> Select
        triggerSwipe('right');
      } else {
        // Scrolled Left -> Reject
        triggerSwipe('left');
      }
    }
  };

  // Keyboard Shortcuts: ArrowLeft = Reject, ArrowRight = Select, Key Z = Undo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        triggerSwipe('left');
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        triggerSwipe('right');
      } else if (e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCandidate, history, currentIndex]);

  // Role badges metadata
  const roleMetadata: Record<
    string,
    { label: string; icon: React.ComponentType<{ className?: string }>; color: string; badgeBg: string }
  > = {
    Student: {
      label: 'Student Builder',
      icon: GraduationCap,
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    'Working Professional': {
      label: 'Industry Professional',
      icon: Briefcase,
      color: 'text-sky-600',
      badgeBg: 'bg-sky-50 border-sky-200 text-sky-700',
    },
    Founder: {
      label: 'Founder & Builder',
      icon: Rocket,
      color: 'text-purple-600',
      badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
    },
    Startup: {
      label: 'Emerging Startup',
      icon: Flame,
      color: 'text-orange-600',
      badgeBg: 'bg-orange-50 border-orange-200 text-orange-700',
    },
    Creator: {
      label: 'Tech Creator',
      icon: Video,
      color: 'text-pink-600',
      badgeBg: 'bg-pink-50 border-pink-200 text-pink-700',
    },
    Brand: {
      label: 'Developer Brand',
      icon: Building2,
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    },
    Developer: {
      label: 'Software Engineer',
      icon: Briefcase,
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    },
    'Mentor / Industry Expert': {
      label: 'Verified Mentor',
      icon: Sparkles,
      color: 'text-teal-600',
      badgeBg: 'bg-teal-50 border-teal-200 text-teal-700',
    },
  };

  const categoriesConfig: Array<{ id: DeckCategory; label: string; count: number }> = [
    {
      id: 'all',
      label: 'All Personas',
      count: allFetchedUsers.filter((u) => u.id !== currentUser?.id).length,
    },
    {
      id: 'startups',
      label: 'Startups',
      count: allFetchedUsers.filter((u) => (u.role === 'Startup' || u.role === 'Founder') && u.id !== currentUser?.id).length,
    },
    {
      id: 'students',
      label: 'Students',
      count: allFetchedUsers.filter((u) => u.role === 'Student' && u.id !== currentUser?.id).length,
    },
    {
      id: 'professionals',
      label: 'Professionals',
      count: allFetchedUsers.filter(
        (u) =>
          (u.role === 'Working Professional' || u.role === 'Mentor / Industry Expert') &&
          u.id !== currentUser?.id
      ).length,
    },
    {
      id: 'brands',
      label: 'Brands',
      count: allFetchedUsers.filter((u) => u.role === 'Brand' && u.id !== currentUser?.id).length,
    },
    {
      id: 'creators',
      label: 'Creators',
      count: allFetchedUsers.filter((u) => u.role === 'Creator' && u.id !== currentUser?.id).length,
    },
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* Header & Controls Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>DECISION DECK • SCROLL LEFT / RIGHT</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Quick Counter & Selected Drawer Button */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setShowSelectedDrawer(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all shadow-xs group cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Selected Candidates</span>
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                {selectedUsers.length}
              </span>
            </button>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleUndo}
                title="Undo last swipe (Key Z)"
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Undo</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (Startups, Students, Professionals, Brands, Creators) */}
        {allowedCategories.length > 1 && (
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
            {categoriesConfig
              .filter((c) => allowedCategories.includes(c.id))
              .map((c) => {
                const isActive = activeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategory(c.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    <span>{c.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {c.count}
                    </span>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Main Interactive Deck Stage */}
      <div
        className="relative max-w-xl mx-auto min-h-[580px] flex flex-col items-center justify-center select-none"
        onWheel={handleWheel}
      >
        {/* Floating gesture guide indicators */}
        <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-400 px-4 mb-3">
          <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50/80 px-2.5 py-1 rounded-lg border border-rose-100">
            <ArrowLeft className="w-3.5 h-3.5 animate-pulse" />
            <span>Scroll / Swipe Left to REJECT</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-[10px]">
            <span>Keys: [← A / → D]</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100">
            <span>Scroll / Swipe Right to SELECT</span>
            <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
          </div>
        </div>

        {/* Deck Cards Container */}
        <div className="relative w-full h-[520px]">
          <AnimatePresence>
            {currentCandidate ? (
              <>
                {/* Background Next Card (stacked for depth) */}
                {nextCandidate && (
                  <div
                    key={`next-${nextCandidate.id}`}
                    className="absolute inset-0 bg-white rounded-3xl border border-slate-200 shadow-md p-6 pointer-events-none scale-[0.95] translate-y-4 opacity-50 transition-all"
                  >
                    <div className="flex items-center gap-3 opacity-60">
                      <img
                        src={nextCandidate.avatar}
                        alt={nextCandidate.name}
                        className="w-12 h-12 rounded-2xl object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{nextCandidate.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{nextCandidate.headline}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Active Card with Drag & Scroll Handling */}
                <motion.div
                  key={currentCandidate.id}
                  style={{ x, rotate }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.8}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 80 || info.velocity.x > 400) {
                      triggerSwipe('right');
                    } else if (info.offset.x < -80 || info.velocity.x < -400) {
                      triggerSwipe('left');
                    }
                  }}
                  animate={
                    swipeDirection === 'left'
                      ? { x: -650, opacity: 0, rotate: -25, transition: { duration: 0.26 } }
                      : swipeDirection === 'right'
                      ? { x: 650, opacity: 0, rotate: 25, transition: { duration: 0.26 } }
                      : { x: 0, opacity: 1 }
                  }
                  className="absolute inset-0 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 flex flex-col justify-between cursor-grab active:cursor-grabbing overflow-hidden"
                >
                  {/* Dynamic Stamps Overlay */}
                  <motion.div
                    style={{ opacity: stampSelectOpacity }}
                    className="absolute top-8 left-8 z-30 pointer-events-none border-4 border-emerald-500 text-emerald-600 bg-emerald-50/90 font-black text-xl sm:text-2xl px-4 py-1.5 rounded-2xl rotate-[-14deg] shadow-lg tracking-wider"
                  >
                    SELECTED ✓
                  </motion.div>

                  <motion.div
                    style={{ opacity: stampRejectOpacity }}
                    className="absolute top-8 right-8 z-30 pointer-events-none border-4 border-rose-500 text-rose-600 bg-rose-50/90 font-black text-xl sm:text-2xl px-4 py-1.5 rounded-2xl rotate-[14deg] shadow-lg tracking-wider"
                  >
                    REJECTED ✕
                  </motion.div>

                  {/* Top Bar: Role & Status */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                          roleMetadata[currentCandidate.role]?.badgeBg || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {(() => {
                          const IconComp = roleMetadata[currentCandidate.role]?.icon || Briefcase;
                          return <IconComp className="w-3.5 h-3.5" />;
                        })()}
                        <span>{currentCandidate.role}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              currentCandidate.availability === 'Open to Connect'
                                ? 'bg-emerald-500'
                                : currentCandidate.availability === 'Mentoring'
                                ? 'bg-blue-500'
                                : currentCandidate.availability === 'Hiring'
                                ? 'bg-purple-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          <span>{currentCandidate.availability}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {currentIndex + 1} of {candidates.length}
                        </span>
                      </div>
                    </div>

                    {/* Candidate Photo & Basic Info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={currentCandidate.avatar}
                        alt={currentCandidate.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                            {currentCandidate.name}
                          </h4>
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5 line-clamp-2 leading-snug">
                          {currentCandidate.headline}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {currentCandidate.location}
                          </span>
                          <span>•</span>
                          <span className="truncate">{currentCandidate.industry}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <div className="mt-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        "{currentCandidate.bio}"
                      </p>
                    </div>

                    {/* Synergy Skills Chips */}
                    <div className="mt-4">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Core Competencies & Stack
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentCandidate.skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-700 text-[11px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Quick Trigger Details */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile(currentCandidate.id);
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Inspect Complete Profile</span>
                    </button>

                    <span className="text-[11px] text-slate-400">
                      Drag card or scroll trackpad left / right
                    </span>
                  </div>
                </motion.div>
              </>
            ) : (
              /* Empty / Completed Deck View */
              <div className="absolute inset-0 bg-white rounded-3xl border border-slate-200 shadow-md p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  You've reviewed all candidates in this deck!
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
                  You selected <strong className="text-emerald-600">{selectedUsers.length}</strong>{' '}
                  profiles and passed on <strong className="text-rose-600">{rejectedUsers.length}</strong>.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  {selectedUsers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowSelectedDrawer(true)}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Review Selected ({selectedUsers.length})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleResetDeck}
                    className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Shuffle & Review Again</span>
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Physical Action Buttons Bar (Reject, Undo, Info, Select) */}
        {currentCandidate && (
          <div className="flex items-center justify-center gap-5 mt-6 w-full max-w-sm px-4">
            {/* Reject Button (Left) */}
            <button
              type="button"
              onClick={() => triggerSwipe('left')}
              title="Reject / Pass (Scroll Left or Key A)"
              className="group flex flex-col items-center gap-1 focus:outline-hidden cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-300 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center">
                <X className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-rose-600">
                PASS (←)
              </span>
            </button>

            {/* Undo Button */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              title="Undo Last Action (Key Z)"
              className={`flex flex-col items-center gap-1 focus:outline-hidden cursor-pointer ${
                history.length === 0 ? 'opacity-40 pointer-events-none' : ''
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xs flex items-center justify-center">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">UNDO</span>
            </button>

            {/* View Profile */}
            <button
              type="button"
              onClick={() => onViewProfile(currentCandidate.id)}
              title="View Complete Profile"
              className="flex flex-col items-center gap-1 focus:outline-hidden cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xs flex items-center justify-center">
                <ExternalLink className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">INFO</span>
            </button>

            {/* Select Button (Right) */}
            <button
              type="button"
              onClick={() => triggerSwipe('right')}
              title="Select / Match (Scroll Right or Key D)"
              className="group flex flex-col items-center gap-1 focus:outline-hidden cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600">
                SELECT (→)
              </span>
            </button>
          </div>
        )}

        {/* Live Action Toast Banner */}
        {lastActionToast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div
              className={`px-4 py-2 rounded-2xl shadow-xl text-xs font-bold border flex items-center gap-2 ${
                lastActionToast.type === 'select'
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : lastActionToast.type === 'reject'
                  ? 'bg-slate-900 text-white border-slate-700'
                  : 'bg-indigo-900 text-white border-indigo-700'
              }`}
            >
              {lastActionToast.type === 'select' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              {lastActionToast.type === 'reject' && <X className="w-3.5 h-3.5 text-rose-400" />}
              {lastActionToast.type === 'undo' && <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />}
              <span>{lastActionToast.text}</span>
            </div>
          </div>
        )}
      </div>

      {/* Slide-Over Drawer: Selected Candidates */}
      {showSelectedDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Selected Candidates</h3>
                  <p className="text-xs text-slate-500">
                    {selectedUsers.length} profile{selectedUsers.length === 1 ? '' : 's'} chosen via scroll match
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSelectedDrawer(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidates List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedUsers.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <Users className="w-12 h-12 text-slate-300 mb-3 stroke-1" />
                  <p className="text-xs font-semibold">No candidates selected yet</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Scroll or swipe right on profiles in the deck to add candidates here.
                  </p>
                </div>
              ) : (
                selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4
                            onClick={() => {
                              onViewProfile(user.id);
                              setShowSelectedDrawer(false);
                            }}
                            className="text-xs font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                          >
                            {user.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {user.headline}
                        </p>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{user.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
                        }}
                        className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onOpenMessage(user.id);
                            setShowSelectedDrawer(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Chat</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setConnectModalUser(user);
                          }}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Send Connect Note</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {selectedUsers.length > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedUsers([])}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSelectedDrawer(false);
                    // Open connect note for the first selected user
                    if (selectedUsers.length > 0) {
                      setConnectModalUser(selectedUsers[0]);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  Connect with Selected
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {connectModalUser && (
        <ConnectModal
          targetUser={connectModalUser}
          isOpen={true}
          onClose={() => setConnectModalUser(null)}
          onSuccess={() => {
            showFeedback(`Connection request sent to ${connectModalUser.name}!`, 'select');
            setConnectModalUser(null);
          }}
        />
      )}
    </div>
  );
};

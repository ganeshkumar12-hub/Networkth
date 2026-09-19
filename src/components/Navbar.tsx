import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { initialUsers } from '../../server/seedData';
import {
  Search,
  Bell,
  MessageSquare,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  User,
  Shield,
  LogOut,
  LayoutDashboard,
  CheckCheck,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
}) => {
  const { user, logout, switchPersona, openAuthModal } = useAuth();
  const {
    unreadNotificationCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useSocket();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'match-deck', label: '⚡ Swipe Match' },
    { id: 'discover', label: 'Discover' },
    { id: 'students', label: 'For Students' },
    { id: 'startups', label: 'For Startups' },
    { id: 'creators', label: 'For Creators' },
    { id: 'communities', label: 'Communities' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (tabId: string, param?: string) => {
    onNavigate(tabId, param);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 group-hover:bg-indigo-600 transition-colors flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-300 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="font-extrabold tracking-wider text-base sm:text-lg font-mono text-slate-900 group-hover:text-indigo-600 transition-colors">
              NETWORKTH
            </span>
          </button>

          {/* Quick Demo Persona Switcher pill */}
          <div className="hidden xl:block relative">
            <button
              type="button"
              onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Persona: {user?.role || 'Guest'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {personaDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setPersonaDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Test Experience As:
                </div>
                {initialUsers.slice(0, 6).map((persona) => (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => {
                      switchPersona(persona.email);
                      setPersonaDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-left transition-colors ${
                      user?.email === persona.email
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={persona.avatar}
                      alt={persona.name}
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{persona.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{persona.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50/70 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Global Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search Networkth"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-500 rounded-sm">
              ⌘K
            </kbd>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {/* Messages button */}
              <button
                type="button"
                onClick={() => handleNavClick('messages')}
                aria-label="Messages"
                className={`relative p-2 rounded-xl border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer ${
                  currentTab === 'messages' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : ''
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </button>

              {/* Notifications Button & Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  aria-label="Notifications"
                  className="relative p-2 rounded-xl border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50"
                    onMouseLeave={() => setNotificationsOpen(false)}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                        {unreadNotificationCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                            {unreadNotificationCount} new
                          </span>
                        )}
                      </div>
                      {unreadNotificationCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.type === 'message') {
                                handleNavClick('messages');
                              } else if (notif.type.includes('connection')) {
                                handleNavClick('dashboard');
                              }
                              setNotificationsOpen(false);
                            }}
                            className={`p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                              notif.read
                                ? 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                                : 'bg-indigo-50/50 border-indigo-100 text-slate-900 font-medium hover:bg-indigo-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900 text-xs">
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Avatar Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-0.5" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.role}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleNavClick('dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      My Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleNavClick('profile', user.id);
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleNavClick('admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-xl"
                    >
                      <Shield className="w-4 h-4 text-indigo-600" />
                      Admin Dashboard
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="text-xs font-bold bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl border border-slate-200 text-slate-600 lg:hidden hover:bg-slate-50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-1.5 pb-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentTab === link.id
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Persona Switcher on mobile */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Switch Demo Persona
            </span>
            <div className="grid grid-cols-2 gap-2">
              {initialUsers.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    switchPersona(p.email);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 text-xs text-left"
                >
                  <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                  <span className="truncate font-medium">{p.name.split(' ')[0]} ({p.role})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

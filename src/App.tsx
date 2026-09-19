import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider, useSocket } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { CommunityDetailPage } from './pages/CommunityDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { MessagesPage } from './pages/MessagesPage';
import { StudentsPage } from './pages/StudentsPage';
import { ProfessionalsPage } from './pages/ProfessionalsPage';
import { StartupsPage } from './pages/StartupsPage';
import { CreatorsPage } from './pages/CreatorsPage';
import { CommunitiesDirectoryPage } from './pages/CommunitiesDirectoryPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { SwipeMatchDeck } from './components/SwipeMatchDeck';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthModal } from './components/AuthModal';
import { Bell, X } from 'lucide-react';

const ToastNotification: React.FC = () => {
  const { activeToast, dismissToast } = useSocket();

  if (!activeToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-start gap-3 max-w-sm">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
          <Bell className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white">{activeToast.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed line-clamp-2">
            {activeToast.message}
          </p>
        </div>
        <button
          type="button"
          onClick={dismissToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut Cmd+K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (tab: string, param?: string) => {
    setCurrentTab(tab);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfd] selection:bg-indigo-500 selection:text-white">
      {/* Sticky Responsive Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksPage
            onGetStarted={() => handleNavigate('home')}
            onExplore={() => handleNavigate('discover')}
          />
        )}

        {currentTab === 'discover' && (
          <DiscoverPage
            initialRoleFilter={routeParam}
            onNavigateToUser={(userId) => handleNavigate('profile', userId)}
            onNavigateToCommunity={(commId) => handleNavigate('community', commId)}
            onOpenMessage={(userId) => handleNavigate('messages', userId)}
          />
        )}

        {currentTab === 'students' && (
          <StudentsPage
            onViewProfile={(userId) => handleNavigate('profile', userId)}
            onOpenMessage={(userId) => handleNavigate('messages', userId)}
            onExploreDirectory={(role) => handleNavigate('discover', role)}
          />
        )}

        {currentTab === 'professionals' && (
          <ProfessionalsPage
            onViewProfile={(userId) => handleNavigate('profile', userId)}
            onOpenMessage={(userId) => handleNavigate('messages', userId)}
            onExploreDirectory={(role) => handleNavigate('discover', role)}
          />
        )}

        {currentTab === 'startups' && (
          <StartupsPage
            onViewProfile={(userId) => handleNavigate('profile', userId)}
            onViewCommunity={(commId) => handleNavigate('community', commId)}
            onOpenMessage={(userId) => handleNavigate('messages', userId)}
            onExploreDirectory={(role) => handleNavigate('discover', role)}
          />
        )}

        {currentTab === 'creators' && (
          <CreatorsPage
            onViewProfile={(userId) => handleNavigate('profile', userId)}
            onOpenMessage={(userId) => handleNavigate('messages', userId)}
            onExploreDirectory={(role) => handleNavigate('discover', role)}
          />
        )}

        {currentTab === 'match-deck' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SwipeMatchDeck
              title="Synergy Decision Deck"
              subtitle="Scroll trackpad or swipe cards: Left to Reject, Right to Select candidates for your network."
              initialCategory="all"
              allowedCategories={['all', 'startups', 'students', 'professionals', 'brands', 'creators']}
              onViewProfile={(userId) => handleNavigate('profile', userId)}
              onOpenMessage={(userId) => handleNavigate('messages', userId)}
            />
          </div>
        )}

        {currentTab === 'communities' && (
          <CommunitiesDirectoryPage
            onViewCommunity={(commId) => handleNavigate('community', commId)}
          />
        )}

        {currentTab === 'community' && routeParam && (
          <CommunityDetailPage
            communityId={routeParam}
            onBack={() => handleNavigate('communities')}
            onViewUser={(userId) => handleNavigate('profile', userId)}
            onOpenMessage={(userId) => handleNavigate('messages', userId)}
          />
        )}

        {currentTab === 'profile' && routeParam && (
          <UserProfilePage
            userId={routeParam}
            onBack={() => handleNavigate('discover')}
            onOpenMessage={(userId) => handleNavigate('messages', userId)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onNavigateToUser={(userId) => handleNavigate('profile', userId)}
            onNavigateToCommunity={(commId) => handleNavigate('community', commId)}
            onOpenMessage={(userId) => handleNavigate('messages', userId)}
            onExploreDirectory={(role) => handleNavigate('discover', role)}
          />
        )}

        {currentTab === 'messages' && (
          <MessagesPage
            initialTargetUserId={routeParam}
            onViewProfile={(userId) => handleNavigate('profile', userId)}
          />
        )}

        {currentTab === 'admin' && <AdminPage />}

        {currentTab === 'about' && <AboutPage />}
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToUser={(userId) => handleNavigate('profile', userId)}
        onNavigateToCommunity={(commId) => handleNavigate('community', commId)}
        onExploreMore={(query) => {
          handleNavigate('discover');
        }}
      />

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal />

      {/* Real-time Socket Toast Notification */}
      <ToastNotification />

      {/* Footer */}
      {currentTab !== 'messages' && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
}

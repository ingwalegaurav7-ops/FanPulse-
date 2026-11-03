import React, { useState } from 'react';
import { CricketProvider, useCricket } from './context/CricketContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { BowlerSelectModal } from './components/BowlerSelectModal';
import { FinalResultModal } from './components/FinalResultModal';
import { HomePage } from './pages/HomePage';
import { LiveMatchesPage } from './pages/LiveMatchesPage';
import { MatchCentrePage } from './pages/MatchCentrePage';
import { AICompanionPage } from './pages/AICompanionPage';
import { MatchIntelligencePage } from './pages/MatchIntelligencePage';
import { FantasyImpactPage } from './pages/FantasyImpactPage';
import { MatchRecapPage } from './pages/MatchRecapPage';

function AppContent() {
  const { activeTab, isFinalScorecardOpen, setIsFinalScorecardOpen } = useCricket();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Scroll to top immediately whenever activeTab changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  // Also reset scroll to top on browser back/forward navigation
  React.useEffect(() => {
    const handlePopState = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FC] text-[#19182A]">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'live-matches' && <LiveMatchesPage />}
        {activeTab === 'match-centre' && <MatchCentrePage />}
        {activeTab === 'companion' && <AICompanionPage />}
        {activeTab === 'intelligence' && <MatchIntelligencePage />}
        {activeTab === 'fantasy' && <FantasyImpactPage />}
        {activeTab === 'recap' && <MatchRecapPage />}
      </main>

      <Footer />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BowlerSelectModal />
      <FinalResultModal isOpen={isFinalScorecardOpen} onClose={() => setIsFinalScorecardOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <CricketProvider>
      <AppContent />
    </CricketProvider>
  );
}

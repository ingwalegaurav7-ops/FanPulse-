import React, { useState } from 'react';
import {
  Activity,
  Bell,
  Search,
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Layers,
  FileText,
  Menu,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  ChevronDown,
  Mail,
  User,
  ExternalLink
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const {
    activeTab,
    setActiveTab,
    selectedMatch,
    matches,
    setSelectedMatchId,
    unreadNotificationCount,
    notifications,
    markAlertRead,
    clearAllAlerts,
    soundEnabled,
    setSoundEnabled,
    isAutoPlay,
    toggleAutoPlay,
    resetCurrentMatch,
  } = useCricket();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertsDropdownOpen, setAlertsDropdownOpen] = useState(false);
  const [matchDropdownOpen, setMatchDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'live-matches', label: 'Matches', icon: Zap },
    { id: 'match-centre', label: 'Match Centre', icon: Layers },
    { id: 'companion', label: 'AI Companion', icon: Sparkles, highlight: true },
    { id: 'intelligence', label: 'Intelligence', icon: TrendingUp },
    { id: 'fantasy', label: 'Fantasy XI', icon: Award },
    { id: 'recap', label: 'Recap', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9E9F1] shadow-xs">
      {/* Top micro banner for match quick-glance */}
      <div className="bg-[#19182A] text-white text-xs py-1.5 px-4 hidden md:flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-1.5 bg-[#FF7438] text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>LIVE SIMULATOR</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <span className="font-semibold text-white">
              {selectedMatch.teamB.shortName} vs {selectedMatch.teamA.shortName}
            </span>
            <span className="text-gray-400">•</span>
            <span>
              {selectedMatch.battingTeamId} {selectedMatch.runs}/{selectedMatch.wickets} (
              {selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} ov)
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-emerald-400 font-medium">
              Target {selectedMatch.target || 182} ({Math.max(0, (selectedMatch.target || 182) - selectedMatch.runs)} needed off{' '}
              {Math.max(0, selectedMatch.totalOvers * 6 - (selectedMatch.completedOvers * 6 + selectedMatch.ballsInCurrentOver))}b)
            </span>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <button
              onClick={toggleAutoPlay}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition ${
                isAutoPlay ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-gray-800 text-gray-300 hover:text-white'
              }`}
              title="Automatically simulate a delivery every 4 seconds"
            >
              {isAutoPlay ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3" />}
              <span>{isAutoPlay ? 'Auto-Simulating' : 'Auto-Simulate'}</span>
            </button>

            <button
              onClick={resetCurrentMatch}
              className="flex items-center space-x-1 text-gray-400 hover:text-white transition text-[11px]"
              title="Reset match state to Over 15.2 default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Match</span>
            </button>

            <span className="text-gray-500">|</span>

            <span className="text-[11px] text-gray-400">
              Dream11 FDE Assignment Demo • <span className="text-white font-medium">FanPulse Engine</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="flex items-center space-x-3 group text-left focus:outline-hidden"
              title="FanPulse AI - Back to Home"
            >
              {/* Cricket-inspired Logo Emblem */}
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl overflow-hidden bg-[#160E36] border border-[#5425C9]/30 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#5425C9] transition-all duration-200">
                <img
                  src="/assets/aistudio/image_412606d4.png"
                  alt="FanPulse AI Logo"
                  className="h-full w-full object-cover object-left"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-xl tracking-tight text-[#19182A] group-hover:text-[#5425C9] transition-colors">
                    FanPulse
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#FF7438] text-white shadow-xs tracking-wider uppercase">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-[#77788B] font-semibold tracking-tight -mt-0.5">
                  Every Ball Has a Story.
                </p>
              </div>
            </button>

            {/* Match Selector Dropdown Pill */}
            <div className="relative hidden xl:block">
              <button
                onClick={() => setMatchDropdownOpen(!matchDropdownOpen)}
                className="flex items-center space-x-2 bg-[#F7F8FC] hover:bg-[#F1F2F7] border border-[#E9E9F1] px-3 py-1.5 rounded-lg text-xs font-medium text-[#19182A] transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{selectedMatch.teamB.shortName} vs {selectedMatch.teamA.shortName}</span>
                <span className="text-[#77788B]">({selectedMatch.runs}/{selectedMatch.wickets})</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#77788B]" />
              </button>

              {matchDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-[#E9E9F1] rounded-xl shadow-xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-[#77788B] uppercase tracking-wider">
                    Select Active Match
                  </div>
                  {matches.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMatchId(m.id);
                        setMatchDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F7F8FC] flex items-center justify-between ${
                        m.id === selectedMatch.id ? 'bg-[#5425C9]/5 text-[#5425C9] font-semibold' : 'text-[#19182A]'
                      }`}
                    >
                      <div>
                        <div>{m.teamB.name} vs {m.teamA.name}</div>
                        <div className="text-[11px] text-[#77788B]">{m.tournament}</div>
                      </div>
                      <span className="font-bold tabular-nums">
                        {m.runs}/{m.wickets}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                  }}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F0EBFC] text-[#5425C9] font-bold border border-[#5425C9]/20 shadow-2xs'
                      : 'text-[#77788B] font-medium hover:text-[#5425C9] hover:bg-[#F0EBFC]/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#5425C9]'
                        : item.highlight
                        ? 'text-[#FF7438]'
                        : 'text-[#77788B]'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span
                      className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        isActive
                          ? 'bg-[#FF7438] text-white shadow-xs'
                          : 'bg-[#FF7438] text-white'
                      }`}
                    >
                      PRO
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Icons: Search, Notifications, Sound, Profile */}
          <div className="flex items-center space-x-2.5">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg text-[#77788B] hover:text-[#19182A] hover:bg-[#F7F8FC] border border-transparent hover:border-[#E9E9F1] transition"
              title="Search matches, players, insights (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Smart Fan Alerts Button & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAlertsDropdownOpen(!alertsDropdownOpen)}
                className={`p-2 rounded-lg transition relative ${
                  alertsDropdownOpen
                    ? 'bg-[#5425C9]/10 text-[#5425C9]'
                    : 'text-[#77788B] hover:text-[#19182A] hover:bg-[#F7F8FC]'
                }`}
                title="Smart Fan Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF7438] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown Drawer */}
              {alertsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E9E9F1] rounded-2xl shadow-2xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-[#E9E9F1] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-[#19182A]">Smart Fan Alerts</span>
                      <span className="px-1.5 py-0.5 bg-[#5425C9]/10 text-[#5425C9] font-bold text-[10px] rounded-sm">
                        Real-Time
                      </span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllAlerts}
                        className="text-xs text-[#77788B] hover:text-[#5425C9] font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-[#77788B]">
                        No active alerts. Simulate a ball or wicket to trigger notifications!
                      </div>
                    ) : (
                      notifications.map((alert) => (
                        <div
                          key={alert.id}
                          onClick={() => markAlertRead(alert.id)}
                          className={`p-3.5 hover:bg-[#F7F8FC] cursor-pointer transition ${
                            !alert.read ? 'bg-indigo-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider ${
                                alert.category === 'WICKET'
                                  ? 'bg-rose-100 text-rose-700'
                                  : alert.category === 'MOMENTUM'
                                  ? 'bg-purple-100 text-purple-700'
                                  : alert.category === 'FANTASY'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {alert.title}
                            </span>
                            <span className="text-[10px] text-gray-400">{alert.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#19182A] mt-1.5 leading-relaxed font-normal">
                            {alert.description}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg text-[#77788B] hover:text-[#19182A] hover:bg-[#F7F8FC] transition hidden sm:block"
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>

            {/* User Badge & Candidate Profile */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 pl-2 border-l border-[#E9E9F1] hover:opacity-90 transition focus:outline-none"
                aria-label="Candidate Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5425C9] to-[#FF7438] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  GI
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-[#19182A] leading-tight flex items-center gap-1">
                    Gaurav Ingwale
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </p>
                  <p className="text-[10px] text-[#FF7438] font-semibold">Dream11 FDE Candidate</p>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E9E9F1] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center space-x-3 pb-3 border-b border-[#E9E9F1]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5425C9] to-[#FF7438] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      GI
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-[#19182A] truncate">Gaurav Ingwale</p>
                      <p className="text-[11px] text-[#5425C9] font-medium truncate">Dream11 FDE Intern Candidate</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]/80">
                      <p className="text-[10px] font-semibold text-[#77788B] uppercase tracking-wider mb-1">Direct Contact</p>
                      <a
                        href="mailto:ingwalegaurav7@gmail.com"
                        className="flex items-center space-x-2 text-xs font-semibold text-[#5425C9] hover:text-[#FF7438] transition truncate"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0 text-[#FF7438]" />
                        <span className="truncate">ingwalegaurav7@gmail.com</span>
                      </a>
                    </div>

                    <div className="text-[11px] text-[#77788B] space-y-1">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>Application</span>
                        <span className="font-semibold text-[#19182A]">FanPulse AI</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>Assignment</span>
                        <span className="font-semibold text-[#19182A]">FDE Intern Role</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>AI Engine</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Gemini 2.5 Flash
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href="mailto:ingwalegaurav7@gmail.com?subject=Dream11%20FDE%20Assignment%20Feedback%20-%20FanPulse%20AI"
                        className="flex-1 py-1.5 px-3 rounded-lg bg-[#5425C9] text-white text-xs font-semibold hover:bg-[#431db0] transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Mail className="w-3 h-3" />
                        Send Email
                      </a>
                      <button
                        onClick={() => {
                          resetCurrentMatch();
                          setUserMenuOpen(false);
                        }}
                        className="py-1.5 px-2.5 rounded-lg border border-[#E9E9F1] text-xs font-medium text-[#77788B] hover:text-[#19182A] hover:bg-gray-50 transition"
                        title="Reset match simulation"
                      >
                        Reset Demo
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#19182A] lg:hidden hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E9E9F1] bg-white px-4 pt-2 pb-6 space-y-2">
          <div className="py-2 border-b border-gray-100 mb-2">
            <p className="text-xs font-semibold text-[#77788B] uppercase">Active Match</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-bold text-[#19182A]">
                {selectedMatch.teamB.name} vs {selectedMatch.teamA.name}
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                {selectedMatch.runs}/{selectedMatch.wickets}
              </span>
            </div>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#F0EBFC] text-[#5425C9] font-bold border border-[#5425C9]/20 shadow-2xs'
                    : 'text-[#19182A] font-medium hover:bg-[#F0EBFC]/50 hover:text-[#5425C9]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#5425C9]' : 'text-[#77788B]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] bg-[#FF7438] text-white px-1.5 py-0.5 rounded font-bold">
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

import React from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  Flame,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';

export const HomePage: React.FC = () => {
  const { setActiveTab, selectedMatch, matches, setSelectedMatchId } = useCricket();

  const trendingMoments = [
    {
      title: 'SKY 84m Scoop Six Shifts Momentum',
      subtitle: 'Over 13.6 vs Adam Zampa',
      impact: '+12% Win Probability Shift',
      tag: 'Turning Point',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Cummins Slower Yorker Traps Pant',
      subtitle: 'Over 11.2 (c Maxwell b Cummins)',
      impact: 'Broke 48-run 3rd Wicket Partnership',
      tag: 'Key Dismissal',
      color: 'bg-rose-100 text-rose-700',
    },
    {
      title: 'Hardik Pandya Consecutive Fours',
      subtitle: 'Over 14.5 & 14.6 off Hazlewood',
      impact: '+14 Fantasy Points Earned',
      tag: 'Fantasy Surge',
      color: 'bg-amber-100 text-amber-800',
    },
  ];

  const fantasyHighlights = [
    {
      name: 'Suryakumar Yadav',
      team: 'IND',
      role: 'BAT',
      points: 78,
      status: 'Batting 44* (26b)',
      badge: 'TOP BATSMAN',
    },
    {
      name: 'Pat Cummins',
      team: 'AUS',
      role: 'BOWL',
      points: 62,
      status: '1/28 (3.2 ov)',
      badge: 'LETHAL SPELL',
    },
    {
      name: 'Hardik Pandya',
      team: 'IND',
      role: 'AR',
      points: 54,
      status: '18* (10b) + 1 wkt',
      badge: 'MVP CANDIDATE',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E9E9F1]">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-[#5425C9]" />
            <h1 className="text-2xl font-black text-[#19182A]">Welcome to FanPulse AI</h1>
          </div>
          <p className="text-xs text-[#77788B]">
            AI-powered live cricket companion — real-time ball simulation, momentum swings & fantasy analytics
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#5425C9] font-bold text-xs flex items-center space-x-1.5 border border-[#5425C9]/20">
            <span className="w-2 h-2 rounded-full bg-[#5425C9] animate-pulse"></span>
            <span>Live Companion Active</span>
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#19182A] via-[#221B42] to-[#12111E] text-white p-6 sm:p-10 lg:p-14 border border-gray-800 shadow-xl">
        {/* Glow ambient background elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5425C9]/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF7438]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-gray-200">
              <span className="w-2 h-2 rounded-full bg-[#FF7438] animate-pulse"></span>
              <span>Next-Gen Cricket Intelligence for Passionate Fans</span>
            </div>

            {/* Headline & Subhead */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Every Ball <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-[#FF7438]">
                  Has a Story.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 font-normal max-w-xl leading-relaxed">
                Don't just follow the score. Understand why matches swing, decode death-over tactics, and optimize your fantasy lineup with Gemini-powered situational intelligence.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => setActiveTab('match-centre')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7438] to-[#FF8C5A] hover:from-[#f06425] hover:to-[#ff7b42] text-white font-bold text-sm shadow-lg shadow-[#FF7438]/25 hover:shadow-xl hover:shadow-[#FF7438]/35 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Explore Live Match Centre</span>
              </button>

              <button
                onClick={() => setActiveTab('companion')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all backdrop-blur-md flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>Ask FanPulse AI</span>
              </button>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-gray-400">
              <div>
                <span className="block text-white font-extrabold text-base">Ball-by-Ball</span>
                <span>Deterministic momentum</span>
              </div>
              <div>
                <span className="block text-white font-extrabold text-base">Gemini 3.8</span>
                <span>Contextual game explanations</span>
              </div>
              <div>
                <span className="block text-white font-extrabold text-base">Real-Time</span>
                <span>Fantasy point tracking</span>
              </div>
            </div>
          </div>

          {/* Interactive Match Snapshot Widget in Hero */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    SIMULATED LIVE MATCH
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-medium">St Lucia • Over 15.2</span>
              </div>

              {/* Match Teams Header */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">{selectedMatch.teamB.name} (Chasing)</p>
                  <p className="text-3xl font-black text-white tabular-nums">
                    {selectedMatch.runs}/{selectedMatch.wickets}
                  </p>
                  <p className="text-xs text-indigo-300 font-semibold mt-0.5">
                    ({selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} / 20 ov)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{selectedMatch.teamA.name}</p>
                  <p className="text-xl font-bold text-gray-300 tabular-nums">181/7 (20.0)</p>
                  <p className="text-xs text-emerald-400 font-bold mt-0.5">
                    Target: {selectedMatch.target || 182}
                  </p>
                </div>
              </div>

              {/* Mini Momentum Bar */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-300 font-medium">Win Momentum</span>
                  <span className="text-[#FF7438] font-bold tabular-nums">{selectedMatch.momentumIndex}% IND</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#5425C9] to-[#FF7438] transition-all duration-300"
                    style={{ width: `${selectedMatch.momentumIndex}%` }}
                  ></div>
                </div>
              </div>

              {/* Active Duel */}
              <div className="mt-3 p-2.5 rounded-xl bg-black/30 border border-white/10 text-xs flex justify-between items-center">
                <div>
                  <span className="text-gray-400 block text-[10px]">CURRENT DUEL</span>
                  <span className="font-bold text-white">SKY (44*) vs Cummins</span>
                </div>
                <button
                  onClick={() => setActiveTab('match-centre')}
                  className="px-3 py-1.5 rounded-lg bg-[#5425C9] hover:bg-[#7351E8] text-white font-bold text-xs flex items-center space-x-1"
                >
                  <span>Simulate Next Ball</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Live Matches Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-xl font-black text-[#19182A]">Featured Live Matches</h2>
            </div>
            <p className="text-xs text-[#77788B]">Select a match to drive simulator, AI companion, and intelligence dashboards</p>
          </div>
          <button
            onClick={() => setActiveTab('live-matches')}
            className="text-xs font-bold text-[#5425C9] hover:underline flex items-center space-x-1"
          >
            <span>View All Matches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {matches.map((m) => {
            const isSelected = m.id === selectedMatch.id;
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMatchId(m.id)}
                className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-[#5425C9] ring-2 ring-[#5425C9]/10'
                    : 'border-[#E9E9F1] hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#77788B] pb-3 border-b border-[#E9E9F1]">
                  <span className="font-semibold text-[#19182A]">{m.tournament}</span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {m.status}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#5425C9] text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Score Display */}
                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{m.teamB.logo}</span>
                      <span className="font-bold text-sm text-[#19182A]">{m.teamB.name}</span>
                    </div>
                    <span className="font-extrabold text-base text-[#19182A] tabular-nums">
                      {m.runs}/{m.wickets}{' '}
                      <span className="text-xs font-normal text-gray-500">
                        ({m.completedOvers}.{m.ballsInCurrentOver} ov)
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{m.teamA.logo}</span>
                      <span className="font-medium text-sm text-gray-600">{m.teamA.name}</span>
                    </div>
                    <span className="font-bold text-sm text-gray-600 tabular-nums">
                      {m.firstInningsTotal?.runs}/{m.firstInningsTotal?.wickets} (20.0 ov)
                    </span>
                  </div>
                </div>

                {/* Match Status & Action */}
                <div className="pt-3 border-t border-[#E9E9F1] flex items-center justify-between text-xs">
                  <span className="text-rose-600 font-semibold">{m.statusText}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMatchId(m.id);
                      setActiveTab('match-centre');
                    }}
                    className="text-[#5425C9] font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Open Centre</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Companion Preview Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#5425C9]/10 via-[#7351E8]/10 to-indigo-50 border border-[#5425C9]/20 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#5425C9] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FF7438]" />
              <span>Signature Feature • AI Cricket Companion</span>
            </div>
            <h3 className="text-2xl font-black text-[#19182A]">
              Ask why the match is changing. Get grounded, actionable answers.
            </h3>
            <p className="text-xs sm:text-sm text-[#77788B] leading-relaxed">
              Trained to parse match situational context, run-rate pressures, player matchups, and fantasy dynamics using Gemini 3.8 Flash. No hallucinations, only verified match evidence.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Why did the momentum change?',
                'Can the chasing team still win?',
                'Who has made the biggest impact?',
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab('companion')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#5425C9]/20 text-[#5425C9] font-semibold text-xs hover:bg-[#5425C9] hover:text-white transition shadow-2xs"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              onClick={() => setActiveTab('companion')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#5425C9] hover:bg-[#431db0] text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Launch Companion</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Trending Match Moments & Turning Points */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#19182A]">Trending Match Moments</h2>
            <p className="text-xs text-[#77788B]">Key turning points altering current match probabilities</p>
          </div>
          <button
            onClick={() => setActiveTab('intelligence')}
            className="text-xs font-bold text-[#5425C9] hover:underline"
          >
            Explore Heuristic Breakdown →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingMoments.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-[#E9E9F1] shadow-2xs hover:shadow-md transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${item.color}`}>
                  {item.tag}
                </span>
                <span className="text-[11px] text-gray-400">{item.subtitle}</span>
              </div>
              <h4 className="font-bold text-sm text-[#19182A]">{item.title}</h4>
              <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded inline-block">
                {item.impact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Fantasy Player Highlights Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#19182A]">Fantasy XI Star Performers</h2>
            <p className="text-xs text-[#77788B]">Real-time Dream11 illustrative points updated ball-by-ball</p>
          </div>
          <button
            onClick={() => setActiveTab('fantasy')}
            className="text-xs font-bold text-[#FF7438] hover:underline"
          >
            Manage Your Fantasy Team →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fantasyHighlights.map((player, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-[#E9E9F1] shadow-2xs hover:border-[#5425C9]/30 transition flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-[#5425C9] uppercase tracking-wider">
                  {player.badge}
                </span>
                <h4 className="font-bold text-sm text-[#19182A]">{player.name}</h4>
                <p className="text-xs text-[#77788B]">{player.status}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#FF7438] tabular-nums block">
                  {player.points}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">PTS</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

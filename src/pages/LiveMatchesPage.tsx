import React, { useState } from 'react';
import { Zap, Trophy, MapPin, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCricket } from '../context/CricketContext';

export const LiveMatchesPage: React.FC = () => {
  const { matches, selectedMatch, setSelectedMatchId, setActiveTab } = useCricket();
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const upcomingMatches = [
    {
      id: 'match_mi_csk_2024',
      tournament: 'T20 Premier League - Rivalry Week',
      venue: 'Wankhede Stadium, Mumbai',
      format: 'T20',
      status: 'UPCOMING',
      teamA: { name: 'Chennai Super Kings', shortName: 'CSK', logo: '🦁' },
      teamB: { name: 'Mumbai Indians', shortName: 'MI', logo: '⚡' },
      startTime: 'Tonight, 7:30 PM IST',
    },
    {
      id: 'match_aus_nz_2024',
      tournament: 'Trans-Tasman T20 Cup',
      venue: 'Melbourne Cricket Ground, Melbourne',
      format: 'T20',
      status: 'UPCOMING',
      teamA: { name: 'New Zealand', shortName: 'NZ', logo: '🇳🇿' },
      teamB: { name: 'Australia', shortName: 'AUS', logo: '🇦🇺' },
      startTime: 'Tomorrow, 1:30 PM IST',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E9E9F1]">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-[#5425C9]" />
            <h1 className="text-2xl font-black text-[#19182A]">Live & Upcoming Matches</h1>
          </div>
          <p className="text-xs text-[#77788B]">Browse active simulator fixtures, live scoreboards, and upcoming tournament clashes</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-[#E9E9F1]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all' ? 'bg-[#5425C9] text-white' : 'text-[#77788B] hover:text-[#19182A]'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setFilter('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              filter === 'live' ? 'bg-[#5425C9] text-white' : 'text-[#77788B] hover:text-[#19182A]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Simulators ({matches.length})</span>
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'upcoming' ? 'bg-[#5425C9] text-white' : 'text-[#77788B] hover:text-[#19182A]'
            }`}
          >
            Upcoming (2)
          </button>
        </div>
      </div>

      {/* Live Simulators Section */}
      {(filter === 'all' || filter === 'live') && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#19182A]">
              Live Simulated Encounters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {matches.map((m) => {
              const isSelected = m.id === selectedMatch.id;
              return (
                <div
                  key={m.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
                    isSelected ? 'border-[#5425C9] ring-2 ring-[#5425C9]/15' : 'border-[#E9E9F1]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#77788B] pb-3 border-b border-[#E9E9F1]">
                    <div className="flex items-center space-x-1.5">
                      <Trophy className="w-3.5 h-3.5 text-[#5425C9]" />
                      <span className="font-semibold text-[#19182A]">{m.tournament}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      LIVE SIM
                    </span>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{m.teamB.logo}</span>
                        <div>
                          <span className="font-bold text-sm text-[#19182A]">{m.teamB.name}</span>
                          <span className="text-[10px] text-gray-500 block">Chasing target {m.target || 182}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-base text-[#19182A] tabular-nums block">
                          {m.runs}/{m.wickets}
                        </span>
                        <span className="text-xs text-gray-500 tabular-nums">
                          ({m.completedOvers}.{m.ballsInCurrentOver} / {m.totalOvers} ov)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{m.teamA.logo}</span>
                        <span className="font-medium text-sm text-gray-700">{m.teamA.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-gray-700 tabular-nums">
                          {m.firstInningsTotal?.runs}/{m.firstInningsTotal?.wickets} (20.0 ov)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E9E9F1] flex flex-wrap items-center justify-between text-xs gap-2">
                    <span className="text-rose-600 font-semibold">{m.statusText}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMatchId(m.id);
                          setActiveTab('match-centre');
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1 transition ${
                          isSelected
                            ? 'bg-[#5425C9] text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-[#19182A]'
                        }`}
                      >
                        <span>{isSelected ? 'Open Selected Centre' : 'Select & Play'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Fixtures Section */}
      {(filter === 'all' || filter === 'upcoming') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#FF7438]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#19182A]">
              Upcoming Tournament Fixtures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcomingMatches.map((up) => (
              <div
                key={up.id}
                className="bg-white rounded-2xl border border-[#E9E9F1] p-5 shadow-2xs hover:border-gray-300 transition"
              >
                <div className="flex items-center justify-between text-xs text-[#77788B] pb-3 border-b border-[#E9E9F1]">
                  <span className="font-semibold text-[#19182A]">{up.tournament}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-[#5425C9]">
                    {up.startTime}
                  </span>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{up.teamA.logo}</span>
                    <div>
                      <p className="font-bold text-sm text-[#19182A]">{up.teamA.name}</p>
                      <p className="text-[11px] text-gray-400">Match 42</p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-[#77788B] px-3 py-1 bg-gray-100 rounded-full">
                    VS
                  </span>

                  <div className="flex items-center space-x-3 text-right">
                    <div>
                      <p className="font-bold text-sm text-[#19182A]">{up.teamB.name}</p>
                      <p className="text-[11px] text-gray-400">Match 42</p>
                    </div>
                    <span className="text-3xl">{up.teamB.logo}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E9E9F1] flex items-center justify-between text-xs text-[#77788B]">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {up.venue}
                  </span>
                  <button
                    onClick={() => setActiveTab('fantasy')}
                    className="text-[#FF7438] font-bold hover:underline"
                  >
                    Build Fantasy XI →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

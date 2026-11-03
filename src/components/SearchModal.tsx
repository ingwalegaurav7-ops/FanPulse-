import React, { useState } from 'react';
import { Search, X, Zap, ChevronRight, User, Trophy } from 'lucide-react';
import { useCricket } from '../context/CricketContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { matches, setSelectedMatchId, setActiveTab, selectedMatch } = useCricket();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const allPlayers = [...selectedMatch.teamA.players, ...selectedMatch.teamB.players];
  const q = query.toLowerCase().trim();

  const filteredMatches = matches.filter(
    (m) =>
      m.teamA.name.toLowerCase().includes(q) ||
      m.teamB.name.toLowerCase().includes(q) ||
      m.tournament.toLowerCase().includes(q) ||
      m.venue.toLowerCase().includes(q)
  );

  const filteredPlayers = q.length > 1
    ? allPlayers.filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-[#E9E9F1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E9E9F1]">
          <Search className="w-5 h-5 text-[#77788B] mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search matches, tournaments, players (e.g. India, Cummins, SKY)..."
            className="w-full text-sm text-[#19182A] placeholder-[#77788B] focus:outline-hidden"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4">
          {/* Matches Category */}
          <div>
            <div className="text-[11px] font-bold text-[#77788B] uppercase tracking-wider mb-2 flex items-center">
              <Trophy className="w-3.5 h-3.5 mr-1 text-[#5425C9]" />
              Matches
            </div>
            <div className="space-y-1.5">
              {filteredMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMatchId(m.id);
                    setActiveTab('match-centre');
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-[#F7F8FC] flex items-center justify-between border border-transparent hover:border-[#E9E9F1] transition group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{m.teamB.logo}</span>
                    <div>
                      <div className="text-xs font-bold text-[#19182A] group-hover:text-[#5425C9]">
                        {m.teamB.name} vs {m.teamA.name}
                      </div>
                      <div className="text-[11px] text-[#77788B]">{m.tournament}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold bg-[#5425C9]/10 text-[#5425C9] px-2 py-0.5 rounded">
                      {m.runs}/{m.wickets}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Players Category */}
          {filteredPlayers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#77788B] uppercase tracking-wider mb-2 flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-[#FF7438]" />
                Players
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredPlayers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveTab('fantasy');
                      onClose();
                    }}
                    className="text-left p-2 rounded-xl hover:bg-[#F7F8FC] border border-[#E9E9F1] flex items-center justify-between transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#19182A]">{p.name}</div>
                      <div className="text-[10px] text-[#77788B]">
                        {p.team} • {p.role} • {p.credits} Credits
                      </div>
                    </div>
                    <span className="text-[10px] text-[#5425C9] font-bold">View in XI</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick AI Questions */}
          <div>
            <div className="text-[11px] font-bold text-[#77788B] uppercase tracking-wider mb-2 flex items-center">
              <Zap className="w-3.5 h-3.5 mr-1 text-[#FF7438]" />
              Quick AI Insights
            </div>
            <div className="space-y-1">
              {[
                'Why did the momentum change?',
                'Can the chasing team still win?',
                'Who has made the biggest fantasy impact?',
              ].map((qText, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab('companion');
                    onClose();
                  }}
                  className="w-full text-left text-xs p-2 rounded-lg hover:bg-indigo-50 text-[#5425C9] font-medium flex items-center justify-between"
                >
                  <span>Ask: "{qText}"</span>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F7F8FC] px-4 py-2.5 border-t border-[#E9E9F1] text-[11px] text-[#77788B] flex justify-between">
          <span>Search FanPulse Cricket Engine</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};

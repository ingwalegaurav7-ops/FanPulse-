import React, { useState } from 'react';
import {
  Award,
  Crown,
  Shield,
  Zap,
  CheckCircle2,
  Users,
  ChevronRight,
  TrendingUp,
  HelpCircle,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  Trophy,
  BookOpen
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { Player, FantasyPlayerPoint } from '../types/cricket';
import { FANTASY_SCORING_RULES } from '../utils/fantasyScoring';

export const FantasyImpactPage: React.FC = () => {
  const {
    selectedMatch,
    fantasyTeam,
    togglePlayerInFantasy,
    setCaptain,
    setViceCaptain,
    loadPrebuiltFantasyXI,
    setActiveTab,
  } = useCricket();

  const [roleFilter, setRoleFilter] = useState<'ALL' | 'WK' | 'BAT' | 'AR' | 'BOWL'>('ALL');
  const [activeTab, setActiveTabLocal] = useState<'lineup' | 'leaderboard' | 'rules'>('lineup');
  const [selectedPlayerForDetail, setSelectedPlayerForDetail] = useState<FantasyPlayerPoint | null>(null);

  // Combine both teams' players for the match
  const allMatchPlayers: Player[] = [
    ...selectedMatch.teamA.players,
    ...selectedMatch.teamB.players,
  ];

  const filteredPlayers = allMatchPlayers.filter((p) => {
    if (roleFilter === 'ALL') return true;
    return p.role === roleFilter;
  });

  // Role counters in current XI
  const selectedPlayers = allMatchPlayers.filter((p) =>
    fantasyTeam.selectedPlayerIds.includes(p.id)
  );
  const wkCount = selectedPlayers.filter((p) => p.role === 'WK').length;
  const batCount = selectedPlayers.filter((p) => p.role === 'BAT').length;
  const arCount = selectedPlayers.filter((p) => p.role === 'AR').length;
  const bowlCount = selectedPlayers.filter((p) => p.role === 'BOWL').length;

  const totalCredits = selectedPlayers.reduce((acc, p) => acc + p.credits, 0);

  // Simulated Fantasy Rivals Leaderboard
  const leaderboard = [
    { rank: 1, manager: "Gaurav's Pulse XI (You)", captain: 'SK Yadav (C)', points: fantasyTeam.totalPoints, delta: '+18' },
    { rank: 2, manager: 'Rohit Smashers', captain: 'R Sharma (C)', points: Math.max(380, fantasyTeam.totalPoints - 24), delta: '+4' },
    { rank: 3, manager: 'Cummins Lightning XI', captain: 'P Cummins (C)', points: Math.max(350, fantasyTeam.totalPoints - 48), delta: '+25' },
    { rank: 4, manager: 'Caribbean Masters', captain: 'H Pandya (C)', points: Math.max(330, fantasyTeam.totalPoints - 62), delta: '+8' },
    { rank: 5, manager: 'CricketGeek99', captain: 'T Head (C)', points: Math.max(310, fantasyTeam.totalPoints - 80), delta: '+0' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E9E9F1]">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-[#5425C9]" />
            <h1 className="text-2xl font-black text-[#19182A]">My Fantasy Team</h1>
          </div>
          <p className="text-xs text-[#77788B]">
            Interactive squad selector with live ball-by-ball point recalculation and captain multipliers
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadPrebuiltFantasyXI}
            className="px-3.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#5425C9] font-bold text-xs flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF7438]" />
            <span>Load Marquee 11 XI</span>
          </button>
          <button
            onClick={() => setActiveTab('match-centre')}
            className="px-3.5 py-1.5 rounded-xl bg-[#5425C9] hover:bg-[#431db0] text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Match Ball</span>
          </button>
        </div>
      </div>

      {/* Top Fantasy Squad Summary Banner */}
      <div className="bg-gradient-to-r from-[#19182A] via-[#241F3D] to-[#19182A] rounded-2xl text-white p-5 shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
              Total Fantasy Points
            </span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-3xl font-black text-[#FF7438] tabular-nums">
                {fantasyTeam.totalPoints}
              </span>
              <span className="text-xs text-gray-400">PTS</span>
            </div>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
              Captain (2.0x)
            </span>
            <p className="font-extrabold text-white text-sm mt-0.5 flex items-center space-x-1">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <span className="truncate">
                {allMatchPlayers.find((p) => p.id === fantasyTeam.captainId)?.shortName || 'Not selected'}
              </span>
            </p>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
              Vice Captain (1.5x)
            </span>
            <p className="font-extrabold text-white text-sm mt-0.5 flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-blue-400 fill-blue-400 shrink-0" />
              <span className="truncate">
                {allMatchPlayers.find((p) => p.id === fantasyTeam.viceCaptainId)?.shortName || 'Not selected'}
              </span>
            </p>
          </div>

          <div>
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
              Squad Count
            </span>
            <p className="font-extrabold text-white text-sm mt-0.5 tabular-nums">
              {fantasyTeam.selectedPlayerIds.length}/11 Players
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">
              Credits Used
            </span>
            <p className="font-extrabold text-emerald-400 text-sm mt-0.5 tabular-nums">
              {totalCredits.toFixed(1)} / 100.0 Cr
            </p>
          </div>
        </div>

        {/* Squad Composition Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-300 gap-2">
          <div className="flex items-center space-x-4">
            <span>WK: <strong className="text-white">{wkCount}</strong></span>
            <span>BAT: <strong className="text-white">{batCount}</strong></span>
            <span>AR: <strong className="text-white">{arCount}</strong></span>
            <span>BOWL: <strong className="text-white">{bowlCount}</strong></span>
          </div>
          <span className="text-[11px] text-amber-300 font-medium">
            Simulate runs or wickets in Match Centre to see your points update instantly!
          </span>
        </div>
      </div>

      {/* Fantasy XI Tabs with purple text, light-purple background and purple underline */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E9E9F1]">
        <button
          onClick={() => setActiveTabLocal('lineup')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'lineup'
              ? 'bg-[#F0EBFC] text-[#5425C9] border-b-2 border-[#5425C9] shadow-2xs'
              : 'text-[#77788B] hover:text-[#5425C9] hover:bg-purple-50/50 border-b-2 border-transparent'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'lineup' ? 'text-[#5425C9]' : 'text-[#77788B]'}`} />
          <span>Squad Selection & Live Points</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-black tabular-nums ${
              activeTab === 'lineup' ? 'bg-[#5425C9] text-white' : 'bg-gray-200/80 text-gray-700'
            }`}
          >
            {fantasyTeam.selectedPlayerIds.length}/11
          </span>
        </button>

        <button
          onClick={() => setActiveTabLocal('leaderboard')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-[#F0EBFC] text-[#5425C9] border-b-2 border-[#5425C9] shadow-2xs'
              : 'text-[#77788B] hover:text-[#5425C9] hover:bg-purple-50/50 border-b-2 border-transparent'
          }`}
        >
          <Trophy className={`w-4 h-4 ${activeTab === 'leaderboard' ? 'text-[#5425C9]' : 'text-[#77788B]'}`} />
          <span>Fantasy Contest Leaderboard</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
            Live
          </span>
        </button>

        <button
          onClick={() => setActiveTabLocal('rules')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all ${
            activeTab === 'rules'
              ? 'bg-[#F0EBFC] text-[#5425C9] border-b-2 border-[#5425C9] shadow-2xs'
              : 'text-[#77788B] hover:text-[#5425C9] hover:bg-purple-50/50 border-b-2 border-transparent'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'rules' ? 'text-[#5425C9]' : 'text-[#77788B]'}`} />
          <span>Illustrative Scoring Rules</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'lineup' && (
        <div className="space-y-4">
          {/* Role Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-[#E9E9F1]">
              {(['ALL', 'WK', 'BAT', 'AR', 'BOWL'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    roleFilter === role ? 'bg-[#5425C9] text-white shadow-xs' : 'text-[#77788B] hover:text-[#19182A]'
                  }`}
                >
                  {role === 'ALL' ? 'All Roles' : role}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#77788B]">
              Click <strong>(C)</strong> for 2x Captain or <strong>(VC)</strong> for 1.5x Vice-Captain.
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map((player) => {
              const isSelected = fantasyTeam.selectedPlayerIds.includes(player.id);
              const isCap = fantasyTeam.captainId === player.id;
              const isVc = fantasyTeam.viceCaptainId === player.id;
              const ptInfo = fantasyTeam.playerPoints[player.id];

              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-2xl bg-white border transition-all ${
                    isSelected ? 'border-[#5425C9] shadow-xs' : 'border-[#E9E9F1] opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-[#19182A]">{player.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 text-gray-700">
                          {player.team}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#77788B] mt-0.5">
                        {player.role} • {player.credits} Credits • {player.battingStyle}
                      </p>
                    </div>

                    {/* Add/Remove Button */}
                    <button
                      onClick={() => togglePlayerInFantasy(player.id)}
                      className={`p-1.5 rounded-xl transition ${
                        isSelected ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-[#5425C9]/10 text-[#5425C9] hover:bg-[#5425C9]/20'
                      }`}
                      title={isSelected ? 'Remove from Squad' : 'Add to Squad'}
                    >
                      {isSelected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Points & Multipliers Strip */}
                  <div className="mt-3 pt-3 border-t border-[#E9E9F1] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                        Fantasy Points
                      </span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xl font-black text-[#5425C9] tabular-nums">
                          {ptInfo?.totalPoints || 0}
                        </span>
                        {(isCap || isVc) && (
                          <span className="text-[10px] font-bold text-[#FF7438]">
                            ({isCap ? '2.0x' : '1.5x'})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Captain & VC Controls */}
                    {isSelected && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setCaptain(player.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                            isCap
                              ? 'bg-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300'
                              : 'bg-gray-100 text-gray-600 hover:bg-amber-100'
                          }`}
                          title="Assign as Captain (2x multiplier)"
                        >
                          C
                        </button>
                        <button
                          onClick={() => setViceCaptain(player.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                            isVc
                              ? 'bg-blue-500 text-white shadow-xs ring-2 ring-blue-300'
                              : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                          }`}
                          title="Assign as Vice-Captain (1.5x multiplier)"
                        >
                          VC
                        </button>
                        <button
                          onClick={() => setSelectedPlayerForDetail(ptInfo || null)}
                          className="px-2 py-1 text-[11px] text-[#77788B] hover:text-[#5425C9] font-medium"
                        >
                          Breakdown
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
            <div>
              <h3 className="font-extrabold text-sm text-[#19182A]">Mega Contest Live Standings</h3>
              <p className="text-xs text-[#77788B]">Rankings dynamically calculated from match score simulator events</p>
            </div>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Contest Active
            </span>
          </div>

          <div className="divide-y divide-gray-100 mt-2">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`py-3.5 flex items-center justify-between ${
                  user.rank === 1 ? 'bg-[#5425C9]/5 px-3 rounded-xl font-bold' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      user.rank === 1
                        ? 'bg-[#FF7438] text-white'
                        : user.rank === 2
                        ? 'bg-gray-200 text-gray-700'
                        : 'text-gray-400'
                    }`}
                  >
                    #{user.rank}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-[#19182A]">{user.manager}</span>
                    <span className="text-[10px] text-gray-400 block">{user.captain}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs text-emerald-600 font-bold tabular-nums">{user.delta}</span>
                  <span className="text-base font-extrabold text-[#19182A] tabular-nums">{user.points} PTS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scoring Rules Tab */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-[#E9E9F1]">
            <h3 className="font-bold text-sm text-[#19182A]">Illustrative Fantasy Scoring Rules</h3>
            <p className="text-xs text-[#77788B]">
              Configured for demonstration purposes in FanPulse AI engine. Transparent and documented.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FANTASY_SCORING_RULES.map((rule, idx) => (
              <div key={idx} className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E9E9F1] flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-[#19182A] block">{rule.event}</span>
                  <span className="text-[10px] text-gray-400">{rule.category}</span>
                </div>
                <span className="font-black text-[#5425C9] tabular-nums text-sm">{rule.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Point Breakdown Modal */}
      {selectedPlayerForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-[#E9E9F1] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
              <div>
                <h3 className="font-bold text-base text-[#19182A]">{selectedPlayerForDetail.playerName}</h3>
                <p className="text-xs text-[#77788B]">
                  {selectedPlayerForDetail.team} • {selectedPlayerForDetail.role}
                  {selectedPlayerForDetail.isCaptain ? ' • Captain (2x)' : selectedPlayerForDetail.isViceCaptain ? ' • Vice Captain (1.5x)' : ''}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlayerForDetail(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Runs Scored Points</span>
                <span className="font-bold tabular-nums">+{selectedPlayerForDetail.breakdown.runsPoints} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Boundary Bonus (4s)</span>
                <span className="font-bold tabular-nums">+{selectedPlayerForDetail.breakdown.boundaryBonus} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Sixes Bonus (6s)</span>
                <span className="font-bold tabular-nums">+{selectedPlayerForDetail.breakdown.sixBonus} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Wickets Points</span>
                <span className="font-bold tabular-nums">+{selectedPlayerForDetail.breakdown.wicketPoints} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Economy Bonus/Penalty</span>
                <span className="font-bold tabular-nums">{selectedPlayerForDetail.breakdown.economyBonus} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Strike Rate Bonus</span>
                <span className="font-bold tabular-nums">+{selectedPlayerForDetail.breakdown.strikeRateBonus} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Milestone Bonuses</span>
                <span className="font-bold tabular-nums">+{selectedPlayerForDetail.breakdown.milestoneBonus} pts</span>
              </div>
              <div className="flex justify-between py-1 pt-2 font-bold text-sm text-[#5425C9]">
                <span>Total Calculated Points</span>
                <span className="tabular-nums">{selectedPlayerForDetail.totalPoints} PTS</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlayerForDetail(null)}
              className="w-full py-2.5 rounded-xl bg-[#5425C9] text-white font-bold text-xs"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

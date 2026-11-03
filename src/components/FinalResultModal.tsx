import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Crown,
  RotateCcw,
  X,
  CheckCircle2,
  ChevronDown,
  Layers,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Flame
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';

interface FinalResultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FinalResultModal: React.FC<FinalResultModalProps> = ({ isOpen, onClose }) => {
  const { selectedMatch, resetCurrentMatch, setActiveTab } = useCricket();
  const [activeInningsTab, setActiveInningsTab] = useState<'both' | 'inn1' | 'inn2'>('both');

  if (!isOpen) return null;

  const result = selectedMatch.result;
  const teamA = selectedMatch.teamA;
  const teamB = selectedMatch.teamB;
  const inn1 = selectedMatch.firstInningsScorecard;

  const totalBalls = selectedMatch.completedOvers * 6 + selectedMatch.ballsInCurrentOver;
  const inn2RunRate = totalBalls > 0 ? ((selectedMatch.runs / totalBalls) * 6).toFixed(2) : '0.00';

  const battingTeamName = selectedMatch.battingTeamId === teamA.id ? teamA.name : teamB.name;
  const bowlingTeamName = selectedMatch.bowlingTeamId === teamA.id ? teamA.name : teamB.name;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md p-3 sm:p-6 flex items-start justify-center">
      <div className="bg-[#F7F8FC] w-full max-w-5xl rounded-3xl border border-[#E9E9F1] shadow-2xl overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Victory Hero Banner */}
        <div className="bg-gradient-to-r from-[#19182A] via-[#2D1B69] to-[#19182A] text-white p-6 sm:p-8 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#5425C9]/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7438]/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FF7438] text-white tracking-widest uppercase shadow-md flex items-center space-x-1.5 animate-pulse">
                <Trophy className="w-3.5 h-3.5" />
                <span>FINAL RESULT</span>
              </span>
              <span className="text-xs text-gray-300 font-semibold">{selectedMatch.tournament}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
              title="Close scorecard view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Victory Announcement Header */}
          <div className="relative z-10 py-6 text-center space-y-2">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-2">
              <Trophy className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {result?.winnerTeamName} {result?.marginText}
            </h2>

            <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto font-medium">
              {result?.resultSummary || selectedMatch.statusText}
            </p>

            <p className="text-xs text-gray-400">
              {selectedMatch.venue} • {selectedMatch.format} International
            </p>
          </div>

          {/* Side-by-Side Team Score Cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* 1st Innings Team Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{inn1 ? (inn1.teamId === 'AUS' ? '🇦🇺' : '🇮🇳') : teamA.logo}</span>
                <div>
                  <h4 className="font-extrabold text-base text-white">{inn1?.teamName || teamA.name}</h4>
                  <span className="text-xs text-gray-400">1st Innings (Defended)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white tabular-nums block">
                  {inn1 ? `${inn1.totalRuns}/${inn1.wickets}` : `${selectedMatch.firstInningsTotal?.runs || 181}/${selectedMatch.firstInningsTotal?.wickets || 7}`}
                </span>
                <span className="text-xs text-gray-300 tabular-nums">20.0 ov (RR {inn1?.runRate || 9.05})</span>
              </div>
            </div>

            {/* 2nd Innings Team Summary */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedMatch.battingTeamId === 'IND' ? '🇮🇳' : '🇦🇺'}</span>
                <div>
                  <h4 className="font-extrabold text-base text-white">{battingTeamName}</h4>
                  <span className="text-xs text-emerald-400 font-semibold">2nd Innings (Target {selectedMatch.target || 182})</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#FF7438] tabular-nums block">
                  {selectedMatch.runs}/{selectedMatch.wickets}
                </span>
                <span className="text-xs text-gray-300 tabular-nums">
                  {selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} ov (RR {inn2RunRate})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Player of the Match & Top Performers Bar */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E9E9F1]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Player of the Match Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-50 to-white border border-amber-300/60 flex items-center space-x-3.5 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                <Crown className="w-6 h-6 fill-white" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/60 px-1.5 py-0.2 rounded-xs">
                    PLAYER OF THE MATCH
                  </span>
                </div>
                <h4 className="font-black text-sm sm:text-base text-[#19182A] truncate">
                  {result?.playerOfTheMatch.name || 'Rohit Sharma'}
                </h4>
                <p className="text-xs text-[#77788B] truncate font-medium">
                  {result?.playerOfTheMatch.performance || '57 (32b, 6x4, 4x6)'}
                </p>
              </div>
            </div>

            {/* Top Match Scorer */}
            <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-[#E9E9F1] flex items-center space-x-3.5 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-[#5425C9]/10 text-[#5425C9] flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-[#FF7438]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#5425C9]">
                  TOP SCORER
                </span>
                <h4 className="font-extrabold text-sm text-[#19182A]">
                  {result?.topScorer.name || 'Travis Head'}
                </h4>
                <p className="text-xs text-[#77788B]">
                  <strong>{result?.topScorer.runs} runs</strong> ({result?.topScorer.balls} balls) • {result?.topScorer.team}
                </p>
              </div>
            </div>

            {/* Best Match Bowling */}
            <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-[#E9E9F1] flex items-center space-x-3.5 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                  BEST BOWLER
                </span>
                <h4 className="font-extrabold text-sm text-[#19182A]">
                  {result?.bestBowler.name || 'Arshdeep Singh'}
                </h4>
                <p className="text-xs text-[#77788B]">
                  Figures: <strong>{result?.bestBowler.figures}</strong> • {result?.bestBowler.team}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Innings Tabs */}
        <div className="bg-white px-6 border-b border-[#E9E9F1] flex items-center space-x-6 text-xs font-bold">
          <button
            onClick={() => setActiveInningsTab('both')}
            className={`py-3.5 border-b-2 transition ${
              activeInningsTab === 'both' ? 'border-[#5425C9] text-[#5425C9]' : 'border-transparent text-[#77788B] hover:text-[#19182A]'
            }`}
          >
            Full Match Scorecard (Both Innings)
          </button>
          <button
            onClick={() => setActiveInningsTab('inn1')}
            className={`py-3.5 border-b-2 transition ${
              activeInningsTab === 'inn1' ? 'border-[#5425C9] text-[#5425C9]' : 'border-transparent text-[#77788B] hover:text-[#19182A]'
            }`}
          >
            1st Innings: {inn1?.teamName || 'Australia'} ({inn1?.totalRuns || 181}/{inn1?.wickets || 7})
          </button>
          <button
            onClick={() => setActiveInningsTab('inn2')}
            className={`py-3.5 border-b-2 transition ${
              activeInningsTab === 'inn2' ? 'border-[#5425C9] text-[#5425C9]' : 'border-transparent text-[#77788B] hover:text-[#19182A]'
            }`}
          >
            2nd Innings: {battingTeamName} ({selectedMatch.runs}/{selectedMatch.wickets})
          </button>
        </div>

        {/* Scorecards Container */}
        <div className="p-5 sm:p-6 space-y-8">
          {/* 1st Innings Complete Scorecard */}
          {(activeInningsTab === 'both' || activeInningsTab === 'inn1') && inn1 && (
            <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs overflow-hidden">
              <div className="bg-[#19182A] text-white p-3.5 sm:p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    1st Innings • {inn1.teamName} Batting
                  </h3>
                  <span className="text-xs text-gray-400">
                    {inn1.totalRuns}/{inn1.wickets} in {inn1.completedOvers}.0 overs (RR {inn1.runRate})
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-gray-200">
                  Target Set: {selectedMatch.target || 182}
                </span>
              </div>

              {/* Batting Table */}
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E9E9F1] text-[#77788B] font-semibold">
                      <th className="py-2.5">Batter</th>
                      <th className="py-2.5">Dismissal</th>
                      <th className="py-2.5 text-right">R</th>
                      <th className="py-2.5 text-right">B</th>
                      <th className="py-2.5 text-right">4s</th>
                      <th className="py-2.5 text-right">6s</th>
                      <th className="py-2.5 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {inn1.batting.map((bat) => (
                      <tr key={bat.playerId} className="hover:bg-[#F7F8FC]">
                        <td className="py-2.5 font-bold text-[#19182A]">{bat.name}</td>
                        <td className="py-2.5 text-gray-500">{bat.dismissal}</td>
                        <td className="py-2.5 text-right font-black text-[#19182A] tabular-nums">{bat.runs}</td>
                        <td className="py-2.5 text-right text-gray-600 tabular-nums">{bat.balls}</td>
                        <td className="py-2.5 text-right text-gray-600 tabular-nums">{bat.fours}</td>
                        <td className="py-2.5 text-right text-gray-600 tabular-nums">{bat.sixes}</td>
                        <td className="py-2.5 text-right font-semibold text-gray-700 tabular-nums">{bat.strikeRate.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Extras & Fall of Wickets */}
                <div className="mt-4 pt-3 border-t border-[#E9E9F1] text-xs space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Extras:</span>
                    <span>
                      {inn1.extras.total} (b {inn1.extras.byes}, lb {inn1.extras.legByes}, w {inn1.extras.wides}, nb {inn1.extras.noBalls}, p {inn1.extras.penalty})
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Total Score:</span>
                    <span className="font-extrabold text-[#19182A]">
                      {inn1.totalRuns}/{inn1.wickets} (20.0 overs)
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 text-[11px] text-[#77788B]">
                    <span className="font-bold text-[#19182A] mr-1">Fall of Wickets:</span>
                    {inn1.fallOfWickets.map((f, i) => (
                      <span key={i} className="mr-2">
                        {f.wicketNumber}-{f.score} ({f.playerOutName}, {f.overText} ov){i < inn1.fallOfWickets.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bowling Table */}
              <div className="bg-[#F7F8FC] p-4 border-t border-[#E9E9F1]">
                <h4 className="font-bold text-xs text-[#77788B] uppercase tracking-wider mb-2">
                  Bowling • {inn1.teamName === teamA.name ? teamB.name : teamA.name}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E9E9F1] text-[#77788B] font-semibold">
                        <th className="py-2">Bowler</th>
                        <th className="py-2 text-right">O</th>
                        <th className="py-2 text-right">M</th>
                        <th className="py-2 text-right">R</th>
                        <th className="py-2 text-right">W</th>
                        <th className="py-2 text-right">ECON</th>
                        <th className="py-2 text-right">WD</th>
                        <th className="py-2 text-right">NB</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {inn1.bowling.map((bw) => (
                        <tr key={bw.playerId}>
                          <td className="py-2 font-bold text-[#19182A]">{bw.name}</td>
                          <td className="py-2 text-right tabular-nums">{bw.overs}.{bw.ballsThisOver}</td>
                          <td className="py-2 text-right tabular-nums">{bw.maidens}</td>
                          <td className="py-2 text-right tabular-nums">{bw.runsConceded}</td>
                          <td className="py-2 text-right font-black text-rose-600 tabular-nums">{bw.wickets}</td>
                          <td className="py-2 text-right font-bold text-blue-600 tabular-nums">{bw.economy.toFixed(2)}</td>
                          <td className="py-2 text-right text-gray-500 tabular-nums">{bw.wides || 0}</td>
                          <td className="py-2 text-right text-gray-500 tabular-nums">{bw.noBalls || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2nd Innings Complete Scorecard */}
          {(activeInningsTab === 'both' || activeInningsTab === 'inn2') && (
            <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs overflow-hidden">
              <div className="bg-gradient-to-r from-[#5425C9] to-[#7351E8] text-white p-3.5 sm:p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    2nd Innings • {battingTeamName} Batting (Chase)
                  </h3>
                  <span className="text-xs text-indigo-100">
                    {selectedMatch.runs}/{selectedMatch.wickets} in {selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} overs (RR {inn2RunRate})
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-[#5425C9]">
                  Target: {selectedMatch.target || 182}
                </span>
              </div>

              {/* Batting Table */}
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E9E9F1] text-[#77788B] font-semibold">
                      <th className="py-2.5">Batter</th>
                      <th className="py-2.5">Dismissal</th>
                      <th className="py-2.5 text-right">R</th>
                      <th className="py-2.5 text-right">B</th>
                      <th className="py-2.5 text-right">4s</th>
                      <th className="py-2.5 text-right">6s</th>
                      <th className="py-2.5 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedMatch.battingScorecard.map((bat) => (
                      <tr key={bat.playerId} className="hover:bg-[#F7F8FC]">
                        <td className="py-2.5 font-bold text-[#19182A]">
                          {bat.name} {!bat.isOut && <span className="text-[#5425C9] font-black">*</span>}
                        </td>
                        <td className="py-2.5 text-gray-500">{bat.isOut ? bat.dismissal : 'not out'}</td>
                        <td className="py-2.5 text-right font-black text-[#19182A] tabular-nums">{bat.runs}</td>
                        <td className="py-2.5 text-right text-gray-600 tabular-nums">{bat.balls}</td>
                        <td className="py-2.5 text-right text-gray-600 tabular-nums">{bat.fours}</td>
                        <td className="py-2.5 text-right text-gray-600 tabular-nums">{bat.sixes}</td>
                        <td className="py-2.5 text-right font-semibold text-gray-700 tabular-nums">{bat.strikeRate.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Extras & Fall of Wickets */}
                <div className="mt-4 pt-3 border-t border-[#E9E9F1] text-xs space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Extras:</span>
                    <span>
                      {selectedMatch.extras.total} (b {selectedMatch.extras.byes}, lb {selectedMatch.extras.legByes}, w {selectedMatch.extras.wides}, nb {selectedMatch.extras.noBalls}, p {selectedMatch.extras.penalty})
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Total Innings Score:</span>
                    <span className="font-extrabold text-[#19182A]">
                      {selectedMatch.runs}/{selectedMatch.wickets} ({selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} overs)
                    </span>
                  </div>
                  {selectedMatch.fallOfWickets.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 text-[11px] text-[#77788B]">
                      <span className="font-bold text-[#19182A] mr-1">Fall of Wickets:</span>
                      {selectedMatch.fallOfWickets.map((f, i) => (
                        <span key={i} className="mr-2">
                          {f.wicketNumber}-{f.score} ({f.playerOutName}, {f.overText} ov){i < selectedMatch.fallOfWickets.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bowling Table */}
              <div className="bg-[#F7F8FC] p-4 border-t border-[#E9E9F1]">
                <h4 className="font-bold text-xs text-[#77788B] uppercase tracking-wider mb-2">
                  Bowling • {bowlingTeamName}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E9E9F1] text-[#77788B] font-semibold">
                        <th className="py-2">Bowler</th>
                        <th className="py-2 text-right">O</th>
                        <th className="py-2 text-right">M</th>
                        <th className="py-2 text-right">R</th>
                        <th className="py-2 text-right">W</th>
                        <th className="py-2 text-right">ECON</th>
                        <th className="py-2 text-right">WD</th>
                        <th className="py-2 text-right">NB</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedMatch.bowlingScorecard.map((bw) => (
                        <tr key={bw.playerId}>
                          <td className="py-2 font-bold text-[#19182A]">{bw.name}</td>
                          <td className="py-2 text-right tabular-nums">{bw.overs}.{bw.ballsThisOver}</td>
                          <td className="py-2 text-right tabular-nums">{bw.maidens}</td>
                          <td className="py-2 text-right tabular-nums">{bw.runsConceded}</td>
                          <td className="py-2 text-right font-black text-rose-600 tabular-nums">{bw.wickets}</td>
                          <td className="py-2 text-right font-bold text-blue-600 tabular-nums">{bw.economy.toFixed(2)}</td>
                          <td className="py-2 text-right text-gray-500 tabular-nums">{bw.wides || 0}</td>
                          <td className="py-2 text-right text-gray-500 tabular-nums">{bw.noBalls || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="bg-white p-5 border-t border-[#E9E9F1] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              resetCurrentMatch();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#19182A] font-bold text-xs flex items-center space-x-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay & Reset Match</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => {
                onClose();
                setActiveTab('companion');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#5425C9]/10 hover:bg-[#5425C9]/20 text-[#5425C9] font-bold text-xs flex items-center space-x-1.5 transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Ask AI Match Breakdown</span>
            </button>
            <button
              onClick={() => {
                onClose();
                setActiveTab('live-matches');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#5425C9] hover:bg-[#431db0] text-white font-bold text-xs shadow-md transition"
            >
              Back to Matches
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

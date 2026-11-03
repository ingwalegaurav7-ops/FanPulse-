import React, { useState } from 'react';
import {
  Trophy,
  TrendingUp,
  Flame,
  Users,
  Shield,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { BallSimulator } from './BallSimulator';

export const Scoreboard: React.FC = () => {
  const { selectedMatch, setIsFinalScorecardOpen, setIsBowlerModalOpen } = useCricket();
  const [activeTab, setActiveTab] = useState<'summary' | 'batting' | 'bowling' | 'partnerships'>('summary');

  const battingTeam = selectedMatch.battingTeamId === selectedMatch.teamA.id ? selectedMatch.teamA : selectedMatch.teamB;
  const bowlingTeam = selectedMatch.bowlingTeamId === selectedMatch.teamA.id ? selectedMatch.teamA : selectedMatch.teamB;

  const target = selectedMatch.target || 182;
  const runsRemaining = Math.max(0, target - selectedMatch.runs);
  const totalBalls = selectedMatch.totalOvers * 6;
  const ballsBowled = selectedMatch.completedOvers * 6 + selectedMatch.ballsInCurrentOver;
  const ballsRemaining = Math.max(0, totalBalls - ballsBowled);

  const crr = ballsBowled > 0 ? ((selectedMatch.runs / ballsBowled) * 6).toFixed(2) : '0.00';
  const rrr = ballsRemaining > 0 ? ((runsRemaining / ballsRemaining) * 6).toFixed(2) : '0.00';

  const isCompleted = selectedMatch.status === 'COMPLETED';

  return (
    <div className="space-y-4">
      {/* Main Scoreboard Hero Card */}
      <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs overflow-hidden">
        {/* Match Header Bar */}
        <div className="bg-gradient-to-r from-[#19182A] via-[#241F3D] to-[#19182A] text-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300 mb-3">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-[#FF7438]" />
              <span className="font-semibold text-white">{selectedMatch.tournament}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`}></span>
              <span className={`font-bold uppercase tracking-wider text-[11px] ${isCompleted ? 'text-amber-400' : 'text-emerald-400'}`}>
                {selectedMatch.status}
              </span>
              <span>•</span>
              <span className="text-gray-300">{selectedMatch.venue}</span>
            </div>
          </div>

          {/* Teams and Big Scores */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Batting Team Primary */}
            <div className="md:col-span-5 flex items-center space-x-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-3xl shadow-inner">
                {battingTeam.logo}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">{battingTeam.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF7438] text-white uppercase tracking-wider">
                    {isCompleted ? '2nd Innings' : 'Batting'}
                  </span>
                </div>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                    {selectedMatch.runs}/{selectedMatch.wickets}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-gray-300 tabular-nums">
                    ({selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} / {selectedMatch.totalOvers} ov)
                  </span>
                </div>
              </div>
            </div>

            {/* Match Equation & Rates Box */}
            <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-xs font-semibold text-[#FF7438] leading-tight">
                {selectedMatch.statusText}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">CURRENT RR</span>
                  <span className="text-white font-bold tabular-nums text-sm">{crr}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">REQUIRED RR</span>
                  <span className="text-amber-400 font-bold tabular-nums text-sm">{isCompleted ? '0.00' : rrr}</span>
                </div>
              </div>

              {isCompleted && (
                <button
                  onClick={() => setIsFinalScorecardOpen(true)}
                  className="mt-2.5 w-full py-1.5 px-3 bg-[#FF7438] hover:bg-[#e66126] text-white rounded-lg text-xs font-black shadow-xs transition"
                >
                  View Official Final Scorecard
                </button>
              )}
            </div>

            {/* Bowling Team / 1st Innings */}
            <div className="md:col-span-3 flex md:justify-end items-center space-x-3">
              <div className="text-left md:text-right">
                <p className="text-sm font-bold text-gray-200">{bowlingTeam.name}</p>
                <p className="text-xs text-gray-400">1st Innings: {selectedMatch.firstInningsTotal?.runs}/{selectedMatch.firstInningsTotal?.wickets} (20.0 ov)</p>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">Target: {target}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
                {bowlingTeam.logo}
              </div>
            </div>
          </div>
        </div>

        {/* Live Striker & Bowler Strip */}
        <div className="bg-[#F7F8FC] p-4 border-b border-[#E9E9F1]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Batsmen At Crease */}
            <div className="bg-white p-3.5 rounded-xl border border-[#E9E9F1]">
              <div className="flex items-center justify-between text-xs font-semibold text-[#77788B] mb-2">
                <span className="flex items-center">
                  <Flame className="w-3.5 h-3.5 text-[#FF7438] mr-1" />
                  Batsmen At The Crease
                </span>
                <span className="text-[11px]">R (B) • 4s • 6s • SR</span>
              </div>

              <div className="space-y-2">
                {selectedMatch.currentBatsmen.map((batsman, idx) => (
                  <div
                    key={batsman.playerId}
                    className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition ${
                      idx === 0 ? 'bg-[#5425C9]/5 border border-[#5425C9]/20 font-semibold' : 'text-[#19182A]'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {idx === 0 ? (
                        <span className="w-2 h-2 rounded-full bg-[#5425C9] animate-ping" title="On Strike"></span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      )}
                      <span className="font-bold text-[#19182A]">{batsman.name}</span>
                      {idx === 0 && <span className="text-[10px] text-[#5425C9] font-bold">* (Strike)</span>}
                    </div>
                    <div className="flex items-center space-x-3 text-right tabular-nums">
                      <span className="font-black text-[#19182A] text-sm">
                        {batsman.runs} <span className="text-xs font-normal text-gray-500">({batsman.balls})</span>
                      </span>
                      <span className="text-gray-500 w-4 text-center">{batsman.fours}</span>
                      <span className="text-gray-500 w-4 text-center">{batsman.sixes}</span>
                      <span className="font-bold text-gray-700 w-12 text-right">{batsman.strikeRate.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Bowler & Recent Six Balls */}
            <div className="bg-white p-3.5 rounded-xl border border-[#E9E9F1] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#77788B] mb-2">
                  <span className="flex items-center">
                    <Shield className="w-3.5 h-3.5 text-[#2589EB] mr-1" />
                    Current Bowler
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px]">O • M • R • W • ECON</span>
                    <button
                      onClick={() => setIsBowlerModalOpen(true)}
                      className="text-[10px] font-bold text-[#5425C9] hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-blue-50/40 border border-blue-100">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-[#19182A]">{selectedMatch.currentBowler.name}</span>
                    <span className="text-[10px] text-gray-500">
                      ({selectedMatch.currentBowler.overs}/{selectedMatch.maxOversPerBowler || 4} ov)
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 tabular-nums font-semibold text-[#19182A]">
                    <span>
                      {selectedMatch.currentBowler.overs}.{selectedMatch.currentBowler.ballsThisOver}
                    </span>
                    <span className="text-gray-500">{selectedMatch.currentBowler.maidens}</span>
                    <span className="text-gray-500">{selectedMatch.currentBowler.runsConceded}</span>
                    <span className="font-black text-rose-600">{selectedMatch.currentBowler.wickets}</span>
                    <span className="text-blue-600 font-bold">{selectedMatch.currentBowler.economy.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Recent Balls Strip */}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#77788B]">This Over Sequence:</span>
                <div className="flex items-center space-x-1.5">
                  {selectedMatch.recentBalls.slice(0, 6).reverse().map((ball) => (
                    <span
                      key={ball.id}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black tabular-nums transition-transform hover:scale-110 ${
                        ball.isWicket
                          ? 'bg-rose-600 text-white'
                          : ball.isSix
                          ? 'bg-amber-500 text-white'
                          : ball.isBoundary
                          ? 'bg-[#5425C9] text-white'
                          : ball.isExtra
                          ? 'bg-purple-100 text-purple-800'
                          : ball.runs === 0
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                      title={`${ball.ballText}: ${ball.commentary}`}
                    >
                      {ball.isWicket ? 'W' : ball.isSix ? '6' : ball.isBoundary ? '4' : ball.isExtra ? (ball.extraType === 'wide' ? 'Wd' : 'Nb') : ball.runs}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for detailed scorecards */}
        <div className="border-b border-[#E9E9F1] px-4 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'summary' ? 'border-[#5425C9] text-[#5425C9]' : 'border-transparent text-[#77788B] hover:text-[#19182A]'
              }`}
            >
              Match Summary & Heuristics
            </button>
            <button
              onClick={() => setActiveTab('batting')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'batting' ? 'border-[#5425C9] text-[#5425C9]' : 'border-transparent text-[#77788B] hover:text-[#19182A]'
              }`}
            >
              Batting Scorecard
            </button>
            <button
              onClick={() => setActiveTab('bowling')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'bowling' ? 'border-[#5425C9] text-[#5425C9]' : 'border-transparent text-[#77788B] hover:text-[#19182A]'
              }`}
            >
              Bowling Analysis
            </button>
            <button
              onClick={() => setActiveTab('partnerships')}
              className={`py-3 text-xs font-bold border-b-2 transition ${
                activeTab === 'partnerships' ? 'border-[#5425C9] text-[#5425C9]' : 'border-transparent text-[#77788B] hover:text-[#19182A]'
              }`}
            >
              Partnerships
            </button>
          </div>

          <button
            onClick={() => setIsFinalScorecardOpen(true)}
            className="text-xs font-bold text-[#FF7438] hover:underline flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Both Innings Official Scorecard</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-5">
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Momentum Index Meter */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#5425C9]/5 to-[#7351E8]/10 border border-[#5425C9]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#5425C9] uppercase tracking-wider">
                    Momentum Index
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#5425C9] text-white">
                    {selectedMatch.momentumTrend}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-[#19182A] tabular-nums">
                    {selectedMatch.momentumIndex}%
                  </span>
                  <span className="text-xs text-[#77788B]">favoring {selectedMatch.battingTeamId}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-[#5425C9] to-[#FF7438] transition-all duration-500"
                    style={{ width: `${selectedMatch.momentumIndex}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#77788B] mt-2 leading-relaxed">
                  Calculated using transparent heuristic: run-rate differential, wickets in hand, and death-over pressure.
                </p>
              </div>

              {/* Active Partnership */}
              <div className="p-4 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#19182A] flex items-center">
                    <Users className="w-3.5 h-3.5 text-[#2589EB] mr-1" />
                    Current Partnership
                  </span>
                  <span className="text-xs text-gray-500 font-medium">{selectedMatch.wickets + 1}th Wicket</span>
                </div>
                <div className="text-2xl font-black text-[#19182A] tabular-nums">
                  {selectedMatch.currentPartnership.totalRuns} runs
                  <span className="text-xs font-normal text-gray-500 ml-1.5">
                    ({selectedMatch.currentPartnership.totalBalls} balls)
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#77788B] space-y-1">
                  <div className="flex justify-between">
                    <span>{selectedMatch.currentBatsmen[0].name}:</span>
                    <span className="font-semibold text-[#19182A] tabular-nums">
                      {selectedMatch.currentPartnership.batsman1Runs} ({selectedMatch.currentPartnership.batsman1Balls}b)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{selectedMatch.currentBatsmen[1].name}:</span>
                    <span className="font-semibold text-[#19182A] tabular-nums">
                      {selectedMatch.currentPartnership.batsman2Runs} ({selectedMatch.currentPartnership.batsman2Balls}b)
                    </span>
                  </div>
                </div>
              </div>

              {/* Target & Match Equation */}
              <div className="p-4 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#19182A]">Match Equation</span>
                  <span className="text-xs text-emerald-600 font-bold">2nd Innings</span>
                </div>
                <div className="text-xl font-extrabold text-[#19182A] tabular-nums">
                  {isCompleted ? selectedMatch.result?.marginText : `${runsRemaining} Needed in ${ballsRemaining} Balls`}
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-gray-400 block text-[10px]">BALLS LEFT</span>
                    <span className="font-bold text-gray-800 tabular-nums">{ballsRemaining}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-gray-400 block text-[10px]">WICKETS IN HAND</span>
                    <span className="font-bold text-gray-800 tabular-nums">{10 - selectedMatch.wickets}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'batting' && (
            <div className="overflow-x-auto">
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
                      <td className="py-2.5 font-bold text-[#19182A] flex items-center space-x-1.5">
                        <span>{bat.name}</span>
                        {!bat.isOut && <span className="text-[#5425C9] font-extrabold">*</span>}
                      </td>
                      <td className="py-2.5 text-gray-500">{bat.isOut ? bat.dismissal : 'not out'}</td>
                      <td className="py-2.5 text-right font-extrabold text-[#19182A] tabular-nums">{bat.runs}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums">{bat.balls}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums">{bat.fours}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums">{bat.sixes}</td>
                      <td className="py-2.5 text-right font-semibold text-gray-800 tabular-nums">
                        {bat.strikeRate.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Extras and Fall of Wickets summary row */}
              <div className="mt-4 pt-3 border-t border-[#E9E9F1] text-xs space-y-1.5 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Extras:</span>
                  <span>
                    {selectedMatch.extras.total} (b {selectedMatch.extras.byes}, lb {selectedMatch.extras.legByes}, w {selectedMatch.extras.wides}, nb {selectedMatch.extras.noBalls})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-extrabold text-[#19182A]">
                    {selectedMatch.runs}/{selectedMatch.wickets} ({selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} ov)
                  </span>
                </div>
                {selectedMatch.fallOfWickets.length > 0 && (
                  <div className="text-[11px] text-[#77788B] pt-1">
                    <span className="font-bold text-[#19182A]">Fall of Wickets: </span>
                    {selectedMatch.fallOfWickets.map((f, i) => (
                      <span key={i} className="mr-2">
                        {f.wicketNumber}-{f.score} ({f.playerOutName}, {f.overText} ov)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bowling' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E9E9F1] text-[#77788B] font-semibold">
                    <th className="py-2.5">Bowler</th>
                    <th className="py-2.5 text-right">O</th>
                    <th className="py-2.5 text-right">M</th>
                    <th className="py-2.5 text-right">R</th>
                    <th className="py-2.5 text-right">W</th>
                    <th className="py-2.5 text-right">ECON</th>
                    <th className="py-2.5 text-right">WD</th>
                    <th className="py-2.5 text-right">NB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedMatch.bowlingScorecard.map((bowl) => (
                    <tr key={bowl.playerId} className="hover:bg-[#F7F8FC]">
                      <td className="py-2.5 font-bold text-[#19182A] flex items-center space-x-1.5">
                        <span>{bowl.name}</span>
                        {bowl.playerId === selectedMatch.currentBowler.playerId && (
                          <span className="text-[9px] px-1 rounded bg-[#5425C9] text-white font-bold">BOWLING</span>
                        )}
                        {bowl.overs >= (selectedMatch.maxOversPerBowler || 4) && (
                          <span className="text-[9px] px-1 rounded bg-gray-200 text-gray-700 font-bold">MAXED</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right font-semibold tabular-nums">
                        {bowl.overs}.{bowl.ballsThisOver}
                      </td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums">{bowl.maidens}</td>
                      <td className="py-2.5 text-right text-gray-600 tabular-nums">{bowl.runsConceded}</td>
                      <td className="py-2.5 text-right font-black text-rose-600 tabular-nums">{bowl.wickets}</td>
                      <td className="py-2.5 text-right font-bold text-blue-600 tabular-nums">
                        {bowl.economy.toFixed(2)}
                      </td>
                      <td className="py-2.5 text-right text-gray-500 tabular-nums">{bowl.wides || 0}</td>
                      <td className="py-2.5 text-right text-gray-500 tabular-nums">{bowl.noBalls || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'partnerships' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#F7F8FC] rounded-xl border border-[#E9E9F1]">
                <div className="flex justify-between text-xs font-bold text-[#19182A]">
                  <span>{selectedMatch.wickets + 1}th Wicket (Active)</span>
                  <span className="text-[#5425C9] tabular-nums">
                    {selectedMatch.currentPartnership.totalRuns} runs ({selectedMatch.currentPartnership.totalBalls} balls)
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mt-2 flex">
                  <div className="bg-[#5425C9] h-full" style={{ width: '60%' }}></div>
                  <div className="bg-[#FF7438] h-full" style={{ width: '40%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-[#77788B] mt-1.5">
                  <span>{selectedMatch.currentBatsmen[0].name}: {selectedMatch.currentPartnership.batsman1Runs}</span>
                  <span>{selectedMatch.currentBatsmen[1].name}: {selectedMatch.currentPartnership.batsman2Runs}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E9E9F1]">
                <div className="flex justify-between text-xs font-semibold text-gray-600">
                  <span>3rd Wicket: Rohit Sharma & Rishabh Pant</span>
                  <span className="tabular-nums">68 runs (38 balls)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulator Control Component */}
      <BallSimulator />
    </div>
  );
};

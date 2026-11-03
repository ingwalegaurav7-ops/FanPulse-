import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Info,
  Flame,
  ArrowRight,
  Shield,
  Trophy,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useCricket, BallActionType } from '../context/CricketContext';

interface BallSimulatorProps {
  compact?: boolean;
}

export const BallSimulator: React.FC<BallSimulatorProps> = ({ compact = false }) => {
  const {
    simulateBall,
    resetCurrentMatch,
    isAutoPlay,
    toggleAutoPlay,
    selectedMatch,
    setActiveTab,
    setIsBowlerModalOpen,
    setIsFinalScorecardOpen,
  } = useCricket();

  const isCompleted = selectedMatch.status === 'COMPLETED';

  const actions: { type: BallActionType; label: string; sub: string; color: string; hoverColor: string }[] = [
    { type: 'dot', label: '0', sub: 'Dot Ball', color: 'bg-gray-100 text-gray-800 border-gray-300', hoverColor: 'hover:bg-gray-200' },
    { type: '1', label: '1', sub: 'Single (Swap)', color: 'bg-blue-50 text-blue-700 border-blue-200', hoverColor: 'hover:bg-blue-100' },
    { type: '2', label: '2', sub: 'Two Runs', color: 'bg-blue-50 text-blue-700 border-blue-200', hoverColor: 'hover:bg-blue-100' },
    { type: '3', label: '3', sub: 'Three (Swap)', color: 'bg-blue-50 text-blue-700 border-blue-200', hoverColor: 'hover:bg-blue-100' },
    { type: '4', label: '4', sub: 'Boundary', color: 'bg-indigo-100 text-[#5425C9] border-[#5425C9]/30 font-bold', hoverColor: 'hover:bg-indigo-200' },
    { type: '6', label: '6', sub: 'Maximum', color: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold', hoverColor: 'hover:bg-amber-200' },
    { type: 'wicket', label: 'W', sub: 'Wicket!', color: 'bg-rose-600 text-white border-rose-700 font-extrabold shadow-sm', hoverColor: 'hover:bg-rose-700' },
    { type: 'wide', label: 'WD', sub: 'Wide (+1 Extra)', color: 'bg-slate-100 text-slate-700 border-slate-300', hoverColor: 'hover:bg-slate-200' },
    { type: 'noball', label: 'NB', sub: 'No Ball (+1 Extra)', color: 'bg-purple-100 text-purple-700 border-purple-300', hoverColor: 'hover:bg-purple-200' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs p-4 sm:p-5 relative overflow-hidden">
      {/* Background subtle decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5425C9]/5 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none"></div>

      {/* Header with Demo Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E9E9F1]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5425C9]/10 text-[#5425C9] flex items-center justify-center font-bold">
            <Zap className="w-4 h-4 text-[#FF7438]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm text-[#19182A]">Interactive Ball Simulator</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-800 border border-amber-300/40 uppercase tracking-wider">
                DEMO MATCH
              </span>
            </div>
            <p className="text-xs text-[#77788B]">
              Inject live deliveries to test bowling rotation, legal balls (6/over), strike swaps, and match completion.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 ml-auto">
          {!isCompleted ? (
            <button
              onClick={toggleAutoPlay}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isAutoPlay
                  ? 'bg-emerald-600 text-white shadow-xs animate-pulse'
                  : 'bg-[#F7F8FC] hover:bg-gray-100 text-[#19182A] border border-[#E9E9F1]'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isAutoPlay ? 'Auto Playing (4s)' : 'Auto Play'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsFinalScorecardOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold bg-[#FF7438] hover:bg-[#e06228] text-white shadow-md transition animate-bounce"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>View Full Scorecard</span>
            </button>
          )}

          <button
            onClick={resetCurrentMatch}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#F7F8FC] hover:bg-gray-100 text-[#77788B] hover:text-[#19182A] border border-[#E9E9F1] transition"
            title="Reset match back to initial state (142/3 in 15.2 overs)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Match</span>
          </button>
        </div>
      </div>

      {/* Match Completed Banner Overlay or Warning */}
      {isCompleted ? (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#19182A] via-[#2A1C50] to-[#19182A] text-white mb-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF7438] text-white flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-white">
                  MATCH FINISHED
                </span>
                <span className="font-extrabold text-sm text-white">
                  {selectedMatch.result?.resultSummary || selectedMatch.statusText}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Ball simulation paused. Check both innings scorecards, Player of the Match, and fantasy totals.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFinalScorecardOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#5425C9] hover:bg-[#431db0] text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <span>Final Scorecard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetCurrentMatch}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
          </div>
        </div>
      ) : (
        /* Simulator Buttons Grid */
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {actions.map((act) => (
            <button
              key={act.type}
              onClick={() => simulateBall(act.type)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all transform active:scale-95 shadow-2xs group ${act.color} ${act.hoverColor}`}
            >
              <span className="text-base sm:text-lg font-black tracking-tight leading-none group-hover:scale-110 transition-transform">
                {act.label}
              </span>
              <span className="text-[10px] mt-1 opacity-80 whitespace-nowrap font-medium">
                {act.sub}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Live State & Bowler Rotation Control Bar */}
      <div className="mt-3 pt-3 border-t border-dashed border-[#E9E9F1] flex flex-wrap items-center justify-between text-xs text-[#77788B] gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Active Striker & Non-Striker with explicit strike indicators */}
          <div className="flex items-center space-x-2 bg-[#F7F8FC] px-3 py-1.5 rounded-xl border border-[#E9E9F1]">
            <Flame className="w-3.5 h-3.5 text-[#FF7438]" />
            <span className="font-semibold text-[#19182A]">Striker:</span>
            <span className="font-extrabold text-[#5425C9]">
              {selectedMatch.currentBatsmen[0].name} ({selectedMatch.currentBatsmen[0].runs}* off {selectedMatch.currentBatsmen[0].balls}b)
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">
              Non-Striker: {selectedMatch.currentBatsmen[1].name} ({selectedMatch.currentBatsmen[1].runs}* off {selectedMatch.currentBatsmen[1].balls}b)
            </span>
          </div>

          {/* Current Bowler & Rotation Status */}
          <div className="flex items-center space-x-2 bg-[#F7F8FC] px-3 py-1.5 rounded-xl border border-[#E9E9F1]">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-[#19182A]">Bowler:</span>
            <span className="font-bold text-[#19182A]">
              {selectedMatch.currentBowler.name}
            </span>
            <span className="text-gray-500 tabular-nums">
              ({selectedMatch.currentBowler.overs}.{selectedMatch.currentBowler.ballsThisOver}/{selectedMatch.maxOversPerBowler || 4} ov)
            </span>
            <button
              onClick={() => setIsBowlerModalOpen(true)}
              className="ml-1 text-[11px] font-bold text-[#5425C9] hover:underline flex items-center space-x-0.5"
              title="Change active bowler or inspect rotation rules"
            >
              <span>Change Bowler</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-auto">
          <span className="text-[11px] font-semibold text-gray-500">
            Bowler Rotation: <strong className="text-[#19182A]">{selectedMatch.autoBowlerChange ? 'Auto-Rotate (6 Balls)' : 'Manual Selection'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

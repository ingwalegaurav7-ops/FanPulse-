import React from 'react';
import { Scoreboard } from '../components/Scoreboard';
import { CommentaryFeed } from '../components/CommentaryFeed';
import { Sparkles, TrendingUp, Award, ArrowRight, Trophy, Crown, Flame, Shield, RotateCcw, Layers } from 'lucide-react';
import { useCricket } from '../context/CricketContext';

export const MatchCentrePage: React.FC = () => {
  const { setActiveTab, selectedMatch, setIsFinalScorecardOpen, resetCurrentMatch } = useCricket();

  const isCompleted = selectedMatch.status === 'COMPLETED';
  const result = selectedMatch.result;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E9E9F1]">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-[#5425C9]" />
            <h1 className="text-2xl font-black text-[#19182A]">Live Match Centre</h1>
          </div>
          <p className="text-xs text-[#77788B]">
            Interactive cricket score console, real-time ball simulation, and situation analysis
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center space-x-1.5 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{selectedMatch.teamB.shortName} vs {selectedMatch.teamA.shortName} • {selectedMatch.runs}/{selectedMatch.wickets} ({selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} ov)</span>
          </span>
        </div>
      </div>

      {/* If Match is Completed: Hero Final Result Card */}
      {isCompleted ? (
        <div className="bg-gradient-to-r from-[#19182A] via-[#2A1856] to-[#19182A] text-white p-6 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5425C9]/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FF7438] text-white uppercase tracking-wider shadow-sm flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>MATCH COMPLETED</span>
              </span>
              <span className="text-xs text-indigo-200 font-semibold">{selectedMatch.tournament}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFinalScorecardOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#FF7438] hover:bg-[#eb652a] text-white font-extrabold text-xs shadow-md transition flex items-center space-x-1.5"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>View Full 2-Innings Scorecard</span>
              </button>
              <button
                onClick={resetCurrentMatch}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Match</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 py-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">
                {result?.winnerTeamName} {result?.marginText}
              </h2>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed">
                {result?.resultSummary}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-gray-300">
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">
                  Target: <strong>{selectedMatch.target || 182}</strong>
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">
                  2nd Innings Score: <strong>{selectedMatch.runs}/{selectedMatch.wickets}</strong> ({selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} ov)
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-lg">
                  1st Innings: <strong>{selectedMatch.firstInningsTotal?.runs || 181}/{selectedMatch.firstInningsTotal?.wickets || 7}</strong> (20.0 ov)
                </span>
              </div>
            </div>

            {/* POTM Mini Card */}
            <div className="md:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-300 block">
                    PLAYER OF THE MATCH
                  </span>
                  <h4 className="font-extrabold text-base text-white">{result?.playerOfTheMatch.name}</h4>
                  <p className="text-xs text-gray-300 font-medium">{result?.playerOfTheMatch.performance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Top Banner Quick Access to AI and Intelligence */
        <div className="bg-gradient-to-r from-[#5425C9] to-[#7351E8] text-white p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF7438]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Experience Real-Time Cricket Intelligence</h3>
              <p className="text-xs text-indigo-100 font-light">
                Every simulated ball immediately updates the momentum engine, player fantasy points, and AI context.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setActiveTab('companion')}
              className="px-3.5 py-2 rounded-xl bg-white text-[#5425C9] hover:bg-gray-100 font-bold text-xs flex items-center space-x-1.5 shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5425C9]" />
              <span>Ask Companion</span>
            </button>
            <button
              onClick={() => setActiveTab('intelligence')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center space-x-1.5 border border-white/20 transition"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>Momentum Charts</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Scoreboard + Simulator on left, Commentary on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Scoreboard />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <CommentaryFeed />

          {/* Quick Match Tip Card */}
          <div className="bg-white rounded-2xl border border-[#E9E9F1] p-4 shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#5425C9]">
              <Award className="w-4 h-4 text-[#FF7438]" />
              <span>Fantasy Impact Hint</span>
            </div>
            <p className="text-xs text-[#19182A] leading-relaxed">
              <strong>Suryakumar Yadav</strong> has earned <strong>+78 fantasy points</strong> so far. If you chose him as Captain, that doubles to <strong>156 points</strong>!
            </p>
            <button
              onClick={() => setActiveTab('fantasy')}
              className="text-xs font-bold text-[#FF7438] hover:underline flex items-center space-x-1 pt-1"
            >
              <span>View Fantasy Lineup Points</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  Flame,
  Shield,
  Layers,
  ArrowRight,
  Info,
  Award,
  Zap,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { getMomentumExplanation, extractTurningPoints } from '../utils/momentum';

export const MatchIntelligencePage: React.FC = () => {
  const { selectedMatch, setActiveTab } = useCricket();

  const momentumExplanation = getMomentumExplanation(selectedMatch, selectedMatch.recentBalls[0]);
  const turningPoints = extractTurningPoints(selectedMatch);

  // Generate over-by-over chart data
  const chartData = [
    { over: 'Ov 1', IND: 7, AUS: 9, momentum: 48, wickets: 0 },
    { over: 'Ov 2', IND: 14, AUS: 8, momentum: 52, wickets: 0 },
    { over: 'Ov 3', IND: 11, AUS: 12, momentum: 55, wickets: 1 },
    { over: 'Ov 4', IND: 6, AUS: 10, momentum: 50, wickets: 0 },
    { over: 'Ov 5', IND: 9, AUS: 7, momentum: 54, wickets: 0 },
    { over: 'Ov 6', IND: 13, AUS: 8, momentum: 60, wickets: 0 },
    { over: 'Ov 7', IND: 7, AUS: 6, momentum: 58, wickets: 0 },
    { over: 'Ov 8', IND: 8, AUS: 11, momentum: 56, wickets: 0 },
    { over: 'Ov 9', IND: 10, AUS: 7, momentum: 59, wickets: 0 },
    { over: 'Ov 10', IND: 6, AUS: 9, momentum: 52, wickets: 1 },
    { over: 'Ov 11', IND: 8, AUS: 8, momentum: 54, wickets: 1 },
    { over: 'Ov 12', IND: 12, AUS: 10, momentum: 62, wickets: 0 },
    { over: 'Ov 13', IND: 14, AUS: 9, momentum: 68, wickets: 0 },
    { over: 'Ov 14', IND: 8, AUS: 7, momentum: 70, wickets: 0 },
    {
      over: `Ov ${selectedMatch.completedOvers + (selectedMatch.ballsInCurrentOver > 0 ? 1 : 0)}`,
      IND: Math.max(2, selectedMatch.runs - 140),
      AUS: 8,
      momentum: selectedMatch.momentumIndex,
      wickets: selectedMatch.wickets > 3 ? 1 : 0
    },
  ];

  // Run Rate trajectory comparison data
  const rrData = [
    { over: 'Ov 2', CRR: 10.5, RRR: 9.3 },
    { over: 'Ov 4', CRR: 9.5, RRR: 9.2 },
    { over: 'Ov 6', CRR: 10.0, RRR: 8.9 },
    { over: 'Ov 8', CRR: 9.1, RRR: 9.1 },
    { over: 'Ov 10', CRR: 8.8, RRR: 9.4 },
    { over: 'Ov 12', CRR: 9.0, RRR: 9.2 },
    { over: 'Ov 14', CRR: 9.3, RRR: 8.8 },
    {
      over: `Ov ${selectedMatch.completedOvers}.${selectedMatch.ballsInCurrentOver}`,
      CRR: parseFloat(((selectedMatch.runs / Math.max(1, selectedMatch.completedOvers * 6 + selectedMatch.ballsInCurrentOver)) * 6).toFixed(2)),
      RRR: parseFloat((((selectedMatch.target || 182) - selectedMatch.runs) / Math.max(1, selectedMatch.totalOvers * 6 - (selectedMatch.completedOvers * 6 + selectedMatch.ballsInCurrentOver)) * 6).toFixed(2))
    },
  ];

  // MVP Impact Leaderboard
  const impactPlayers = [
    { name: 'Suryakumar Yadav', team: 'IND', role: 'Batter', impact: 94, reason: '44* off 26 at 169 SR; 2 crucial sixes in middle overs' },
    { name: 'Rohit Sharma', team: 'IND', role: 'Batter', impact: 88, reason: 'Rapid 57 off 32 provided initial powerplay foundation' },
    { name: 'Pat Cummins', team: 'AUS', role: 'Bowler', impact: 81, reason: '1/28; only conceded 8.4 RPO while breaking Pant stand' },
    { name: 'Hardik Pandya', team: 'IND', role: 'All-Rounder', impact: 76, reason: '18* off 10 with timely boundary release in over 14' },
    { name: 'Josh Hazlewood', team: 'AUS', role: 'Bowler', impact: 72, reason: '1/29 in 4 overs; suppressed Kohli early' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E9E9F1]">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-[#5425C9]" />
            <h1 className="text-2xl font-black text-[#19182A]">Match Intelligence & Insights</h1>
          </div>
          <p className="text-xs text-[#77788B]">
            Data-driven situational evaluation powered by transparent heuristics and ball-level leverage
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-[#5425C9] font-bold text-xs flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5425C9] animate-ping"></span>
            <span>Live Momentum: {selectedMatch.momentumIndex}% ({selectedMatch.momentumTrend})</span>
          </span>
        </div>
      </div>

      {/* Heuristic Explanation 4-Part Card */}
      <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#FF7438]" />
            <h3 className="font-extrabold text-sm text-[#19182A]">Current Situational Momentum Breakdown</h3>
          </div>
          <span className="text-xs text-gray-400">Deterministic Model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#F7F8FC] p-3.5 rounded-xl border border-[#E9E9F1]">
            <span className="text-[10px] font-extrabold text-[#5425C9] uppercase tracking-wider block mb-1">
              What Happened
            </span>
            <p className="text-xs text-[#19182A] font-semibold leading-relaxed">
              {momentumExplanation.whatHappened}
            </p>
          </div>

          <div className="bg-[#F7F8FC] p-3.5 rounded-xl border border-[#E9E9F1]">
            <span className="text-[10px] font-extrabold text-[#FF7438] uppercase tracking-wider block mb-1">
              Why Momentum Shifted
            </span>
            <p className="text-xs text-[#19182A] leading-relaxed">
              {momentumExplanation.whyShifted}
            </p>
          </div>

          <div className="bg-[#F7F8FC] p-3.5 rounded-xl border border-[#E9E9F1]">
            <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block mb-1">
              Team Benefited
            </span>
            <p className="text-xs text-emerald-800 font-bold leading-relaxed">
              {momentumExplanation.benefited}
            </p>
          </div>

          <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100">
            <span className="text-[10px] font-extrabold text-[#5425C9] uppercase tracking-wider block mb-1">
              What To Watch Next
            </span>
            <p className="text-xs text-[#19182A] font-medium leading-relaxed">
              {momentumExplanation.watchNext}
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Interactive Momentum Line Chart */}
        <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
            <div>
              <h3 className="font-bold text-sm text-[#19182A]">Match Momentum Trajectory (%)</h3>
              <p className="text-[11px] text-[#77788B]">Transparent index (50% = neutral parity, &gt;65% = surging chase)</p>
            </div>
            <span className="text-xs font-black text-[#5425C9] tabular-nums">
              {selectedMatch.momentumIndex}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F7" />
                <XAxis dataKey="over" tick={{ fontSize: 10, fill: '#77788B' }} />
                <YAxis domain={[30, 90]} tick={{ fontSize: 10, fill: '#77788B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#19182A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="momentum" fill="#5425C9" fillOpacity={0.12} stroke="none" />
                <Line type="monotone" dataKey="momentum" stroke="#5425C9" strokeWidth={3} dot={{ r: 3, fill: '#FF7438' }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-[#77788B] flex items-center justify-between pt-1">
            <span>Formula: RR Delta + Wickets in Hand + Death Leverage</span>
            <span className="font-semibold text-[#5425C9]">Updates every simulated ball</span>
          </div>
        </div>

        {/* Chart 2: Runs Per Over Bar Chart Comparison */}
        <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
            <div>
              <h3 className="font-bold text-sm text-[#19182A]">Runs Scored Per Over</h3>
              <p className="text-[11px] text-[#77788B]">{selectedMatch.teamB.name} (Chasing) vs Par Scoring</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center text-[#5425C9] font-bold">
                <span className="w-2.5 h-2.5 bg-[#5425C9] rounded-xs mr-1"></span> IND
              </span>
              <span className="flex items-center text-gray-400 font-medium">
                <span className="w-2.5 h-2.5 bg-gray-300 rounded-xs mr-1"></span> Par
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F7" />
                <XAxis dataKey="over" tick={{ fontSize: 10, fill: '#77788B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#77788B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#19182A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="IND" fill="#5425C9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="AUS" fill="#E2E4EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-[#77788B] flex items-center justify-between pt-1">
            <span>Highest Over: 14 runs (Over 13 vs Zampa)</span>
            <span className="font-semibold text-emerald-600">Above Required Par in 9/15 overs</span>
          </div>
        </div>

        {/* Chart 3: Current Run Rate vs Required Run Rate Trajectory */}
        <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
            <div>
              <h3 className="font-bold text-sm text-[#19182A]">Run-Rate Comparison (CRR vs RRR)</h3>
              <p className="text-[11px] text-[#77788B]">CRR maintained above RRR indicates batting control</p>
            </div>
            <span className="text-xs font-bold text-emerald-600">Favorable Buffer (+0.69 RPO)</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rrData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F7" />
                <XAxis dataKey="over" tick={{ fontSize: 10, fill: '#77788B' }} />
                <YAxis domain={[6, 12]} tick={{ fontSize: 10, fill: '#77788B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#19182A', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Line type="monotone" dataKey="CRR" stroke="#2589EB" strokeWidth={2.5} name="Current RR" />
                <Line type="monotone" dataKey="RRR" stroke="#FF7438" strokeWidth={2.5} strokeDasharray="4 4" name="Required RR" />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Player Impact Index (MVP Leaderboard) */}
        <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
            <div>
              <h3 className="font-bold text-sm text-[#19182A]">Player Impact Ratings (MVP Index)</h3>
              <p className="text-[11px] text-[#77788B]">Contextual value calculated against pressure situations</p>
            </div>
            <Award className="w-4 h-4 text-[#FF7438]" />
          </div>

          <div className="space-y-2.5">
            {impactPlayers.map((player, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#F7F8FC] border border-[#E9E9F1] flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 rounded-full bg-white text-[#19182A] font-black text-[10px] flex items-center justify-center border">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-[#19182A]">{player.name}</span>
                      <span className="text-[10px] text-gray-500">({player.team} • {player.role})</span>
                    </div>
                    <p className="text-[11px] text-[#77788B] line-clamp-1">{player.reason}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className="font-black text-sm text-[#5425C9] tabular-nums">
                    {player.impact}
                  </span>
                  <span className="text-[9px] text-gray-400 block -mt-1 uppercase">/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Match Turning-Point Cards */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-[#FF7438]" />
          <h2 className="text-base font-extrabold text-[#19182A]">Verified Match Turning Points</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {turningPoints.map((tp) => (
            <div
              key={tp.id}
              className="bg-white rounded-2xl border border-[#E9E9F1] p-4 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#5425C9]/10 text-[#5425C9]">
                  {tp.overText}
                </span>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Shift: {tp.momentumShift}
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#19182A]">{tp.headline}</h4>
              <p className="text-xs text-[#77788B] leading-relaxed">{tp.description}</p>
              <div className="text-[11px] text-gray-400 pt-1 border-t border-gray-100 flex justify-between">
                <span>Benefited: <strong className="text-[#19182A]">{tp.favorsTeam}</strong></span>
                <span className="uppercase font-semibold">{tp.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

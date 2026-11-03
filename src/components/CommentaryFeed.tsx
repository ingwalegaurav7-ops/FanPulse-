import React, { useState } from 'react';
import { MessageSquare, Filter, Flame, Zap, ArrowDown } from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { BallEvent } from '../types/cricket';

export const CommentaryFeed: React.FC = () => {
  const { selectedMatch } = useCricket();
  const [filter, setFilter] = useState<'all' | 'wickets' | 'boundaries'>('all');

  // Combine recent balls with match historical ball events
  const allEvents: BallEvent[] = [...selectedMatch.recentBalls, ...selectedMatch.ballHistory];

  // De-duplicate by id
  const uniqueEvents = Array.from(new Map(allEvents.map((item) => [item.id, item])).values());

  const filteredEvents = uniqueEvents.filter((ev) => {
    if (filter === 'wickets') return ev.isWicket;
    if (filter === 'boundaries') return ev.isBoundary || ev.isSix;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xs p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#E9E9F1] gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#5425C9]/10 text-[#5425C9] flex items-center justify-center font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#19182A]">Ball-by-Ball Commentary</h3>
            <p className="text-[11px] text-[#77788B]">Real-time match narrative with situational context</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-[#F7F8FC] p-1 rounded-xl border border-[#E9E9F1]">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'all' ? 'bg-white text-[#5425C9] shadow-xs' : 'text-[#77788B] hover:text-[#19182A]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('boundaries')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'boundaries' ? 'bg-white text-[#5425C9] shadow-xs' : 'text-[#77788B] hover:text-[#19182A]'
            }`}
          >
            Boundaries (4/6)
          </button>
          <button
            onClick={() => setFilter('wickets')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              filter === 'wickets' ? 'bg-white text-rose-600 shadow-xs' : 'text-[#77788B] hover:text-[#19182A]'
            }`}
          >
            Wickets (W)
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#77788B]">
            No balls match this filter yet. Simulate a delivery to see live commentary.
          </div>
        ) : (
          filteredEvents.map((ball) => (
            <div
              key={ball.id}
              className={`p-3 rounded-xl border transition-all ${
                ball.isWicket
                  ? 'bg-rose-50/60 border-rose-200'
                  : ball.isSix
                  ? 'bg-amber-50/60 border-amber-200'
                  : ball.isBoundary
                  ? 'bg-purple-50/40 border-purple-200'
                  : 'bg-white border-[#E9E9F1] hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center tabular-nums shadow-xs ${
                      ball.isWicket
                        ? 'bg-rose-600 text-white'
                        : ball.isSix
                        ? 'bg-amber-500 text-white'
                        : ball.isBoundary
                        ? 'bg-[#5425C9] text-white'
                        : ball.runs === 0 && !ball.isExtra
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ball.isWicket ? 'W' : ball.isSix ? '6' : ball.isBoundary ? '4' : ball.runs}
                  </span>
                  <div>
                    <span className="font-extrabold text-xs text-[#19182A] tabular-nums mr-1">
                      {ball.ballText}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {ball.bowlerName} to {ball.batsmanName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-gray-700 tabular-nums">
                    Score: {ball.scoreAfterBall}
                  </span>
                  <span className="text-[10px] text-gray-400">{ball.timestamp}</span>
                </div>
              </div>

              <p className="mt-2 text-xs text-[#19182A] leading-relaxed font-normal">
                {ball.commentary}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

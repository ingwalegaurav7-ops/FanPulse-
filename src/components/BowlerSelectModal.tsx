import React from 'react';
import { Shield, X, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { getEligibleBowlers } from '../utils/matchFinisher';

export const BowlerSelectModal: React.FC = () => {
  const {
    selectedMatch,
    selectNextBowler,
    isBowlerModalOpen,
    setIsBowlerModalOpen,
    toggleAutoBowlerChange,
  } = useCricket();

  if (!isBowlerModalOpen) return null;

  const bowlerOptions = getEligibleBowlers(selectedMatch);
  const nextOverNumber = selectedMatch.completedOvers + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#E9E9F1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#19182A] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5425C9] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#FF7438]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Bowling Change • Over {nextOverNumber}
              </h3>
              <p className="text-xs text-gray-400">
                {selectedMatch.bowlingTeamId} bowling attack • Max {selectedMatch.maxOversPerBowler || 4} ov/bowler
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBowlerModalOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto-Rotation Toggle Strip */}
        <div className="bg-[#F7F8FC] px-5 py-3 border-b border-[#E9E9F1] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#19182A] block">Auto-Rotate Bowler</span>
            <span className="text-[11px] text-[#77788B]">
              Automatically picks next eligible bowler at over completion
            </span>
          </div>

          <button
            onClick={toggleAutoBowlerChange}
            className={`px-3 py-1 rounded-full font-bold text-xs transition ${
              selectedMatch.autoBowlerChange
                ? 'bg-[#5425C9] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {selectedMatch.autoBowlerChange ? 'AUTO (ON)' : 'MANUAL (OFF)'}
          </button>
        </div>

        {/* Eligible & Ineligible Bowlers List */}
        <div className="p-4 sm:p-5 max-h-96 overflow-y-auto space-y-2.5">
          <p className="text-[11px] font-bold text-[#77788B] uppercase tracking-wider mb-2">
            Available Bowlers (Click to Select)
          </p>

          {bowlerOptions.map(({ player, stats, eligible, ineligibilityReason }) => {
            const isCurrentBowler = selectedMatch.currentBowler.playerId === player.id;
            return (
              <div
                key={player.id}
                onClick={() => {
                  if (eligible) {
                    selectNextBowler(player.id);
                  }
                }}
                className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  eligible
                    ? 'cursor-pointer hover:border-[#5425C9] hover:bg-indigo-50/40 bg-white border-[#E9E9F1]'
                    : 'opacity-50 bg-gray-50 border-gray-200 cursor-not-allowed'
                } ${isCurrentBowler ? 'ring-2 ring-[#5425C9]/20 border-[#5425C9]' : ''}`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs sm:text-sm text-[#19182A]">
                      {player.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-gray-100 text-gray-700">
                      {player.role}
                    </span>
                    {isCurrentBowler && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#5425C9] text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-500">
                    Overs: <strong>{stats.overs}/{selectedMatch.maxOversPerBowler || 4}</strong> • Figures: <strong>{stats.wickets}/{stats.runsConceded}</strong> • Econ: <strong>{stats.economy.toFixed(2)}</strong>
                  </p>

                  {!eligible && ineligibilityReason && (
                    <p className="text-[10px] text-rose-600 font-semibold flex items-center space-x-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{ineligibilityReason}</span>
                    </p>
                  )}
                </div>

                <div>
                  {eligible ? (
                    <button
                      onClick={() => selectNextBowler(player.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#5425C9] hover:bg-[#431db0] text-white font-bold text-xs flex items-center space-x-1 shadow-2xs"
                    >
                      <span>Select</span>
                      <Check className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 px-2 py-1 bg-gray-100 rounded-md">
                      Ineligible
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-[#F7F8FC] px-5 py-3 border-t border-[#E9E9F1] flex items-center justify-between text-xs text-[#77788B]">
          <span>Cricket Rule 13.8: No bowler may bowl two consecutive overs.</span>
          <button
            onClick={() => setIsBowlerModalOpen(false)}
            className="text-xs font-semibold text-gray-600 hover:text-black"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

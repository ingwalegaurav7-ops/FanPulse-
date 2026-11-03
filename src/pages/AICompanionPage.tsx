import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  Flame,
  Info
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { ChatMessage, AIResponseStructured } from '../types/cricket';

export const AICompanionPage: React.FC = () => {
  const { selectedMatch, setActiveTab } = useCricket();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pre-seed with an informative initial conversation grounded in Over 15.2
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'seed_msg_1',
      sender: 'user',
      timestamp: '2 mins ago',
      query: 'Why did the match momentum change in the last two overs?',
    },
    {
      id: 'seed_msg_2',
      sender: 'assistant',
      timestamp: '2 mins ago',
      response: {
        directAnswer: `Match momentum surged to ${selectedMatch.momentumIndex}% in favor of ${selectedMatch.battingTeamId} due to high-leverage boundaries from Suryakumar Yadav and Hardik Pandya that counteracted Hazlewood's tight line.`,
        matchEvidence: [
          `Suryakumar Yadav executed an 84-meter scoop six off Adam Zampa on Over 13.6, breaking spin containment.`,
          `Hardik Pandya smashed a crisply timed straight boundary on 14.5 off Josh Hazlewood to drag RRR under 9.0.`,
          `India scored 22 runs across overs 13 and 14 while losing zero wickets, keeping 7 wickets in hand.`
        ],
        whyItMatters: `When chasing 182, keeping the Required Run Rate below 9.0 before Pat Cummins and Mitchell Starc enter their death spells forces Australia into defensive fields instead of wicket-taking slips.`,
        whatToWatchNext: `Watch Pat Cummins' slower ball off-cutters and yorker accuracy in Over 16. If Cummins restricts India to under 6 runs this over, Australia regains momentum balance.`,
        sentiment: 'POSITIVE',
        isDemoMode: true,
      },
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    'Why did the momentum change?',
    'Can the chasing team still win?',
    'Who is controlling the match?',
    'What should the batting team do in the next two overs?',
    'Which player has made the biggest impact?',
    'Explain the last over in simple language.',
    'Why is the batting team struggling?',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || inputValue).trim();
    if (!textToSend || isLoading) return;

    setInputValue('');

    const userMessageId = `user_${Date.now()}`;
    const assistantMessageId = `asst_${Date.now()}`;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: 'user',
        timestamp: 'Just now',
        query: textToSend,
      },
    ]);

    setIsLoading(true);

    // Build structured context from live match state
    const target = selectedMatch.target || 182;
    const runsRemaining = Math.max(0, target - selectedMatch.runs);
    const totalBalls = selectedMatch.totalOvers * 6;
    const ballsBowled = selectedMatch.completedOvers * 6 + selectedMatch.ballsInCurrentOver;
    const ballsRemaining = Math.max(1, totalBalls - ballsBowled);

    const matchContext = {
      tournament: selectedMatch.tournament,
      venue: selectedMatch.venue,
      battingTeam: selectedMatch.battingTeamId === selectedMatch.teamA.id ? selectedMatch.teamA.name : selectedMatch.teamB.name,
      bowlingTeam: selectedMatch.bowlingTeamId === selectedMatch.teamA.id ? selectedMatch.teamA.name : selectedMatch.teamB.name,
      score: `${selectedMatch.runs}/${selectedMatch.wickets}`,
      runs: selectedMatch.runs,
      wickets: selectedMatch.wickets,
      overs: `${selectedMatch.completedOvers}.${selectedMatch.ballsInCurrentOver}`,
      target,
      crr: ballsBowled > 0 ? ((selectedMatch.runs / ballsBowled) * 6).toFixed(2) : '0.00',
      rrr: ((runsRemaining / ballsRemaining) * 6).toFixed(2),
      striker: selectedMatch.currentBatsmen[0],
      nonStriker: selectedMatch.currentBatsmen[1],
      bowler: selectedMatch.currentBowler,
      partnership: selectedMatch.currentPartnership,
      momentumIndex: selectedMatch.momentumIndex,
      momentumTrend: selectedMatch.momentumTrend,
      recentBalls: selectedMatch.recentBalls.slice(0, 6).map((b) => ({
        ball: b.ballText,
        runs: b.runs,
        isWicket: b.isWicket,
        isBoundary: b.isBoundary || b.isSix,
        commentary: b.commentary,
      })),
    };

    try {
      const res = await fetch('/api/ai/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          matchContext,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: AIResponseStructured = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          sender: 'assistant',
          timestamp: 'Just now',
          response: data,
        },
      ]);
    } catch (err: any) {
      console.warn('Network issue fetching AI response, applying situational client response:', err?.message || err);
      // Client-side fallback if network error
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          sender: 'assistant',
          timestamp: 'Just now',
          response: {
            directAnswer: `At ${selectedMatch.runs}/${selectedMatch.wickets} in over ${selectedMatch.completedOvers}.${selectedMatch.ballsInCurrentOver}, this match remains poised at ${selectedMatch.momentumIndex}% momentum index.`,
            matchEvidence: [
              `Target is ${target}, requiring ${runsRemaining} runs from ${ballsRemaining} balls.`,
              `Active pair: ${selectedMatch.currentBatsmen[0].name} (${selectedMatch.currentBatsmen[0].runs}*) and ${selectedMatch.currentBatsmen[1].name} (${selectedMatch.currentBatsmen[1].runs}*).`,
              `Bowler: ${selectedMatch.currentBowler.name} (Figures: ${selectedMatch.currentBowler.wickets}/${selectedMatch.currentBowler.runsConceded}).`
            ],
            whyItMatters: `In this phase of the chase, dot balls carry an asymmetric penalty, driving required run rate upward by ~0.3 per dot.`,
            whatToWatchNext: `Observe whether the bowling captain introduces yorkers or off-pace cutters in the following 6 deliveries.`,
            sentiment: 'BALANCED',
            isDemoMode: true,
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Context Header */}
      <div className="bg-white rounded-2xl border border-[#E9E9F1] p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E9E9F1]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5425C9] to-[#7351E8] flex items-center justify-center text-white shadow-md shadow-[#5425C9]/20">
              <Sparkles className="w-5 h-5 text-[#FF7438]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#19182A]">Your AI Cricket Companion</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#5425C9] text-white">
                  GEMINI 3.8 FLASH
                </span>
              </div>
              <p className="text-xs text-[#77788B]">
                Situational match intelligence answering the real cricket fan question: <em>"Why is this match changing?"</em>
              </p>
            </div>
          </div>

          <button
            onClick={() => setMessages([])}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#77788B] hover:text-[#19182A] hover:bg-gray-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>

        {/* Live Grounding Bar */}
        <div className="pt-3 flex flex-wrap items-center justify-between text-xs text-[#77788B] gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-[#19182A]">Active Grounding Context:</span>
            <span>
              {selectedMatch.teamB.shortName} ({selectedMatch.runs}/{selectedMatch.wickets} in {selectedMatch.completedOvers}.{selectedMatch.ballsInCurrentOver} ov)
            </span>
            <span>•</span>
            <span className="text-[#FF7438] font-semibold">Momentum: {selectedMatch.momentumIndex}%</span>
          </div>

          <button
            onClick={() => setActiveTab('match-centre')}
            className="text-xs font-bold text-[#5425C9] hover:underline flex items-center space-x-1"
          >
            <span>Go to Live Ball Simulator</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#77788B] uppercase tracking-wider block">
          Recommended Situational Questions (1-Click)
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-3 py-2 rounded-xl bg-white hover:bg-indigo-50 border border-[#E9E9F1] hover:border-[#5425C9]/30 text-xs font-semibold text-[#19182A] hover:text-[#5425C9] transition shadow-2xs text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            {msg.sender === 'user' ? (
              /* User Query Bubble */
              <div className="flex justify-end">
                <div className="max-w-2xl bg-[#19182A] text-white p-4 rounded-2xl rounded-tr-xs shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-semibold text-[#FF7438]">Fan Question</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="text-sm font-semibold">{msg.query}</p>
                </div>
              </div>
            ) : (
              /* AI Structured Response Card */
              <div className="flex justify-start">
                <div className="max-w-3xl w-full bg-white rounded-2xl border border-[#E9E9F1] shadow-sm p-5 space-y-4">
                  {/* Response Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9E9F1]">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-[#5425C9] text-white flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF7438]" />
                      </div>
                      <span className="font-extrabold text-xs text-[#19182A]">FanPulse Intelligence Analysis</span>
                      {msg.response?.isDemoMode && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200" title="Deterministic Contextual Engine">
                          DEMO ENGINE
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400">{msg.timestamp}</span>
                  </div>

                  {msg.response && (
                    <div className="space-y-4">
                      {/* 1. Direct Answer */}
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5">
                        <span className="text-[10px] font-extrabold text-[#5425C9] uppercase tracking-wider block mb-1">
                          1. Direct Answer
                        </span>
                        <p className="text-sm font-bold text-[#19182A] leading-relaxed">
                          {msg.response.directAnswer}
                        </p>
                      </div>

                      {/* 2. Match Evidence */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold text-[#77788B] uppercase tracking-wider block">
                          2. Match Evidence (Data Verified)
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#19182A]">
                          {msg.response.matchEvidence.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-start space-x-2 bg-[#F7F8FC] p-2.5 rounded-lg border border-[#E9E9F1]">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-relaxed font-medium">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 3. Why It Matters */}
                      <div className="bg-white p-3 rounded-xl border border-[#E9E9F1]">
                        <span className="text-[10px] font-extrabold text-[#FF7438] uppercase tracking-wider block mb-1">
                          3. Why It Matters (Tactics & Strategy)
                        </span>
                        <p className="text-xs text-[#19182A] leading-relaxed font-normal">
                          {msg.response.whyItMatters}
                        </p>
                      </div>

                      {/* 4. What To Watch Next */}
                      <div className="bg-purple-50/40 p-3 rounded-xl border border-purple-100">
                        <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block mb-1">
                          4. What To Watch Next
                        </span>
                        <p className="text-xs text-purple-950 font-semibold leading-relaxed">
                          {msg.response.whatToWatchNext}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl border border-[#E9E9F1] p-4 shadow-sm flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-[#5425C9] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-semibold text-[#5425C9]">
                FanPulse AI analyzing live situational ball data & momentum delta...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="sticky bottom-4 z-30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="bg-white rounded-2xl border border-[#E9E9F1] shadow-xl p-2 flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about momentum, tactics, death-overs or fantasy impact..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm text-[#19182A] placeholder-[#77788B] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#5425C9] hover:bg-[#431db0] disabled:bg-gray-200 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-xs"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

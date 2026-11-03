import React from 'react';
import { Zap, Shield, Sparkles, Award, Github, Heart } from 'lucide-react';
import { useCricket } from '../context/CricketContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useCricket();

  return (
    <footer className="bg-[#19182A] text-white border-t border-gray-800 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5425C9] to-[#7351E8] flex items-center justify-center text-white shadow-md">
                <Zap className="w-5 h-5 text-[#FF7438] fill-[#FF7438]" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight">FanPulse</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-sm bg-[#5425C9] text-white ml-1">AI</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Every Ball Has a Story. Transforming live cricket data into actionable fan intelligence, situational momentum analysis, and real-time fantasy insights.
            </p>
            <div className="pt-1 text-[11px] text-gray-400">
              Technical assignment for <span className="text-white font-semibold">Dream11 FDE Intern</span> role.
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => setActiveTab('match-centre')} className="hover:text-white transition">
                  Live Match Centre
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('companion')} className="hover:text-white transition flex items-center space-x-1">
                  <span>AI Cricket Companion</span>
                  <span className="text-[9px] bg-[#FF7438] text-white px-1 rounded font-bold">GEMINI</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('intelligence')} className="hover:text-white transition">
                  Momentum & Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('fantasy')} className="hover:text-white transition">
                  Fantasy XI Impact Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('recap')} className="hover:text-white transition">
                  Match Phase Recap
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Architecture */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Engineering Highlights</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Full-Stack Express + Vite SPA</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>Gemini 3.8 Flash SDK Integration</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>Deterministic Fallback Engine</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7438]"></span>
                <span>Transparent Momentum Heuristic</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Stateful Ball Simulation System</span>
              </li>
            </ul>
          </div>

          {/* Compliance & Disclaimers */}
          <div className="space-y-2 text-xs text-gray-400">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Compliance & Integrity</h4>
            <p className="text-[11px] leading-relaxed">
              Demonstration Match simulator uses local state and clear DEMO indicators. Fantasy scoring rules are illustrative for product prototype purposes.
            </p>
            <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-[10px] text-gray-400 mt-2">
              Engineered with zero third-party telemetry, strict server-side API key isolation, and responsive layout.
            </div>
          </div>
        </div>

        {/* Bottom copyright & contact */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>© 2026 FanPulse AI. Built for Dream11 Forward Deployed Engineer Intern Evaluation.</p>
          <div className="flex flex-wrap items-center gap-2 text-gray-400">
            <span>Crafted by <strong className="text-white font-medium">Gaurav Ingwale</strong></span>
            <span>•</span>
            <a
              href="mailto:ingwalegaurav7@gmail.com"
              className="text-[#FF7438] hover:text-[#ff8a55] underline transition font-medium"
            >
              ingwalegaurav7@gmail.com
            </a>
            <span className="hidden sm:inline">•</span>
            <span className="text-[#2589EB] hidden sm:inline">Every Ball Has a Story</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

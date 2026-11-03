# FanPulse AI — Every Ball Has a Story

**Live Cricket Companion & Fan Engagement Platform**  
*Technical Assignment Deliverable for Forward Deployed Engineer (FDE) Intern Role at Dream11*  
*Candidate: Gaurav Ingwale*

---

## 1. Executive Summary & Product Vision

Standard cricket applications provide live scores and ball-by-ball text, but leave fans struggling with fundamental situational questions:
* *Why did the match momentum swing suddenly?*
* *How do boundary releases or dot-ball clusters affect the required equation?*
* *How is my Fantasy XI affected in real time by bowling changes and wickets?*
* *What tactical adjustments will dictate the next two overs?*

**FanPulse AI** addresses this gap by converting live ball-by-ball cricket feeds into actionable, contextual explanations. Designed with the visual polish and data density expected of platforms like Dream11 and ESPNcricinfo, FanPulse AI unifies real-time simulation, deterministic momentum heuristics, Gemini 3.8 Flash intelligence, and a dynamic Fantasy Impact analyzer.

---

## 2. Core Feature Walkthrough

### 1. Live Match Centre & Interactive Ball Simulator
* **Live Scoreboard**: Innings score, target equation, Current Run Rate (CRR), Required Run Rate (RRR), active partnership tracking.
* **Scorecards**: Full Batting Scorecard (dismissals, runs, balls, 4s, 6s, SR) and Bowling Scorecard (overs, maidens, runs, wickets, economy).
* **Ball Simulator**: 9 interactive controls (`0 Dot`, `1`, `2`, `3`, `4 Boundary`, `6 Maximum`, `W Wicket`, `WD Wide`, `NB No Ball`) with over-progression logic (6 legal deliveries, strike rotation, bowler spells).
* **Auto-Play Mode**: Automatically injects realistic deliveries every 4.5 seconds for unattended demonstrations.
* **Match Reset**: 1-click restore back to Over 15.2 (142/3 chasing 182).

### 2. AI Cricket Companion (Signature Feature)
* Backed by **Gemini 3.8 Flash** via a server-side proxy route (`/api/ai/companion`).
* Receives structured situational match context (scores, RRR/CRR delta, active batsman/bowler stats, recent balls, momentum index).
* **Strict 4-Part Response Architecture**:
  1. **Direct Answer**: Crisp 1-2 sentence resolution.
  2. **Match Evidence**: Bullet points citing exact scores, ball events, and run rates.
  3. **Why It Matters**: Tactical implications and fantasy repercussions.
  4. **What To Watch Next**: Actionable matchups in subsequent overs.
* **Deterministic Fallback Engine**: Seamlessly transitions to grounded domain logic if the Gemini API key is unconfigured or rate-limited, clearly labeled with `DEMO ENGINE`.

### 3. Match Intelligence & Momentum Analytics
* **Momentum Line Chart (Recharts)**: Continuous heuristic tracking (-100 to +100 / 0-100% boundary).
* **Runs Per Over Comparison**: Bar chart comparing active chase against par scoring curves.
* **CRR vs RRR Trajectory**: Visual buffer tracking the chasing team's pressure differential.
* **Player Impact Index (MVP)**: Contextual rating evaluated against game leverage.
* **Verified Turning Points**: Historical log of defining match moments.

### 4. Fantasy XI Impact Analyzer
* **Team Selector**: Select 11 players across Wicket-Keepers (WK), Batsmen (BAT), All-Rounders (AR), and Bowlers (BOWL).
* **Multipliers**: Captain (2.0x points) and Vice-Captain (1.5x points).
* **Live Points Engine**: Every simulated ball updates player and team points immediately.
* **Detailed Breakdown**: Modal view showing runs, boundary bonuses, sixes, wickets, maidens, economy, and strike rate modifiers.
* **Mega Contest Leaderboard**: Compete against simulated manager lineups in real time.

### 5. Smart Fan Alerts & Phase Recap
* In-app notifications generated directly from live match events (e.g. Captain boundaries, wickets, momentum peaks, milestone partnerships).
* AI Phase Recap synthesizing Last 2 Overs, Last 5 Overs, Last 10 Overs, or Full Innings.

---

## 3. Demonstration Scenarios

| Scenario | Objective | How to Test |
| :--- | :--- | :--- |
| **Scenario A** | **Wicket Simulation** | Navigate to **Match Centre**, click `W Wicket`. Watch the scoreboard advance to 142/4, commentary log the dismissal, momentum dip, and an alert trigger. |
| **Scenario B** | **AI Contextual Grounding** | Click **AI Companion**, ask *"Why did the momentum change?"*. The response cites exact recent balls, run rate differentials, and active batsmen. |
| **Scenario C** | **Fantasy XI Delta** | In **Fantasy XI**, confirm Suryakumar Yadav is Captain (2x). Go to Match Centre and click `6 Maximum`. Return to Fantasy XI or observe the notification badge to verify immediate point surge. |

---

## 4. Technical Architecture

```
fanpulse-ai/
├── server.ts                   # Express server + Vite middleware + Gemini API endpoints
├── src/
│   ├── App.tsx                 # Root application container & tab router
│   ├── main.tsx                # React DOM entry point
│   ├── index.css               # Tailwind CSS v4 + Plus Jakarta Sans typography
│   ├── context/
│   │   └── CricketContext.tsx  # Centralized state provider (Score, Simulator, Fantasy, Alerts)
│   ├── types/
│   │   └── cricket.ts          # Complete TypeScript domain contracts
│   ├── data/
│   │   └── mockMatches.ts      # Structured match rosters, balls, and initial scores
│   ├── utils/
│   │   ├── fantasyScoring.ts   # Points calculation engine & rules definitions
│   │   └── momentum.ts         # Transparent heuristic formulas & turning point extractors
│   ├── components/
│   │   ├── Header.tsx          # Navigation, micro match ticker, alert drawer
│   │   ├── Footer.tsx          # Brand highlights & technical stack summary
│   │   ├── Scoreboard.tsx      # Innings score hero, batsmen, bowler, tabs
│   │   ├── BallSimulator.tsx   # 9-action interactive simulation pad
│   │   ├── CommentaryFeed.tsx  # Chronological ball commentary with filters
│   │   └── SearchModal.tsx     # Cmd+K search dialog
│   └── pages/
│       ├── HomePage.tsx        # Hero, featured matches, trending moments
│       ├── LiveMatchesPage.tsx # Fixtures and arena overview
│       ├── MatchCentrePage.tsx # Scoreboard + Simulator console
│       ├── AICompanionPage.tsx # Gemini 3.8 Flash conversational companion
│       ├── MatchIntelligencePage.tsx # Recharts analytics & momentum
│       ├── FantasyImpactPage.tsx     # Dream11 style squad manager & leaderboard
│       └── MatchRecapPage.tsx        # Phase summarizer & key events
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Transparent Momentum Heuristic

Rather than displaying ungrounded win probabilities, FanPulse AI uses a deterministic momentum heuristic:

$$\text{Base Score} = 50$$
$$\Delta_{\text{RR}} = (\text{Current Run Rate} - \text{Required Run Rate}) \times 4.2$$
$$\text{Wicket Weight} = (10 - \text{Wickets Lost} - 6) \times 4$$
$$\text{Leverage} = \text{Death Overs Multiplier} + \text{Recent Boundary/Dot Deltas}$$
$$\text{Index} = \operatorname{clamp}(5, 95, \text{Base} + \Delta_{\text{RR}} + \text{Wickets} + \text{Leverage})$$

* **> 65%**: Batting team surging in command.
* **45% - 65%**: Balanced contest.
* **< 45%**: Bowling team tightening the contest.

---

## 6. Illustrative Fantasy Scoring Methodology

| Match Action | Base Points | Notes |
| :--- | :--- | :--- |
| **Every Run** | +1 pt | Applied to active batter |
| **Boundary (4)** | +1 pt | In addition to run points |
| **Six (6)** | +2 pts | In addition to run points |
| **30 / 50 / 100 Runs** | +4 / +8 / +16 pts | Milestone bonuses |
| **Duck Dismissal** | -2 pts | Batsmen/AR out for 0 |
| **Wicket** | +25 pts | Excluding run-outs |
| **LBW / Bowled** | +8 pts | Bonus on top of wicket |
| **Maiden Over** | +12 pts | 6 consecutive dot balls |
| **Economy Rate** | +6 to -4 pts | Min 2 overs bowled |
| **Strike Rate** | +6 to -2 pts | Min 10 balls faced |
| **Captain (C)** | **2.0x Total** | Applied to player total |
| **Vice-Captain (VC)**| **1.5x Total** | Applied to player total |

---

## 7. Setup & Execution Instructions

### Prerequisites
* Node.js 18+ or 20+
* npm or pnpm

### Environment Variables
Configure your `.env` file based on `.env.example`:
```bash
# GEMINI_API_KEY: Optional. If provided, powers live Gemini 3.8 Flash responses.
# If omitted, FanPulse AI automatically falls back to its built-in contextual engine.
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: Optional for hosting callbacks
APP_URL="http://localhost:3000"
```

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Run full-stack dev server (Express + Vite)
npm run dev

# 3. Open browser at
http://localhost:3000
```

### Building for Production
```bash
npm run build
npm start
```

---

*FanPulse AI — Built with passion for cricket fans, engineered with rigor for Dream11.*

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback response generator when Gemini API is unconfigured or rate limited
function generateContextualFallbackCompanion(prompt: string, context: any) {
  const p = prompt.toLowerCase();
  const batting = context.battingTeam || 'Batting Team';
  const bowling = context.bowlingTeam || 'Bowling Team';
  const score = context.score || '142/3';
  const target = context.target || 182;
  const runs = context.runs || 142;
  const wickets = context.wickets || 3;
  const runsNeeded = Math.max(0, target - runs);
  const rrr = context.rrr || '8.57';
  const crr = context.crr || '9.26';
  const striker = context.striker?.name || 'Suryakumar Yadav';
  const nonStriker = context.nonStriker?.name || 'Hardik Pandya';
  const bowler = context.bowler?.name || 'Pat Cummins';
  const momentum = context.momentumIndex || 70;

  if (p.includes('momentum') || p.includes('why did the momentum change')) {
    return {
      directAnswer: `Momentum currently sits at ${momentum}% favoring ${batting}, largely driven by ${striker} and ${nonStriker} rotating strike effectively while punishing loose deliveries.`,
      matchEvidence: [
        `Score stands at ${score} chasing ${target} (CRR ${crr} vs RRR ${rrr}).`,
        `Recent over produced clean boundary releases, keeping required runs at ${runsNeeded} off the final overs.`,
        `Only ${wickets} wickets lost gives ${batting} deep batting buffer in reserve.`
      ],
      whyItMatters: `In high-pressure T20 chases, keeping the required run rate below 10 before the 17th over puts tremendous pressure on ${bowling}'s death bowlers to search for yorkers.`,
      whatToWatchNext: `Watch ${bowler}'s slower ball variations and whether ${striker} accesses the fine-leg boundary behind square.`,
      sentiment: momentum >= 60 ? 'POSITIVE' : 'BALANCED',
      isDemoMode: true
    };
  }

  if (p.includes('struggling') || p.includes('why is')) {
    return {
      directAnswer: `${batting} is balancing risks carefully. Any struggle stems from tight boundary suppression by ${bowler} and the fielding ring inside the 30-yard circle.`,
      matchEvidence: [
        `Dot balls in the previous phase prevented easy singles.`,
        `Current score is ${score} in over ${context.overs || '15.2'}.`,
        `The required run rate has climbed to ${rrr}.`
      ],
      whyItMatters: `When dot ball percentage ticks above 35%, batting sides are forced into high-risk shots that create wicket opportunities.`,
      whatToWatchNext: `Expect ${striker} to employ the sweep or ramp shot to disturb the bowler's disciplined line.`,
      sentiment: 'BALANCED',
      isDemoMode: true
    };
  }

  if (p.includes('can') && p.includes('win')) {
    const reachable = runsNeeded <= 50;
    return {
      directAnswer: `${batting} is in a strong position to win this match, needing ${runsNeeded} runs with ${10 - wickets} wickets intact.`,
      matchEvidence: [
        `Target is ${target}, currently ${score}.`,
        `Required run rate is ${rrr}, which is well within reach of set batsmen ${striker} and ${nonStriker}.`,
        `Momentum index is holding at ${momentum}%.`
      ],
      whyItMatters: `Having two settled finishers at the crease dramatically favors the chasing team during death overs.`,
      whatToWatchNext: `A single 15+ run over will virtually seal the contest for ${batting}.`,
      sentiment: reachable ? 'POSITIVE' : 'CRITICAL',
      isDemoMode: true
    };
  }

  if (p.includes('who is controlling') || p.includes('controlling')) {
    return {
      directAnswer: `${striker} and ${batting} are controlling the tempo, dictating field placements and pacing the chase to perfection.`,
      matchEvidence: [
        `${striker} is scoring at a strike rate of ${context.striker?.strikeRate || 169.2}.`,
        `Partnership between ${striker} and ${nonStriker} has added valuable runs without reckless risks.`,
        `${bowling} has used their primary strike bowlers with limited breakthrough.`
      ],
      whyItMatters: `Control in T20 cricket is determined by who sets the tactical terms—here ${batting} is forcing defensive field spreads.`,
      whatToWatchNext: `Watch whether ${bowling}'s captain brings back pace or introduces reverse swing to break the rhythm.`,
      sentiment: 'POSITIVE',
      isDemoMode: true
    };
  }

  if (p.includes('biggest impact') || p.includes('player')) {
    return {
      directAnswer: `${striker} has made the defining impact of this phase, anchoring the middle overs and dislodging bowling plans.`,
      matchEvidence: [
        `${striker} has notched ${context.striker?.runs || 44} runs off ${context.striker?.balls || 26} balls.`,
        `Strike rate above 160 has prevented the required rate from spiking into double digits.`,
        `Generated the highest fantasy point surge in the innings so far.`
      ],
      whyItMatters: `Middle-overs acceleration prevents bottlenecks that frequently derail run chases at this venue.`,
      whatToWatchNext: `Look out for whether ${striker} converts this into a match-winning half-century.`,
      sentiment: 'POSITIVE',
      isDemoMode: true
    };
  }

  // Generic contextual breakdown
  return {
    directAnswer: `At ${score} chasing ${target}, this match is entering its decisive climax with ${batting} holding a slight statistical advantage.`,
    matchEvidence: [
      `Need ${runsNeeded} runs with RRR at ${rrr} RPO.`,
      `${striker} and ${nonStriker} are the active pair facing ${bowler}.`,
      `Current momentum index stands at ${momentum}%.`
    ],
    whyItMatters: `Every delivery in this window alters the match win probability by 3-5 percentage points.`,
    whatToWatchNext: `Execution of yorkers vs ramp shots in the immediate over.`,
    sentiment: 'BALANCED',
    isDemoMode: true
  };
}

// Helper to call Gemini with multi-model fallback and rate-limit tolerance
async function callGeminiSafe(
  aiClient: GoogleGenAI,
  contents: string,
  systemInstruction?: string
): Promise<string> {
  // Use gemini-2.5-flash as primary (standard tier model with high quotas), then fallback to gemini-2.5-flash-lite, then gemini-3.8-flash
  const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents,
        config: {
          ...(systemInstruction ? { systemInstruction } : {}),
          responseMimeType: 'application/json',
        },
      });
      if (response?.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || String(err);
      const isQuotaOrRateLimit =
        msg.includes('429') ||
        msg.includes('quota') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('rate limit');
      if (!isQuotaOrRateLimit) {
        // If it's a fatal non-quota error, don't spam other models
        break;
      }
    }
  }

  throw lastError || new Error('All available Gemini models could not fulfill the request');
}

// Route 1: AI Cricket Companion
app.post('/api/ai/companion', async (req: Request, res: Response) => {
  try {
    const { prompt, matchContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      // Graceful fallback with clear demo mode tag
      const fallback = generateContextualFallbackCompanion(prompt, matchContext || {});
      return res.json({
        ...fallback,
        note: 'Operating in contextual demo engine (Gemini API key unconfigured). Fully responsive to live simulated match events.'
      });
    }

    const systemInstruction = `
You are FanPulse AI, an elite cricket intelligence analyst and live companion for Dream11 fans.
Your answers MUST be strictly grounded in the provided match data context. NEVER hallucinate scores, player statistics, or match events.

Context format provided:
- Batting team, bowling team, current score, wickets, overs, target, CRR, RRR
- Active batsmen and bowler with live stats
- Recent ball-by-ball events and momentum index

Required output format:
Respond in valid JSON with exactly these keys:
{
  "directAnswer": "Crisp 1-2 sentence direct response to the fan's query",
  "matchEvidence": ["Bullet point 1 citing exact numbers/events", "Bullet point 2 citing RRR/CRR/score", "Bullet point 3 citing players"],
  "whyItMatters": "Why this matters tactically, for the match outcome, or fantasy teams",
  "whatToWatchNext": "Specific tactical action or duel to watch in the next 1-2 overs",
  "sentiment": "POSITIVE" | "BALANCED" | "CRITICAL"
}
`;

    const contents = `
Match Context:
${JSON.stringify(matchContext, null, 2)}

Fan Question:
${prompt}
`;

    try {
      const text = await callGeminiSafe(ai, contents, systemInstruction);
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(clean);
      }
      return res.json({
        ...parsed,
        isDemoMode: false,
      });
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        console.log('[AI Companion] Free-tier quota reached; activating situational intelligence engine.');
      } else {
        console.warn('[AI Companion] Gemini notice:', msg.slice(0, 120));
      }
      const fallback = generateContextualFallbackCompanion(req.body.prompt || '', req.body.matchContext || {});
      return res.json({
        ...fallback,
        note: 'Operating via FanPulse Situational Cricket Engine (AI quota preserved).',
        isDemoMode: true,
      });
    }
  } catch (err: any) {
    const fallback = generateContextualFallbackCompanion(req.body.prompt || '', req.body.matchContext || {});
    return res.json({
      ...fallback,
      note: 'Switched to contextual engine.',
      isDemoMode: true
    });
  }
});

// Route 2: AI Match Recap
app.post('/api/ai/recap', async (req: Request, res: Response) => {
  try {
    const { matchContext, range } = req.body;
    const r = range || 'last_5';
    const batting = matchContext?.battingTeam || 'India';
    const bowling = matchContext?.bowlingTeam || 'Australia';
    const score = matchContext?.score || '142/3';

    if (!ai) {
      return res.json({
        summary: `During the ${r.replace('_', ' ')} phase, ${batting} successfully controlled the chase against ${bowling}, reaching ${score} with disciplined stroke play and low dot-ball percentage.`,
        keyEvents: [
          'SKY 84-meter scoop six off Adam Zampa shifted momentum +12%',
          'Hardik Pandya boundary off Hazlewood to relieve pressure on over 14.5',
          'Disciplined strike rotation yielding singles and doubles in 80% of balls'
        ],
        wickets: matchContext?.wickets || 3,
        boundariesCount: 8,
        runRateSummary: `Phase scoring rate averaged 9.2 RPO against required 8.6 RPO`,
        standoutPlayers: ['Suryakumar Yadav (44* off 26)', 'Hardik Pandya (18* off 10)'],
        turningPoints: ['Zampa 13th over boundary assault', 'Hazlewood tight lines broken by Hardik straight drive'],
        isDemoMode: true,
      });
    }

    const prompt = `
Generate a concise, analytical cricket recap for the phase "${r}".
Match Context:
${JSON.stringify(matchContext, null, 2)}

Respond in valid JSON with:
{
  "summary": "1-3 sentences explaining what happened and the match story",
  "keyEvents": ["event 1 with ball number", "event 2", "event 3"],
  "wickets": number,
  "boundariesCount": number,
  "runRateSummary": "summary of run rate in this phase",
  "standoutPlayers": ["Player 1 (contribution)", "Player 2 (contribution)"],
  "turningPoints": ["Turning point 1", "Turning point 2"]
}
`;

    try {
      const text = await callGeminiSafe(ai, prompt);
      const parsed = JSON.parse(text || '{}');
      return res.json({ ...parsed, isDemoMode: false });
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        console.log('[AI Recap] Free-tier quota reached; serving situational phase recap.');
      } else {
        console.warn('[AI Recap] Notice:', msg.slice(0, 120));
      }
      return res.json({
        summary: `During the ${r.replace('_', ' ')} phase, ${batting} maintained control of the chase against ${bowling}, reaching ${score} with disciplined stroke play and low dot-ball percentage.`,
        keyEvents: ['SKY ramp boundary', 'Hardik punch through extra cover', 'Starc yorker barrage'],
        wickets: matchContext?.wickets || 3,
        boundariesCount: 7,
        runRateSummary: '8.8 RPO maintaining target parity',
        standoutPlayers: ['Suryakumar Yadav', 'Hardik Pandya'],
        turningPoints: ['Six on 13.6', 'Four on 14.5'],
        isDemoMode: true
      });
    }
  } catch (err: any) {
    return res.json({
      summary: 'High-intensity chase where boundary release shots counteracted tight Australian bowling lengths.',
      keyEvents: ['SKY ramp boundary', 'Hardik punch through extra cover', 'Starc yorker barrage'],
      wickets: 3,
      boundariesCount: 7,
      runRateSummary: '8.8 RPO maintaining target parity',
      standoutPlayers: ['Suryakumar Yadav', 'Hardik Pandya'],
      turningPoints: ['Six on 13.6', 'Four on 14.5'],
      isDemoMode: true
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    product: 'FanPulse AI',
    timestamp: new Date().toISOString(),
  });
});

// Dev vs Prod Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FanPulse AI server running at http://localhost:${PORT}`);
  });
}

startServer();

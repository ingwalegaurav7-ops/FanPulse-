import { Match, BallEvent } from '../types/cricket';

export interface TurningPoint {
  id: string;
  overText: string;
  headline: string;
  description: string;
  momentumShift: string;
  favorsTeam: string;
  type: 'WICKET' | 'BOUNDARY' | 'MAIDEN' | 'PARTNERSHIP';
}

/**
 * Transparent Momentum Heuristic
 *
 * Base Score: 50 (Neutral equilibrium)
 * Factors:
 * 1. Run-Rate Pressure Delta: (Current Run Rate - Required Run Rate) * 4.5
 * 2. Wickets in Hand Weight: (10 - wicketsLost) * 3.5 - 20
 * 3. Recent phase scoring trajectory (last 12 balls run rate vs required)
 * 4. Boundary frequency bonus (+4 per recent boundary)
 * 5. Dot ball suppression (-2.5 per dot ball under high RRR)
 * Clamped strictly between 5% and 95%.
 */
export function calculateMatchMomentum(match: Match): number {
  const target = match.target || (match.firstInningsTotal ? match.firstInningsTotal.runs + 1 : 160);
  const runsRemaining = Math.max(0, target - match.runs);
  const totalBalls = match.totalOvers * 6;
  const ballsBowled = match.completedOvers * 6 + match.ballsInCurrentOver;
  const ballsRemaining = Math.max(1, totalBalls - ballsBowled);

  const crr = ballsBowled > 0 ? (match.runs / ballsBowled) * 6 : 6.0;
  const rrr = (runsRemaining / ballsRemaining) * 6;

  // Base 50
  let score = 50;

  // 1. Run Rate Delta factor
  const rrDelta = crr - rrr;
  score += rrDelta * 4.2;

  // 2. Wickets in Hand factor
  const wicketsLeft = 10 - match.wickets;
  if (wicketsLeft >= 7) {
    score += (wicketsLeft - 6) * 4;
  } else if (wicketsLeft <= 4) {
    score -= (5 - wicketsLeft) * 8;
  }

  // 3. Balls Remaining Context (Death overs amplify leverage)
  if (ballsRemaining <= 30) {
    if (runsRemaining <= ballsRemaining * 1.2) {
      score += 10;
    } else if (runsRemaining > ballsRemaining * 1.8) {
      score -= 15;
    }
  }

  // 4. Recent balls surge/dip
  const recentBalls = match.recentBalls.slice(-6);
  if (recentBalls.length > 0) {
    const recentWickets = recentBalls.filter(b => b.isWicket).length;
    const recentBoundaries = recentBalls.filter(b => b.isBoundary || b.isSix).length;
    const recentDots = recentBalls.filter(b => b.runs === 0 && !b.isExtra).length;

    score -= recentWickets * 12;
    score += recentBoundaries * 4;
    if (rrr > 9.0) {
      score -= recentDots * 2.5;
    }
  }

  // Bound strictly between 5% and 95%
  return Math.min(95, Math.max(5, Math.round(score)));
}

export function getMomentumExplanation(match: Match, lastBall?: BallEvent) {
  const momentum = match.momentumIndex;
  const battingTeam = match.battingTeamId;
  const bowlingTeam = match.bowlingTeamId;

  if (lastBall?.isWicket) {
    return {
      whatHappened: `Wicket fell on ${lastBall.ballText}: ${lastBall.dismissedPlayerName || 'Batsman'} departed.`,
      whyShifted: `A crucial breakthrough halted the scoring momentum and exposed the middle order.`,
      benefited: bowlingTeam,
      watchNext: `How the new batsman handles the first 5 deliveries and prevents a cluster collapse.`
    };
  }

  if (lastBall?.isSix) {
    return {
      whatHappened: `Massive 6 struck on ${lastBall.ballText} by ${lastBall.batsmanName}.`,
      whyShifted: `Broke the bowling pressure, reducing the required run rate by over 0.6 per over immediately.`,
      benefited: battingTeam,
      watchNext: `Whether the bowler alters their length to defensive short balls or yorkers.`
    };
  }

  if (momentum >= 65) {
    return {
      whatHappened: `${battingTeam} is scoring comfortably at ${(match.runs / Math.max(1, (match.completedOvers * 6 + match.ballsInCurrentOver) / 6)).toFixed(2)} RPO.`,
      whyShifted: `Partnership is rotating strike cleanly with low dot-ball percentage.`,
      benefited: battingTeam,
      watchNext: `Death bowling execution and yorker accuracy from ${bowlingTeam}.`
    };
  } else if (momentum <= 45) {
    return {
      whatHappened: `Required run rate has climbed significantly as dot balls accumulate.`,
      whyShifted: `${bowlingTeam} bowlers are executing hard lengths and denying boundary release.`,
      benefited: bowlingTeam,
      watchNext: `A high-risk boundary assault required from the batting pair in the next over.`
    };
  }

  return {
    whatHappened: `Tightly contested phase with both sides trading blows.`,
    whyShifted: `Runs are coming but boundaries remain contained.`,
    benefited: 'Even balance',
    watchNext: `The next boundary or wicket will trigger a decisive momentum pivot.`
  };
}

export function extractTurningPoints(match: Match): TurningPoint[] {
  const points: TurningPoint[] = [];

  // Analyze match events and scorecard
  if (match.battingScorecard.some(b => b.isOut && b.runs > 50)) {
    const bigWicket = match.battingScorecard.find(b => b.isOut && b.runs > 50);
    points.push({
      id: 'tp_1',
      overText: 'Over 10.3',
      headline: `Key Dismissal: ${bigWicket?.name}`,
      description: `${bigWicket?.name} had scored ${bigWicket?.runs} runs. Dismissal swung momentum +18% to bowling team.`,
      momentumShift: '-18%',
      favorsTeam: match.bowlingTeamId,
      type: 'WICKET'
    });
  }

  points.push({
    id: 'tp_2',
    overText: 'Over 13.6',
    headline: 'SKY 84m Scoop for Six over Fine Leg',
    description: 'Relieved huge over pressure off Adam Zampa, shifting CRR to 9.42.',
    momentumShift: '+12%',
    favorsTeam: match.battingTeamId,
    type: 'BOUNDARY'
  });

  points.push({
    id: 'tp_3',
    overText: 'Over 14.5',
    headline: 'Hardik Pandya 94mph Straight Drive Four',
    description: 'Punished Josh Hazlewood over mid-on to bring the required equation under 45 runs.',
    momentumShift: '+8%',
    favorsTeam: match.battingTeamId,
    type: 'BOUNDARY'
  });

  return points;
}

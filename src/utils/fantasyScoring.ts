import { Player, BatsmanStats, BowlerStats, FantasyPlayerPoint } from '../types/cricket';

export interface ScoringRuleItem {
  event: string;
  points: string;
  category: 'Batting' | 'Bowling' | 'Fielding' | 'Economy' | 'Strike Rate';
}

export const FANTASY_SCORING_RULES: ScoringRuleItem[] = [
  { event: 'Every Run Scored', points: '+1 pt', category: 'Batting' },
  { event: 'Boundary Bonus (Four)', points: '+1 pt', category: 'Batting' },
  { event: 'Six Bonus', points: '+2 pts', category: 'Batting' },
  { event: '30 Run Bonus', points: '+4 pts', category: 'Batting' },
  { event: 'Half-Century (50 Runs)', points: '+8 pts', category: 'Batting' },
  { event: 'Century (100 Runs)', points: '+16 pts', category: 'Batting' },
  { event: 'Duck (Batsman, WK, AR out for 0)', points: '-2 pts', category: 'Batting' },
  { event: 'Wicket (excluding Run-Out)', points: '+25 pts', category: 'Bowling' },
  { event: 'LBW / Bowled Bonus', points: '+8 pts', category: 'Bowling' },
  { event: '3 Wicket Haul Bonus', points: '+4 pts', category: 'Bowling' },
  { event: '4 Wicket Haul Bonus', points: '+8 pts', category: 'Bowling' },
  { event: '5 Wicket Haul Bonus', points: '+16 pts', category: 'Bowling' },
  { event: 'Maiden Over', points: '+12 pts', category: 'Bowling' },
  { event: 'Catch Taken', points: '+8 pts', category: 'Fielding' },
  { event: 'Stumping / Direct Run-Out', points: '+12 pts', category: 'Fielding' },
  { event: 'Captain Multiplier', points: '2.0x Total', category: 'Batting' },
  { event: 'Vice-Captain Multiplier', points: '1.5x Total', category: 'Batting' },
];

export function calculatePlayerPoints(
  player: Player,
  battingStat?: BatsmanStats,
  bowlingStat?: BowlerStats,
  fieldingCatches: number = 0,
  isCaptain: boolean = false,
  isViceCaptain: boolean = false
): FantasyPlayerPoint {
  let runsPoints = 0;
  let boundaryBonus = 0;
  let sixBonus = 0;
  let wicketPoints = 0;
  let lbwBowledBonus = 0;
  let economyBonus = 0;
  let strikeRateBonus = 0;
  let milestoneBonus = 0;

  // Batting calculations
  if (battingStat) {
    runsPoints += battingStat.runs;
    boundaryBonus += battingStat.fours * 1;
    sixBonus += battingStat.sixes * 2;

    if (battingStat.runs >= 100) {
      milestoneBonus += 16;
    } else if (battingStat.runs >= 50) {
      milestoneBonus += 8;
    } else if (battingStat.runs >= 30) {
      milestoneBonus += 4;
    }

    if (battingStat.isOut && battingStat.runs === 0 && player.role !== 'BOWL') {
      runsPoints -= 2; // Duck penalty
    }

    // Strike rate bonus/penalty (min 10 balls)
    if (battingStat.balls >= 10) {
      const sr = (battingStat.runs / battingStat.balls) * 100;
      if (sr >= 170) strikeRateBonus += 6;
      else if (sr >= 150) strikeRateBonus += 4;
      else if (sr >= 130) strikeRateBonus += 2;
      else if (sr < 70) strikeRateBonus -= 2;
    }
  }

  // Bowling calculations
  if (bowlingStat) {
    wicketPoints += bowlingStat.wickets * 25;

    if (bowlingStat.wickets >= 5) milestoneBonus += 16;
    else if (bowlingStat.wickets >= 4) milestoneBonus += 8;
    else if (bowlingStat.wickets >= 3) milestoneBonus += 4;

    // Maidens
    wicketPoints += bowlingStat.maidens * 12;

    // Economy bonus/penalty (min 2 overs)
    if (bowlingStat.overs >= 2) {
      const econ = bowlingStat.runsConceded / (bowlingStat.overs + bowlingStat.ballsThisOver / 6);
      if (econ < 6.0) economyBonus += 6;
      else if (econ <= 7.0) economyBonus += 4;
      else if (econ <= 8.0) economyBonus += 2;
      else if (econ > 11.0) economyBonus -= 4;
      else if (econ > 10.0) economyBonus -= 2;
    }
  }

  // Fielding catches
  const fieldingPoints = fieldingCatches * 8;

  const basePoints = Math.round(
    runsPoints +
    boundaryBonus +
    sixBonus +
    wicketPoints +
    lbwBowledBonus +
    economyBonus +
    strikeRateBonus +
    milestoneBonus +
    fieldingPoints +
    4 // Starting XI appearance points
  );

  const multiplier = isCaptain ? 2.0 : isViceCaptain ? 1.5 : 1.0;
  const totalPoints = Math.round(basePoints * multiplier);

  return {
    playerId: player.id,
    playerName: player.name,
    team: player.team,
    role: player.role,
    isCaptain,
    isViceCaptain,
    basePoints,
    multiplier,
    totalPoints,
    breakdown: {
      runsPoints,
      boundaryBonus,
      sixBonus,
      wicketPoints,
      lbwBowledBonus,
      economyBonus,
      strikeRateBonus,
      milestoneBonus,
    },
  };
}

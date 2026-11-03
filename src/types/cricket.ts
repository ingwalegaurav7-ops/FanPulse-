export type MatchFormat = 'T20' | 'ODI' | 'TEST';
export type MatchStatus = 'LIVE' | 'UPCOMING' | 'COMPLETED';

export interface Player {
  id: string;
  name: string;
  shortName: string;
  team: string; // e.g. "IND" or "AUS"
  role: 'BAT' | 'BOWL' | 'AR' | 'WK';
  credits: number;
  avatarUrl?: string;
  battingStyle: string;
  bowlingStyle?: string;
}

export interface BatsmanStats {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissal?: string;
  isOnStrike: boolean;
}

export interface BowlerStats {
  playerId: string;
  name: string;
  overs: number;
  ballsThisOver: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  wides?: number;
  noBalls?: number;
}

export interface ExtrasBreakdown {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalty: number;
  total: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  playerOutName: string;
  overText: string;
}

export interface Partnership {
  batsman1Id: string;
  batsman1Runs: number;
  batsman1Balls: number;
  batsman2Id: string;
  batsman2Runs: number;
  batsman2Balls: number;
  totalRuns: number;
  totalBalls: number;
}

export interface BallEvent {
  id: string;
  over: number;
  ballNumber: number; // 1 to 6 (or extras)
  ballText: string; // e.g. "15.3"
  runs: number;
  isBoundary: boolean;
  isSix: boolean;
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout';
  dismissedPlayerName?: string;
  catcherName?: string;
  isExtra: boolean;
  extraType?: 'wide' | 'noball' | 'bye' | 'legbye';
  batsmanName: string;
  bowlerName: string;
  commentary: string;
  scoreAfterBall: string; // e.g. "146/3"
  momentumScore: number; // -100 to +100
  timestamp: string;
  impactRating: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface OverSummary {
  overNumber: number;
  runs: number;
  wickets: number;
  bowlerName: string;
  balls: string[];
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  accentColor: string;
  logo: string;
  players: Player[];
}

export interface InningsScorecard {
  teamId: string;
  teamName: string;
  totalRuns: number;
  wickets: number;
  completedOvers: number;
  ballsInCurrentOver: number;
  runRate: number;
  batting: BatsmanStats[];
  bowling: BowlerStats[];
  extras: ExtrasBreakdown;
  fallOfWickets: FallOfWicket[];
}

export interface MatchResult {
  winnerTeamId: string;
  winnerTeamName: string;
  marginText: string; // e.g. "by 6 wickets" or "by 18 runs"
  resultSummary: string; // e.g. "India won by 6 wickets (with 14 balls remaining)"
  isTie: boolean;
  chasedTarget: boolean;
  playerOfTheMatch: {
    playerId: string;
    name: string;
    team: string;
    performance: string;
    mvpPoints: number;
  };
  topScorer: {
    name: string;
    team: string;
    runs: number;
    balls: number;
  };
  bestBowler: {
    name: string;
    team: string;
    figures: string;
  };
}

export interface Match {
  id: string;
  tournament: string;
  venue: string;
  format: MatchFormat;
  status: MatchStatus;
  statusText: string;
  isSimulatedDemo: boolean;
  teamA: Team;
  teamB: Team;
  battingTeamId: string;
  bowlingTeamId: string;
  tossWinner: string;
  tossDecision: 'bat' | 'bowl';
  target?: number;
  currentInnings: 1 | 2;
  totalOvers: number;
  maxOversPerBowler: number;
  // Current score state
  runs: number;
  wickets: number;
  completedOvers: number;
  ballsInCurrentOver: number; // 0 to 5
  firstInningsTotal?: {
    runs: number;
    wickets: number;
    overs: number;
  };
  firstInningsScorecard?: InningsScorecard;
  secondInningsScorecard?: InningsScorecard;
  extras: ExtrasBreakdown;
  fallOfWickets: FallOfWicket[];
  currentBatsmen: [BatsmanStats, BatsmanStats]; // [Striker, Non-striker]
  currentBowler: BowlerStats;
  lastBowlerId?: string; // Bowler who bowled previous over (cannot bowl back-to-back)
  autoBowlerChange: boolean;
  isBowlerSelectPending: boolean;
  currentPartnership: Partnership;
  battingScorecard: BatsmanStats[];
  bowlingScorecard: BowlerStats[];
  ballHistory: BallEvent[];
  recentBalls: BallEvent[]; // last 6-12 balls
  oversSummary: OverSummary[];
  momentumIndex: number; // 0 to 100 percentage in favor of batting team (50 = even)
  momentumTrend: 'SURGING' | 'STEADY' | 'COLLAPSING';
  result?: MatchResult;
}

export interface FantasyPlayerPoint {
  playerId: string;
  playerName: string;
  team: string;
  role: 'BAT' | 'BOWL' | 'AR' | 'WK';
  isCaptain: boolean;
  isViceCaptain: boolean;
  basePoints: number;
  multiplier: number;
  totalPoints: number;
  breakdown: {
    runsPoints: number;
    boundaryBonus: number;
    sixBonus: number;
    wicketPoints: number;
    lbwBowledBonus: number;
    economyBonus: number;
    strikeRateBonus: number;
    milestoneBonus: number;
  };
}

export interface FantasyTeam {
  id: string;
  name: string;
  selectedPlayerIds: string[];
  captainId: string | null;
  viceCaptainId: string | null;
  totalCreditsUsed: number;
  totalPoints: number;
  playerPoints: Record<string, FantasyPlayerPoint>;
}

export interface SmartAlert {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'WICKET' | 'BOUNDARY' | 'MOMENTUM' | 'FANTASY' | 'MILESTONE' | 'MATCH_STATE';
  severity: 'CRITICAL' | 'IMPORTANT' | 'INFO';
  read: boolean;
}

export interface AIResponseStructured {
  directAnswer: string;
  matchEvidence: string[];
  whyItMatters: string;
  whatToWatchNext: string;
  sentiment: 'POSITIVE' | 'BALANCED' | 'CRITICAL';
  isDemoMode?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  query?: string;
  response?: AIResponseStructured;
  plainText?: string;
  isLoading?: boolean;
}

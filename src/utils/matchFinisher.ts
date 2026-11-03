import { Match, MatchResult, BowlerStats, BatsmanStats } from '../types/cricket';

export function computePlayerOfTheMatch(match: Match, winningTeamId: string) {
  let highestMvp = -999;
  let potm = {
    playerId: 'ind_rohit',
    name: 'Rohit Sharma',
    team: 'India',
    performance: '57 (32b, 6x4, 4x6)',
    mvpPoints: 85,
  };

  const evaluatePlayer = (
    playerId: string,
    name: string,
    teamName: string,
    isWinner: boolean,
    batting?: BatsmanStats,
    bowling?: BowlerStats
  ) => {
    let points = 0;
    let perf = '';

    if (batting && batting.balls > 0) {
      points += batting.runs * 1;
      points += batting.fours * 1;
      points += batting.sixes * 2;
      if (batting.runs >= 75) points += 20;
      else if (batting.runs >= 50) points += 12;
      else if (batting.runs >= 30) points += 6;

      if (batting.balls >= 15 && batting.strikeRate >= 150) {
        points += 10;
      }
      perf = `${batting.runs} (${batting.balls}b, ${batting.fours}x4, ${batting.sixes}x6)`;
    }

    if (bowling && (bowling.overs > 0 || bowling.ballsThisOver > 0)) {
      const bowlingPts = bowling.wickets * 25 + bowling.maidens * 15;
      if (bowling.wickets >= 3) points += 15;
      if (bowling.overs >= 2 && bowling.economy <= 7.0) points += 10;
      points += bowlingPts;

      const bowlText = `${bowling.wickets}/${bowling.runsConceded} (${bowling.overs}.${bowling.ballsThisOver} ov)`;
      perf = perf ? `${perf} & ${bowlText}` : bowlText;
    }

    if (isWinner) {
      points += 10;
    }

    if (points > highestMvp) {
      highestMvp = points;
      potm = {
        playerId,
        name,
        team: teamName,
        performance: perf || `${name} - match MVP`,
        mvpPoints: Math.round(points),
      };
    }
  };

  // Evaluate First Innings
  if (match.firstInningsScorecard) {
    const inn1 = match.firstInningsScorecard;
    const isWinner1 = inn1.teamId === winningTeamId;
    inn1.batting.forEach((b) => {
      const bowl = inn1.bowling.find((bw) => bw.playerId === b.playerId);
      evaluatePlayer(b.playerId, b.name, inn1.teamName, isWinner1, b, bowl);
    });
    inn1.bowling.forEach((bw) => {
      if (!inn1.batting.some((b) => b.playerId === bw.playerId)) {
        evaluatePlayer(bw.playerId, bw.name, inn1.teamName === match.teamA.name ? match.teamB.name : match.teamA.name, !isWinner1, undefined, bw);
      }
    });
  }

  // Evaluate Second Innings
  const battingTeamName = match.battingTeamId === match.teamA.id ? match.teamA.name : match.teamB.name;
  const bowlingTeamName = match.bowlingTeamId === match.teamA.id ? match.teamA.name : match.teamB.name;
  const isBattingWinner = match.battingTeamId === winningTeamId;

  match.battingScorecard.forEach((b) => {
    const bowl = match.bowlingScorecard.find((bw) => bw.playerId === b.playerId);
    evaluatePlayer(b.playerId, b.name, battingTeamName, isBattingWinner, b, bowl);
  });

  match.bowlingScorecard.forEach((bw) => {
    if (!match.battingScorecard.some((b) => b.playerId === bw.playerId)) {
      evaluatePlayer(bw.playerId, bw.name, bowlingTeamName, !isBattingWinner, undefined, bw);
    }
  });

  return potm;
}

export function computeMatchResult(match: Match): MatchResult {
  const target = match.target || (match.firstInningsTotal ? match.firstInningsTotal.runs + 1 : 182);
  const totalBalls = match.totalOvers * 6;
  const ballsBowled = match.completedOvers * 6 + match.ballsInCurrentOver;
  const ballsRemaining = Math.max(0, totalBalls - ballsBowled);
  const wicketsLeft = 10 - match.wickets;

  const battingTeam = match.battingTeamId === match.teamA.id ? match.teamA : match.teamB;
  const bowlingTeam = match.bowlingTeamId === match.teamA.id ? match.teamA : match.teamB;

  let winnerTeamId = '';
  let winnerTeamName = '';
  let marginText = '';
  let resultSummary = '';
  let isTie = false;
  let chasedTarget = false;

  if (match.runs >= target) {
    // Chasing team won
    winnerTeamId = battingTeam.id;
    winnerTeamName = battingTeam.name;
    marginText = `by ${wicketsLeft} wicket${wicketsLeft > 1 ? 's' : ''}`;
    resultSummary = `${battingTeam.name} won by ${wicketsLeft} wicket${wicketsLeft > 1 ? 's' : ''} (with ${ballsRemaining} ball${ballsRemaining !== 1 ? 's' : ''} remaining)`;
    chasedTarget = true;
  } else if (match.wickets >= 10 || ballsRemaining === 0) {
    // Innings finished without reaching target
    if (match.runs === target - 1) {
      isTie = true;
      winnerTeamId = 'TIE';
      winnerTeamName = 'Match Tied';
      marginText = 'Scores Level';
      resultSummary = `Match Tied! Both teams scored ${match.runs} runs.`;
    } else {
      const runMargin = target - 1 - match.runs;
      winnerTeamId = bowlingTeam.id;
      winnerTeamName = bowlingTeam.name;
      marginText = `by ${runMargin} run${runMargin > 1 ? 's' : ''}`;
      resultSummary = `${bowlingTeam.name} won by ${runMargin} run${runMargin > 1 ? 's' : ''} (defended ${target - 1} runs)`;
      chasedTarget = false;
    }
  } else {
    // Match still live
    return {
      winnerTeamId: '',
      winnerTeamName: 'In Progress',
      marginText: 'Live',
      resultSummary: `${battingTeam.name} need ${Math.max(0, target - match.runs)} runs in ${ballsRemaining} balls`,
      isTie: false,
      chasedTarget: false,
      playerOfTheMatch: {
        playerId: 'ind_sky',
        name: 'Suryakumar Yadav',
        team: 'India',
        performance: '44* (26b)',
        mvpPoints: 65,
      },
      topScorer: {
        name: 'Travis Head',
        team: 'Australia',
        runs: 76,
        balls: 43,
      },
      bestBowler: {
        name: 'Arshdeep Singh',
        team: 'India',
        figures: '3/37 (4.0 ov)',
      },
    };
  }

  // Top Scorer across both innings
  let topScorer = { name: 'Travis Head', team: 'Australia', runs: 76, balls: 43 };
  if (match.firstInningsScorecard) {
    match.firstInningsScorecard.batting.forEach((b) => {
      if (b.runs > topScorer.runs) {
        topScorer = { name: b.name, team: match.firstInningsScorecard!.teamName, runs: b.runs, balls: b.balls };
      }
    });
  }
  match.battingScorecard.forEach((b) => {
    if (b.runs > topScorer.runs) {
      topScorer = { name: b.name, team: battingTeam.name, runs: b.runs, balls: b.balls };
    }
  });

  // Best Bowler across both innings
  let bestBowler = { name: 'Arshdeep Singh', team: 'India', figures: '3/37 (4.0 ov)', wickets: 3, econ: 9.25 };
  if (match.firstInningsScorecard) {
    match.firstInningsScorecard.bowling.forEach((bw) => {
      if (bw.wickets > bestBowler.wickets || (bw.wickets === bestBowler.wickets && bw.economy < bestBowler.econ)) {
        bestBowler = {
          name: bw.name,
          team: match.firstInningsScorecard!.teamName === match.teamA.name ? match.teamB.name : match.teamA.name,
          figures: `${bw.wickets}/${bw.runsConceded} (${bw.overs}.${bw.ballsThisOver} ov)`,
          wickets: bw.wickets,
          econ: bw.economy,
        };
      }
    });
  }
  match.bowlingScorecard.forEach((bw) => {
    if (bw.wickets > bestBowler.wickets || (bw.wickets === bestBowler.wickets && bw.economy < bestBowler.econ)) {
      bestBowler = {
        name: bw.name,
        team: bowlingTeam.name,
        figures: `${bw.wickets}/${bw.runsConceded} (${bw.overs}.${bw.ballsThisOver} ov)`,
        wickets: bw.wickets,
        econ: bw.economy,
      };
    }
  });

  const potm = computePlayerOfTheMatch(match, winnerTeamId);

  return {
    winnerTeamId,
    winnerTeamName,
    marginText,
    resultSummary,
    isTie,
    chasedTarget,
    playerOfTheMatch: potm,
    topScorer: {
      name: topScorer.name,
      team: topScorer.team,
      runs: topScorer.runs,
      balls: topScorer.balls,
    },
    bestBowler: {
      name: bestBowler.name,
      team: bestBowler.team,
      figures: bestBowler.figures,
    },
  };
}

export function getEligibleBowlers(match: Match): { player: any; stats: BowlerStats; eligible: boolean; ineligibilityReason?: string }[] {
  const bowlingTeam = match.bowlingTeamId === match.teamA.id ? match.teamA : match.teamB;
  const maxOvers = match.maxOversPerBowler || 4;

  return bowlingTeam.players.map((p) => {
    const existingStats = match.bowlingScorecard.find((bw) => bw.playerId === p.id);
    const stats: BowlerStats = existingStats || {
      playerId: p.id,
      name: p.name,
      overs: 0,
      ballsThisOver: 0,
      maidens: 0,
      runsConceded: 0,
      wickets: 0,
      economy: 0,
      wides: 0,
      noBalls: 0,
    };

    let eligible = true;
    let ineligibilityReason: string | undefined;

    // Rule 1: Cannot bowl consecutive overs
    if (p.id === match.lastBowlerId) {
      eligible = false;
      ineligibilityReason = 'Just bowled previous over (no consecutive overs)';
    }
    // Rule 2: Cannot exceed max overs quota
    else if (stats.overs >= maxOvers) {
      eligible = false;
      ineligibilityReason = `Reached maximum ${maxOvers} overs quota`;
    }

    return {
      player: p,
      stats,
      eligible,
      ineligibilityReason,
    };
  });
}

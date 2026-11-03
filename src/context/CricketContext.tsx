import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Match,
  BallEvent,
  FantasyTeam,
  SmartAlert,
  BatsmanStats,
  BowlerStats,
  Partnership,
  OverSummary,
  InningsScorecard,
  MatchResult,
} from '../types/cricket';
import { ALL_MATCHES, INITIAL_MATCH_IND_AUS } from '../data/mockMatches';
import { calculatePlayerPoints } from '../utils/fantasyScoring';
import { calculateMatchMomentum } from '../utils/momentum';
import { computeMatchResult, getEligibleBowlers } from '../utils/matchFinisher';

export type BallActionType = 'dot' | '1' | '2' | '3' | '4' | '6' | 'wicket' | 'wide' | 'noball';

interface CricketContextType {
  matches: Match[];
  selectedMatch: Match;
  setSelectedMatchId: (id: string) => void;
  simulateBall: (action: BallActionType) => void;
  resetCurrentMatch: () => void;
  isAutoPlay: boolean;
  toggleAutoPlay: () => void;
  selectNextBowler: (bowlerId: string) => void;
  toggleAutoBowlerChange: () => void;
  isBowlerModalOpen: boolean;
  setIsBowlerModalOpen: (open: boolean) => void;
  fantasyTeam: FantasyTeam;
  setFantasyTeam: React.Dispatch<React.SetStateAction<FantasyTeam>>;
  togglePlayerInFantasy: (playerId: string) => void;
  setCaptain: (playerId: string) => void;
  setViceCaptain: (playerId: string) => void;
  loadPrebuiltFantasyXI: () => void;
  notifications: SmartAlert[];
  unreadNotificationCount: number;
  markAlertRead: (id: string) => void;
  clearAllAlerts: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  isFinalScorecardOpen: boolean;
  setIsFinalScorecardOpen: (open: boolean) => void;
}

const CricketContext = createContext<CricketContextType | undefined>(undefined);

export const DEFAULT_FANTASY_XI: string[] = [
  'ind_rohit',
  'ind_sky',
  'ind_hardik',
  'ind_bumrah',
  'ind_pant',
  'aus_head',
  'aus_maxwell',
  'aus_stoinis',
  'aus_cummins',
  'aus_zampa',
  'aus_hazlewood',
];

export const CricketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>(() => {
    return JSON.parse(JSON.stringify(ALL_MATCHES));
  });

  const [selectedMatchId, setSelectedMatchId] = useState<string>('match_ind_aus_2024');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isBowlerModalOpen, setIsBowlerModalOpen] = useState<boolean>(false);
  const [isFinalScorecardOpen, setIsFinalScorecardOpen] = useState<boolean>(false);

  // Active match helper
  const selectedMatch = useMemo(() => {
    return matches.find((m) => m.id === selectedMatchId) || matches[0];
  }, [matches, selectedMatchId]);

  // Notifications state
  const [notifications, setNotifications] = useState<SmartAlert[]>([
    {
      id: 'init_alert_1',
      timestamp: '2 mins ago',
      title: 'TARGET EQUATION UPDATE',
      description: 'India require 40 runs from 28 deliveries. RRR holding at 8.57.',
      category: 'MATCH_STATE',
      severity: 'INFO',
      read: false,
    },
    {
      id: 'init_alert_2',
      timestamp: '3 mins ago',
      title: 'MOMENTUM PEAK (+12%)',
      description: 'Suryakumar Yadav 84m scoop six over fine-leg swings momentum to 72% in favor of India.',
      category: 'MOMENTUM',
      severity: 'IMPORTANT',
      read: false,
    },
    {
      id: 'init_alert_3',
      timestamp: '6 mins ago',
      title: 'FANTASY ALERT',
      description: 'Hardik Pandya hit a boundary! +5 Fantasy Points earned for your squad.',
      category: 'FANTASY',
      severity: 'INFO',
      read: false,
    },
  ]);

  // Fantasy Team State
  const [fantasyTeam, setFantasyTeam] = useState<FantasyTeam>(() => {
    const saved = localStorage.getItem('fanpulse_fantasy_team');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: 'user_team_1',
      name: 'Pulse XI',
      selectedPlayerIds: [...DEFAULT_FANTASY_XI],
      captainId: 'ind_sky',
      viceCaptainId: 'aus_cummins',
      totalCreditsUsed: 96.0,
      totalPoints: 462,
      playerPoints: {},
    };
  });

  const recalculateFantasyPoints = useCallback(
    (currentMatch: Match, team: FantasyTeam): FantasyTeam => {
      const allPlayers = [...currentMatch.teamA.players, ...currentMatch.teamB.players];
      const playerPointsMap: Record<string, any> = {};
      let totalPts = 0;

      team.selectedPlayerIds.forEach((pid) => {
        const player = allPlayers.find((p) => p.id === pid);
        if (!player) return;

        // Check in 2nd innings
        let battingStat = currentMatch.battingScorecard.find((b) => b.playerId === pid);
        let bowlingStat = currentMatch.bowlingScorecard.find((bw) => bw.playerId === pid);

        // Also check in 1st innings if applicable
        if (currentMatch.firstInningsScorecard) {
          if (!battingStat) {
            battingStat = currentMatch.firstInningsScorecard.batting.find((b) => b.playerId === pid);
          }
          if (!bowlingStat) {
            bowlingStat = currentMatch.firstInningsScorecard.bowling.find((bw) => bw.playerId === pid);
          }
        }

        const isCap = team.captainId === pid;
        const isVc = team.viceCaptainId === pid;

        const calculated = calculatePlayerPoints(player, battingStat, bowlingStat, 1, isCap, isVc);
        playerPointsMap[pid] = calculated;
        totalPts += calculated.totalPoints;
      });

      return {
        ...team,
        playerPoints: playerPointsMap,
        totalPoints: totalPts,
      };
    },
    []
  );

  useEffect(() => {
    setFantasyTeam((prev) => recalculateFantasyPoints(selectedMatch, prev));
  }, [selectedMatch, recalculateFantasyPoints]);

  useEffect(() => {
    localStorage.setItem('fanpulse_fantasy_team', JSON.stringify(fantasyTeam));
  }, [fantasyTeam]);

  const addNotification = useCallback((alert: Omit<SmartAlert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: SmartAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newAlert, ...prev.slice(0, 19)]);
  }, []);

  // Helper to build full synchronized second innings scorecard
  const constructSecondInningsScorecard = (m: Match): InningsScorecard => {
    const totalBalls = m.completedOvers * 6 + m.ballsInCurrentOver;
    const runRate = totalBalls > 0 ? parseFloat(((m.runs / totalBalls) * 6).toFixed(2)) : 0;
    const battingTeamName = m.battingTeamId === m.teamA.id ? m.teamA.name : m.teamB.name;

    return {
      teamId: m.battingTeamId,
      teamName: battingTeamName,
      totalRuns: m.runs,
      wickets: m.wickets,
      completedOvers: m.completedOvers,
      ballsInCurrentOver: m.ballsInCurrentOver,
      runRate,
      batting: m.battingScorecard,
      bowling: m.bowlingScorecard,
      extras: m.extras,
      fallOfWickets: m.fallOfWickets,
    };
  };

  // Toggle Auto Bowler Selection
  const toggleAutoBowlerChange = useCallback(() => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMatchId) return m;
        return { ...m, autoBowlerChange: !m.autoBowlerChange };
      })
    );
  }, [selectedMatchId]);

  // Manually select next bowler from eligible list
  const selectNextBowler = useCallback(
    (bowlerId: string) => {
      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.id !== selectedMatchId) return m;

          const bowlingTeam = m.bowlingTeamId === m.teamA.id ? m.teamA : m.teamB;
          const player = bowlingTeam.players.find((p) => p.id === bowlerId);
          if (!player) return m;

          // Check if stats exist or create new
          const existingStat = m.bowlingScorecard.find((bw) => bw.playerId === bowlerId);
          const bowlerStat: BowlerStats = existingStat || {
            playerId: player.id,
            name: player.name,
            overs: 0,
            ballsThisOver: 0,
            maidens: 0,
            runsConceded: 0,
            wickets: 0,
            economy: 0,
            wides: 0,
            noBalls: 0,
          };

          // Update scorecard if newly introduced
          const updatedBowlingScorecard = [...m.bowlingScorecard];
          if (!existingStat) {
            updatedBowlingScorecard.push(bowlerStat);
          }

          addNotification({
            title: `BOWLER CHANGED: ${player.name}`,
            description: `${player.name} (${bowlerStat.overs} ov, ${bowlerStat.wickets}/${bowlerStat.runsConceded}) takes the ball for over ${m.completedOvers + 1}.`,
            category: 'MATCH_STATE',
            severity: 'INFO',
          });

          return {
            ...m,
            currentBowler: bowlerStat,
            bowlingScorecard: updatedBowlingScorecard,
            isBowlerSelectPending: false,
          };
        })
      );
      setIsBowlerModalOpen(false);
    },
    [selectedMatchId, addNotification]
  );

  // Ball Simulator Engine
  const simulateBall = useCallback(
    (action: BallActionType) => {
      setMatches((prevMatches) => {
        return prevMatches.map((m) => {
          if (m.id !== selectedMatchId) return m;

          // Stop if match is already completed
          if (m.status === 'COMPLETED') {
            return m;
          }

          let runsToAdd = 0;
          let isLegalBall = true;
          let isBoundary = false;
          let isSix = false;
          let isWicket = false;
          let commentaryText = '';
          let impactRating: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';

          const striker = { ...m.currentBatsmen[0] };
          const nonStriker = { ...m.currentBatsmen[1] };
          const bowler = { ...m.currentBowler };
          const extras = { ...m.extras };

          // Parse ball action
          switch (action) {
            case 'dot':
              runsToAdd = 0;
              commentaryText = `${bowler.name} beats ${striker.name} with extra bounce outside off. Dot ball!`;
              break;
            case '1':
              runsToAdd = 1;
              commentaryText = `${striker.name} dabs it softly into the covers and scampers across for a single.`;
              break;
            case '2':
              runsToAdd = 2;
              commentaryText = `Clipped off the pads into deep mid-wicket. Good running converts one into two.`;
              break;
            case '3':
              runsToAdd = 3;
              commentaryText = `Driven through extra cover! Great diving effort in the deep saves a run; three taken.`;
              break;
            case '4':
              runsToAdd = 4;
              isBoundary = true;
              impactRating = 'HIGH';
              commentaryText = `FOUR! Glorious stroke by ${striker.name}! Pierces backward point with precision!`;
              break;
            case '6':
              runsToAdd = 6;
              isSix = true;
              impactRating = 'HIGH';
              commentaryText = `SIX! MASSIVE! ${striker.name} clears the front leg and sends it sailing over long-on!`;
              break;
            case 'wicket':
              isWicket = true;
              impactRating = 'HIGH';
              commentaryText = `OUT! WICKET! ${striker.name} miscues high into the sky! Caught cleanly by Maxwell! Big breakthrough for ${m.bowlingTeamId}!`;
              break;
            case 'wide':
              runsToAdd = 1;
              isLegalBall = false;
              extras.wides += 1;
              extras.total += 1;
              bowler.wides = (bowler.wides || 0) + 1;
              commentaryText = `Wide ball! ${bowler.name} spills it too far down the leg side. Extra run conceded. Over does not advance.`;
              break;
            case 'noball':
              runsToAdd = 1;
              isLegalBall = false;
              extras.noBalls += 1;
              extras.total += 1;
              bowler.noBalls = (bowler.noBalls || 0) + 1;
              commentaryText = `NO BALL! Overstepping by ${bowler.name}! Free hit coming up next delivery! Over does not advance.`;
              break;
          }

          // Compute ball numbers
          const currentOverNum = m.completedOvers;
          const nextBallNum = isLegalBall ? m.ballsInCurrentOver + 1 : m.ballsInCurrentOver;
          const ballText = isLegalBall
            ? `${currentOverNum}.${nextBallNum}`
            : `${currentOverNum}.${m.ballsInCurrentOver} (${action === 'wide' ? 'Wd' : 'Nb'})`;

          // Update Score
          const newRuns = m.runs + runsToAdd;
          let newWickets = m.wickets;
          const updatedFallOfWickets = [...m.fallOfWickets];

          // Update Batsman Stats
          if (isLegalBall && !isWicket) {
            striker.runs += runsToAdd;
            striker.balls += 1;
            if (isBoundary) striker.fours += 1;
            if (isSix) striker.sixes += 1;
            striker.strikeRate = Math.round((striker.runs / striker.balls) * 1000) / 10;
          } else if (isWicket) {
            striker.balls += 1;
            striker.isOut = true;
            striker.dismissal = `c Maxwell b ${bowler.name}`;
            newWickets += 1;
            updatedFallOfWickets.push({
              wicketNumber: newWickets,
              score: newRuns,
              playerOutName: striker.name,
              overText: ballText,
            });
          }

          // Update Bowler Stats
          bowler.runsConceded += runsToAdd;
          if (isLegalBall) {
            bowler.ballsThisOver += 1;
          }
          if (isWicket) {
            bowler.wickets += 1;
          }

          // Handle next batsman if wicket fell
          let updatedStriker = striker;
          if (isWicket) {
            const battingTeam = m.battingTeamId === m.teamA.id ? m.teamA : m.teamB;
            const alreadyBatted = m.battingScorecard.map((b) => b.playerId);
            const nextPlayer = battingTeam.players.find(
              (p) => !alreadyBatted.includes(p.id) && p.id !== nonStriker.playerId
            );

            const nextName = nextPlayer ? nextPlayer.name : `Batsman ${newWickets + 2}`;
            const nextId = nextPlayer ? nextPlayer.id : `bat_${Date.now()}`;

            updatedStriker = {
              playerId: nextId,
              name: nextName,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0,
              isOut: false,
              isOnStrike: true,
            };
          }

          // STRIKE ROTATION LOGIC:
          // In cricket:
          // Odd runs (1, 3): striker and non-striker swap!
          // Even runs (0, 2, 4, 6): striker remains on strike!
          let nextBatsmen: [BatsmanStats, BatsmanStats] = [updatedStriker, nonStriker];
          if (isLegalBall && !isWicket) {
            if (runsToAdd === 1 || runsToAdd === 3) {
              nextBatsmen = [nonStriker, updatedStriker];
            }
          }

          // Over progression & Bowler rotation
          let newCompletedOvers = m.completedOvers;
          let newBallsInCurrentOver = m.ballsInCurrentOver;
          let activeBowler = bowler;
          let newLastBowlerId = m.lastBowlerId;
          let triggerBowlerModal = false;

          // Check if over completed (EXACTLY 6 legal deliveries)
          const isOverFinished = isLegalBall && nextBallNum === 6;

          if (isOverFinished) {
            newCompletedOvers += 1;
            newBallsInCurrentOver = 0;
            bowler.overs += 1;
            bowler.ballsThisOver = 0;

            // Check Maiden over: was this over zero runs conceded?
            // (We check balls bowled in this over from oversSummary or ball count)

            // CRICKET RULE: Strike rotates at the end of every completed over!
            nextBatsmen = [nextBatsmen[1], nextBatsmen[0]];

            // Bowler who finished this over becomes lastBowlerId (CANNOT bowl consecutive overs)
            newLastBowlerId = bowler.playerId;

            // Check if match is not finished yet before changing bowler
            const targetScore = m.target || 182;
            const willMatchFinish = newRuns >= targetScore || newWickets >= 10 || newCompletedOvers >= m.totalOvers;

            if (!willMatchFinish) {
              // Prepare mock match state to check eligible bowlers
              const tempMatchForEligibility: Match = {
                ...m,
                lastBowlerId: newLastBowlerId,
                completedOvers: newCompletedOvers,
                bowlingScorecard: m.bowlingScorecard.map((bw) =>
                  bw.playerId === bowler.playerId ? bowler : bw
                ),
              };

              const eligibleList = getEligibleBowlers(tempMatchForEligibility).filter((b) => b.eligible);

              if (eligibleList.length > 0) {
                if (m.autoBowlerChange) {
                  // Automatically rotate to the next eligible bowler
                  const nextEligible = eligibleList[0];
                  activeBowler = nextEligible.stats;
                  addNotification({
                    title: `OVER ${newCompletedOvers} COMPLETE: BOWLER ROTATED`,
                    description: `${bowler.name} finished over. ${activeBowler.name} automatically takes the ball for over ${newCompletedOvers + 1} (no consecutive overs rule).`,
                    category: 'MATCH_STATE',
                    severity: 'INFO',
                  });
                } else {
                  // Prompt user to select bowler
                  triggerBowlerModal = true;
                  addNotification({
                    title: `OVER ${newCompletedOvers} COMPLETE: SELECT BOWLER`,
                    description: `${bowler.name} finished spell over. Select next bowler for over ${newCompletedOvers + 1}.`,
                    category: 'MATCH_STATE',
                    severity: 'IMPORTANT',
                  });
                }
              }
            }
          } else if (isLegalBall) {
            newBallsInCurrentOver = nextBallNum;
          }

          // Update Bowler Economy
          const totalBowlerBalls = activeBowler.overs * 6 + activeBowler.ballsThisOver;
          activeBowler.economy =
            totalBowlerBalls > 0
              ? Math.round((activeBowler.runsConceded / (totalBowlerBalls / 6)) * 100) / 100
              : activeBowler.economy;

          // Updated Batting Scorecard
          const updatedBattingScorecard = [...m.battingScorecard];
          const strikerIdx = updatedBattingScorecard.findIndex((b) => b.playerId === striker.playerId);
          if (strikerIdx >= 0) {
            updatedBattingScorecard[strikerIdx] = striker;
          } else {
            updatedBattingScorecard.push(striker);
          }
          if (isWicket && !updatedBattingScorecard.some((b) => b.playerId === updatedStriker.playerId)) {
            updatedBattingScorecard.push(updatedStriker);
          }

          // Updated Bowling Scorecard
          const updatedBowlingScorecard = [...m.bowlingScorecard];
          // Ensure bowler who bowled the ball is updated
          const bowledBowlerIdx = updatedBowlingScorecard.findIndex((bw) => bw.playerId === bowler.playerId);
          if (bowledBowlerIdx >= 0) {
            updatedBowlingScorecard[bowledBowlerIdx] = bowler;
          } else {
            updatedBowlingScorecard.push(bowler);
          }
          // Also ensure activeBowler (if rotated) is in scorecard
          if (activeBowler.playerId !== bowler.playerId) {
            const nextIdx = updatedBowlingScorecard.findIndex((bw) => bw.playerId === activeBowler.playerId);
            if (nextIdx >= 0) {
              updatedBowlingScorecard[nextIdx] = activeBowler;
            } else {
              updatedBowlingScorecard.push(activeBowler);
            }
          }

          // Partnership update
          const newPartnership: Partnership = isWicket
            ? {
                batsman1Id: updatedStriker.playerId,
                batsman1Runs: 0,
                batsman1Balls: 0,
                batsman2Id: nonStriker.playerId,
                batsman2Runs: nonStriker.runs,
                batsman2Balls: nonStriker.balls,
                totalRuns: 0,
                totalBalls: 0,
              }
            : {
                ...m.currentPartnership,
                totalRuns: m.currentPartnership.totalRuns + runsToAdd,
                totalBalls: m.currentPartnership.totalBalls + (isLegalBall ? 1 : 0),
              };

          // Create Ball Event record
          const ballRecord: BallEvent = {
            id: `ball_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            over: currentOverNum,
            ballNumber: nextBallNum,
            ballText,
            runs: runsToAdd,
            isBoundary,
            isSix,
            isWicket,
            isExtra: !isLegalBall,
            extraType: action === 'wide' ? 'wide' : action === 'noball' ? 'noball' : undefined,
            batsmanName: striker.name,
            bowlerName: bowler.name,
            commentary: commentaryText,
            scoreAfterBall: `${newRuns}/${newWickets}`,
            momentumScore: m.momentumIndex,
            timestamp: 'Just now',
            impactRating,
          };

          const newRecentBalls = [ballRecord, ...m.recentBalls.slice(0, 9)];
          const newBallHistory = [ballRecord, ...m.ballHistory];

          // Overs summary
          let updatedOversSummary = [...m.oversSummary];
          const activeOverIdx = updatedOversSummary.findIndex((o) => o.overNumber === currentOverNum + 1);
          const ballSymbol = isWicket ? 'W' : isSix ? '6' : isBoundary ? '4' : !isLegalBall ? (action === 'wide' ? 'Wd' : 'Nb') : runsToAdd.toString();

          if (activeOverIdx >= 0) {
            const currentO = updatedOversSummary[activeOverIdx];
            updatedOversSummary[activeOverIdx] = {
              ...currentO,
              runs: currentO.runs + runsToAdd,
              wickets: currentO.wickets + (isWicket ? 1 : 0),
              balls: [...currentO.balls, ballSymbol],
            };
          } else {
            updatedOversSummary.push({
              overNumber: currentOverNum + 1,
              runs: runsToAdd,
              wickets: isWicket ? 1 : 0,
              bowlerName: bowler.name,
              balls: [ballSymbol],
            });
          }

          // Build candidate match
          let candidateMatch: Match = {
            ...m,
            runs: newRuns,
            wickets: newWickets,
            completedOvers: newCompletedOvers,
            ballsInCurrentOver: newBallsInCurrentOver,
            extras,
            fallOfWickets: updatedFallOfWickets,
            currentBatsmen: nextBatsmen,
            currentBowler: activeBowler,
            lastBowlerId: newLastBowlerId,
            isBowlerSelectPending: triggerBowlerModal,
            currentPartnership: newPartnership,
            battingScorecard: updatedBattingScorecard,
            bowlingScorecard: updatedBowlingScorecard,
            recentBalls: newRecentBalls,
            ballHistory: newBallHistory,
            oversSummary: updatedOversSummary,
          };

          // Recompute momentum
          const newMomentum = calculateMatchMomentum(candidateMatch);
          candidateMatch.momentumIndex = newMomentum;
          candidateMatch.momentumTrend =
            newMomentum > 65 ? 'SURGING' : newMomentum < 45 ? 'COLLAPSING' : 'STEADY';

          // Check Complete Match Finish Conditions:
          // 1. Chasing team passes target
          // 2. Batting team loses 10 wickets (all out)
          // 3. Maximum total overs completed
          const targetRuns = m.target || 182;
          const totalBallsRemaining = Math.max(0, m.totalOvers * 6 - (newCompletedOvers * 6 + newBallsInCurrentOver));
          const isTargetReached = newRuns >= targetRuns;
          const isAllOut = newWickets >= 10;
          const isOversExhausted = totalBallsRemaining === 0;

          if (isTargetReached || isAllOut || isOversExhausted) {
            candidateMatch.status = 'COMPLETED';
            setIsAutoPlay(false);

            // Compute Final Result & Scorecards
            const result = computeMatchResult(candidateMatch);
            candidateMatch.result = result;
            candidateMatch.statusText = result.resultSummary;
            candidateMatch.secondInningsScorecard = constructSecondInningsScorecard(candidateMatch);

            addNotification({
              title: 'MATCH COMPLETED - FINAL RESULT',
              description: result.resultSummary,
              category: 'MATCH_STATE',
              severity: 'CRITICAL',
            });
          } else {
            const runsNeeded = Math.max(0, targetRuns - newRuns);
            candidateMatch.statusText = `${m.battingTeamId} need ${runsNeeded} runs in ${totalBallsRemaining} balls`;
          }

          // Trigger Smart Fan Alerts
          if (isWicket) {
            addNotification({
              title: `WICKET! ${striker.name} DEPARTS!`,
              description: `${bowler.name} strikes for ${m.bowlingTeamId}! Win momentum shifts to ${newMomentum}%.`,
              category: 'WICKET',
              severity: 'CRITICAL',
            });
          } else if (isSix) {
            addNotification({
              title: `MAXIMUM! 6 BY ${striker.name}!`,
              description: `Huge six into the stands! Momentum jumps to ${newMomentum}%.`,
              category: 'BOUNDARY',
              severity: 'IMPORTANT',
            });
          } else if (isBoundary) {
            addNotification({
              title: `CRISP FOUR! ${striker.name}`,
              description: `Boundary scored! Run rate pressure eased.`,
              category: 'BOUNDARY',
              severity: 'INFO',
            });
          }

          if (triggerBowlerModal) {
            setIsBowlerModalOpen(true);
          }

          return candidateMatch;
        });
      });
    },
    [selectedMatchId, addNotification]
  );

  // Auto play simulator effect
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      if (selectedMatch.status === 'COMPLETED' || selectedMatch.isBowlerSelectPending) {
        setIsAutoPlay(false);
        return;
      }

      const rand = Math.random();
      if (rand < 0.35) {
        simulateBall('1');
      } else if (rand < 0.55) {
        simulateBall('dot');
      } else if (rand < 0.70) {
        simulateBall('2');
      } else if (rand < 0.85) {
        simulateBall('4');
      } else if (rand < 0.94) {
        simulateBall('6');
      } else {
        simulateBall('wicket');
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlay, simulateBall, selectedMatch.status, selectedMatch.isBowlerSelectPending]);

  const toggleAutoPlay = useCallback(() => {
    if (selectedMatch.status === 'COMPLETED') {
      alert('Match is already completed. Reset match to replay simulation.');
      return;
    }
    setIsAutoPlay((prev) => !prev);
  }, [selectedMatch.status]);

  const resetCurrentMatch = useCallback(() => {
    setMatches((prev) => {
      return prev.map((m) => {
        if (m.id === 'match_ind_aus_2024') {
          return JSON.parse(JSON.stringify(INITIAL_MATCH_IND_AUS));
        }
        return m;
      });
    });
    setIsAutoPlay(false);
    setIsBowlerModalOpen(false);
    setIsFinalScorecardOpen(false);
    addNotification({
      title: 'MATCH RESET TO DEFAULT',
      description: 'Demo match re-initialized to Over 15.2 (142/3, 40 needed off 28 balls).',
      category: 'MATCH_STATE',
      severity: 'INFO',
    });
  }, [addNotification]);

  // Fantasy XI modifiers
  const togglePlayerInFantasy = useCallback((playerId: string) => {
    setFantasyTeam((prev) => {
      const exists = prev.selectedPlayerIds.includes(playerId);
      if (exists) {
        const nextIds = prev.selectedPlayerIds.filter((id) => id !== playerId);
        return {
          ...prev,
          selectedPlayerIds: nextIds,
          captainId: prev.captainId === playerId ? null : prev.captainId,
          viceCaptainId: prev.viceCaptainId === playerId ? null : prev.viceCaptainId,
        };
      } else {
        if (prev.selectedPlayerIds.length >= 11) {
          alert('You can only select up to 11 players for your Fantasy XI.');
          return prev;
        }
        return {
          ...prev,
          selectedPlayerIds: [...prev.selectedPlayerIds, playerId],
        };
      }
    });
  }, []);

  const setCaptain = useCallback((playerId: string) => {
    setFantasyTeam((prev) => ({
      ...prev,
      captainId: playerId,
      viceCaptainId: prev.viceCaptainId === playerId ? null : prev.viceCaptainId,
    }));
  }, []);

  const setViceCaptain = useCallback((playerId: string) => {
    setFantasyTeam((prev) => ({
      ...prev,
      viceCaptainId: playerId,
      captainId: prev.captainId === playerId ? null : prev.captainId,
    }));
  }, []);

  const loadPrebuiltFantasyXI = useCallback(() => {
    setFantasyTeam({
      id: 'user_team_1',
      name: 'Pulse XI',
      selectedPlayerIds: [...DEFAULT_FANTASY_XI],
      captainId: 'ind_sky',
      viceCaptainId: 'aus_cummins',
      totalCreditsUsed: 96.0,
      totalPoints: 462,
      playerPoints: {},
    });
    addNotification({
      title: 'BALANCED XI LOADED',
      description: 'Selected 11 marquee stars (SKY Captain, Pat Cummins Vice-Captain).',
      category: 'FANTASY',
      severity: 'INFO',
    });
  }, [addNotification]);

  const markAlertRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <CricketContext.Provider
      value={{
        matches,
        selectedMatch,
        setSelectedMatchId,
        simulateBall,
        resetCurrentMatch,
        isAutoPlay,
        toggleAutoPlay,
        selectNextBowler,
        toggleAutoBowlerChange,
        isBowlerModalOpen,
        setIsBowlerModalOpen,
        fantasyTeam,
        setFantasyTeam,
        togglePlayerInFantasy,
        setCaptain,
        setViceCaptain,
        loadPrebuiltFantasyXI,
        notifications,
        unreadNotificationCount,
        markAlertRead,
        clearAllAlerts,
        activeTab,
        setActiveTab,
        soundEnabled,
        setSoundEnabled,
        isFinalScorecardOpen,
        setIsFinalScorecardOpen,
      }}
    >
      {children}
    </CricketContext.Provider>
  );
};

export const useCricket = () => {
  const context = useContext(CricketContext);
  if (!context) {
    throw new Error('useCricket must be used within a CricketProvider');
  }
  return context;
};

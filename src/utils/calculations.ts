import { TeamStats, HeadToHeadResult } from '../types/analysis';

export function calculateTeamStrength(stats: TeamStats): number {
  const winRate = stats.won / stats.played;
  const goalsScoredPerGame = stats.goalsScored / stats.played;
  const goalsConcededPerGame = stats.goalsConceded / stats.played;
  
  return (winRate * 0.5) + (goalsScoredPerGame * 0.3) - (goalsConcededPerGame * 0.2);
}

export function calculateWinProbability(
  homeStrength: number,
  awayStrength: number
): { home: number; draw: number; away: number } {
  const totalStrength = homeStrength + awayStrength;
  const homeAdvantage = 1.2; // Home team advantage multiplier
  
  const adjustedHomeStrength = homeStrength * homeAdvantage;
  const probabilitySum = adjustedHomeStrength + awayStrength;
  
  const homeProbability = adjustedHomeStrength / probabilitySum;
  const awayProbability = awayStrength / probabilitySum;
  const drawProbability = 1 - (homeProbability + awayProbability);
  
  return {
    home: homeProbability,
    draw: drawProbability,
    away: awayProbability
  };
}

export function calculateGoalsProbability(
  homeStats: TeamStats,
  awayStats: TeamStats
): { over25: number; btts: number } {
  const homeGoalsPerGame = homeStats.goalsScored / homeStats.played;
  const awayGoalsPerGame = awayStats.goalsScored / awayStats.played;
  const homeDefenseStrength = 1 - (homeStats.goalsConceded / (homeStats.played * 3));
  const awayDefenseStrength = 1 - (awayStats.goalsConceded / (awayStats.played * 3));
  
  const expectedTotalGoals = (homeGoalsPerGame * (1 - awayDefenseStrength)) +
                            (awayGoalsPerGame * (1 - homeDefenseStrength));
  
  const over25Probability = 1 / (1 + Math.exp(-(expectedTotalGoals - 2.5)));
  
  const bttsProbability = (1 - Math.exp(-homeGoalsPerGame)) * 
                         (1 - Math.exp(-awayGoalsPerGame));
  
  return {
    over25: over25Probability,
    btts: bttsProbability
  };
}

export function calculateConfidence(params: {
  homeStrength: number;
  awayStrength: number;
  h2hResults: HeadToHeadResult[];
}): number {
  const { homeStrength, awayStrength, h2hResults } = params;
  
  // Base confidence from team strengths
  const strengthDiff = Math.abs(homeStrength - awayStrength);
  const baseConfidence = 0.5 + (strengthDiff * 0.3);
  
  // Adjust confidence based on head-to-head history
  const h2hConfidence = h2hResults.length > 0
    ? h2hResults.reduce((acc, match) => acc + (match.predictedCorrectly ? 0.1 : -0.05), 0)
    : 0;
  
  const finalConfidence = Math.min(Math.max(baseConfidence + h2hConfidence, 0), 1);
  
  return finalConfidence;
}
import { Match } from '../types/matches';
import { MatchAnalysis } from '../types/analysis';
import apiClient, { ApiError } from './apiClient';
import { getTeamStats, getHeadToHead } from './statsService';
import { calculateProbabilities } from '../utils/calculations';

export async function analyzeMatch(match: Match): Promise<MatchAnalysis> {
  try {
    // Fetch all required data in parallel
    const [homeStats, awayStats, h2hResults] = await Promise.all([
      getTeamStats(match.homeTeam),
      getTeamStats(match.awayTeam),
      getHeadToHead(match.homeTeam, match.awayTeam)
    ]);

    // Calculate statistical probabilities
    const probabilities = calculateProbabilities({
      homeStats,
      awayStats,
      h2hResults
    });

    return {
      matchOverview: {
        match: `${match.homeTeam} vs ${match.awayTeam}`,
        competition: match.competition,
        date: match.date,
        venue: 'TBD'
      },
      predictions: probabilities.matchResult,
      goalsMarkets: probabilities.goalsMarkets,
      confidence: probabilities.confidence,
      recommendedBets: probabilities.recommendedBets
    };
  } catch (error) {
    console.error('Analysis error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to analyze match', 0, 'ANALYSIS_ERROR');
  }
}
import { apiClient } from './apiClient';
import { TeamStats, HeadToHeadResult } from '../types/analysis';
import { Cache } from '../utils/cache';

export async function getTeamStats(teamId: string): Promise<TeamStats> {
  const cacheKey = `team_stats_${teamId}`;
  const cachedStats = Cache.get<TeamStats>(cacheKey);
  
  if (cachedStats) {
    return cachedStats;
  }

  try {
    const response = await apiClient.get(`/teams/${teamId}/matches`);
    const matches = response.data.matches || [];
    
    const stats: TeamStats = {
      played: matches.length,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsScored: 0,
      goalsConceded: 0,
      cleanSheets: 0
    };
    
    matches.forEach(match => {
      const isHome = match.homeTeam.id.toString() === teamId;
      const goals = isHome ? match.score.fullTime.home : match.score.fullTime.away;
      const conceded = isHome ? match.score.fullTime.away : match.score.fullTime.home;
      
      if (goals > conceded) stats.won++;
      else if (goals === conceded) stats.drawn++;
      else stats.lost++;
      
      stats.goalsScored += goals;
      stats.goalsConceded += conceded;
      if (conceded === 0) stats.cleanSheets++;
    });
    
    Cache.set(cacheKey, stats);
    return stats;
  } catch (error) {
    console.error('Error fetching team stats:', error);
    throw new Error('Failed to fetch team statistics');
  }
}

export async function getHeadToHead(team1Id: string, team2Id: string): Promise<HeadToHeadResult[]> {
  const cacheKey = `h2h_${team1Id}_${team2Id}`;
  const cachedResults = Cache.get<HeadToHeadResult[]>(cacheKey);
  
  if (cachedResults) {
    return cachedResults;
  }

  try {
    const response = await apiClient.get(`/teams/${team1Id}/matches`, {
      params: { limit: 10 }
    });
    
    const h2hResults = response.data.matches
      .filter((match: any) => 
        (match.homeTeam.id.toString() === team2Id || match.awayTeam.id.toString() === team2Id) &&
        match.status === 'FINISHED'
      )
      .map((match: any) => ({
        date: new Date(match.utcDate),
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        homeGoals: match.score.fullTime.home,
        awayGoals: match.score.fullTime.away,
        predictedCorrectly: true // This would be updated with actual prediction data
      }));

    Cache.set(cacheKey, h2hResults);
    return h2hResults;
  } catch (error) {
    console.error('Error fetching head to head:', error);
    throw new Error('Failed to fetch head to head statistics');
  }
}
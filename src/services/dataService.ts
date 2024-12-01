import { format } from 'date-fns';
import { Match, HistoricalData } from '../types/prediction';
import { apiClient } from './apiClient';
import { API_CONFIG } from '../config/api';
import { Cache } from '../utils/cache';

export async function fetchUpcomingMatches(): Promise<Match[]> {
  const cacheKey = 'upcoming_matches';
  const cachedData = Cache.get<Match[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const response = await apiClient.get('/matches', {
      params: {
        dateFrom: today,
        status: 'SCHEDULED',
        competitions: API_CONFIG.SUPPORTED_COMPETITIONS.map(comp => comp.id).join(','),
      }
    });

    if (!response.data.matches) {
      throw new Error('Invalid API response: missing matches array');
    }

    const matches = response.data.matches
      .filter((match: any) => match.homeTeam?.name && match.awayTeam?.name)
      .map((match: any) => ({
        id: match.id.toString(),
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        date: new Date(match.utcDate),
        competition: match.competition.name,
        venue: match.venue,
      }));

    Cache.set(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    throw new Error('Failed to fetch upcoming matches. Please try again later.');
  }
}

export async function fetchHistoricalData(startDate: Date, endDate: Date): Promise<HistoricalData[]> {
  const cacheKey = `historical_${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
  const cachedData = Cache.get<HistoricalData[]>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await apiClient.get('/matches', {
      params: {
        dateFrom: format(startDate, 'yyyy-MM-dd'),
        dateTo: format(endDate, 'yyyy-MM-dd'),
        status: 'FINISHED',
        competitions: API_CONFIG.SUPPORTED_COMPETITIONS.map(comp => comp.id).join(','),
      }
    });

    if (!response.data.matches) {
      throw new Error('Invalid API response: missing matches array');
    }

    const historicalData: HistoricalData[] = response.data.matches
      .filter((match: any) => 
        match.homeTeam?.name && 
        match.awayTeam?.name && 
        match.score?.fullTime?.home !== null && 
        match.score?.fullTime?.away !== null
      )
      .map((match: any) => ({
        match: {
          id: match.id.toString(),
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          date: new Date(match.utcDate),
          competition: match.competition.name,
          venue: match.venue,
        },
        result: {
          homeGoals: match.score.fullTime.home,
          awayGoals: match.score.fullTime.away,
          winner: match.score.fullTime.home > match.score.fullTime.away ? 'home' :
                 match.score.fullTime.home < match.score.fullTime.away ? 'away' : 'draw',
        },
        stats: {
          possession: [50, 50], // Default values as the API doesn't provide these
          shots: [0, 0],
          shotsOnTarget: [0, 0],
          corners: [0, 0],
        },
      }));

    Cache.set(cacheKey, historicalData);
    return historicalData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw new Error('Failed to fetch historical match data. Please try again later.');
  }
}
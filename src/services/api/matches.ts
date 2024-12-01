import { format } from 'date-fns';
import { Match } from '../../types/matches';
import apiClient, { ApiError } from './client';
import { API_CONFIG } from '../../config/api';
import { Cache } from '../../utils/cache';

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

    if (!response.data?.matches) {
      throw new ApiError('Invalid API response: missing matches array', 0, 'INVALID_RESPONSE');
    }

    const matches = response.data.matches
      .filter((match: any) => match.homeTeam?.name && match.awayTeam?.name)
      .map((match: any) => ({
        id: match.id.toString(),
        competition: match.competition.name,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        date: new Date(match.utcDate),
        status: match.status,
        score: match.score,
      }));

    Cache.set(cacheKey, matches);
    return matches;
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Failed to fetch upcoming matches. Please try again later.',
      0,
      'FETCH_ERROR'
    );
  }
}

export async function fetchMatchDetails(matchId: string): Promise<Match | null> {
  const cacheKey = `match_${matchId}`;
  const cachedData = Cache.get<Match>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await apiClient.get(`/matches/${matchId}`);
    
    if (!response.data) {
      throw new ApiError('Match not found', 404, 'NOT_FOUND');
    }

    const match = {
      id: response.data.id.toString(),
      competition: response.data.competition.name,
      homeTeam: response.data.homeTeam.name,
      awayTeam: response.data.awayTeam.name,
      date: new Date(response.data.utcDate),
      status: response.data.status,
      score: response.data.score,
    };

    Cache.set(cacheKey, match);
    return match;
  } catch (error) {
    console.error('Error fetching match details:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Failed to fetch match details. Please try again later.',
      0,
      'FETCH_ERROR'
    );
  }
}
import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { LeagueStandings, StandingsResponse } from '../types/standings';
import { Cache } from '../utils/cache';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'X-Auth-Token': API_CONFIG.API_KEY,
  },
});

export async function fetchLeagueStandings(competitionId: string): Promise<StandingsResponse> {
  const cacheKey = `standings_${competitionId}`;
  const cachedData = Cache.get<LeagueStandings>(cacheKey);
  
  if (cachedData) {
    return { standings: cachedData };
  }

  try {
    const response = await api.get<LeagueStandings>(`/competitions/${competitionId}/standings`);
    
    if (!response.data || !response.data.standings) {
      throw new Error('Invalid API response format');
    }

    Cache.set(cacheKey, response.data);
    return { standings: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        return { error: 'API rate limit exceeded. Please try again later.' };
      }
      if (error.response?.status === 403) {
        return { error: 'API authentication failed. Please check API key.' };
      }
    }
    return { error: 'Failed to fetch standings data.' };
  }
}
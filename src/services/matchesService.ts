import { apiClient } from './apiClient';
import { Cache } from '../utils/cache';
import { Match, MatchResponse } from '../types/matches';
import { format } from 'date-fns';
import { API_CONFIG } from '../config/api';

export async function fetchCompetitionMatches(competitionId: string): Promise<MatchResponse> {
  const cacheKey = `competition_${competitionId}`;
  const cachedData = Cache.get<MatchResponse>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await apiClient.get<MatchResponse>(`/competitions/${competitionId}/matches`);
    
    if (!response.data.matches) {
      throw new Error('Invalid API response: missing matches array');
    }
    
    Cache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching competition matches:', error);
    throw error;
  }
}

export async function fetchMatches(dateFrom?: Date, dateTo?: Date): Promise<Match[]> {
  const params: Record<string, string> = {
    competitions: API_CONFIG.SUPPORTED_COMPETITIONS.map(comp => comp.id).join(','),
  };
  
  if (dateFrom) params.dateFrom = format(dateFrom, 'yyyy-MM-dd');
  if (dateTo) params.dateTo = format(dateTo, 'yyyy-MM-dd');

  const cacheKey = `matches_${params.dateFrom || ''}_${params.dateTo || ''}`;
  const cachedData = Cache.get<Match[]>(cacheKey);

  if (cachedData) return cachedData;

  try {
    const response = await apiClient.get<MatchResponse>('/matches', { params });
    
    if (!response.data.matches) {
      throw new Error('Invalid API response: missing matches array');
    }

    const matches = response.data.matches
      .filter(match => match.homeTeam?.name && match.awayTeam?.name)
      .map(match => ({
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
    console.error('Error fetching matches:', error);
    throw error;
  }
}
import { apiClient } from './apiClient';
import { Match, MatchResponse } from '../types/matches';
import { format, addDays } from 'date-fns';
import { API_CONFIG } from '../config/api';

interface PythonProcessedData {
  matches: Match[];
  predictions: {
    homeWin: number;
    awayWin: number;
    draw: number;
    btts: number;
    over25: number;
  }[];
}

export async function fetchAndProcessMatches(dateFrom: Date, dateTo: Date): Promise<PythonProcessedData> {
  try {
    const params = {
      dateFrom: format(dateFrom, 'yyyy-MM-dd'),
      dateTo: format(dateTo, 'yyyy-MM-dd'),
      competitions: API_CONFIG.SUPPORTED_COMPETITIONS.map(comp => comp.id).join(','),
    };

    const response = await apiClient.get<MatchResponse>('/matches', { params });
    
    if (!response.data.matches) {
      throw new Error('No match data available');
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

    // Generate predictions using a simple model
    const predictions = matches.map(() => {
      const total = Math.random() * 2 + 1; // Between 1 and 3
      const homeWin = Math.random() / total;
      const awayWin = Math.random() / total;
      const draw = 1 - (homeWin + awayWin);

      return {
        homeWin,
        awayWin,
        draw,
        btts: Math.random(),
        over25: Math.random(),
      };
    });

    return { matches, predictions };
  } catch (error) {
    console.error('Error fetching and processing matches:', error);
    throw error;
  }
}
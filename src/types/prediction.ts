export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  competition: string;
  venue?: string;
}

export interface PredictionResult {
  match: Match;
  predictions: {
    homeWin: number;
    draw: number;
    awayWin: number;
    btts: number;
    over25: number;
  };
  confidence: number;
}

export interface HistoricalData {
  match: Match;
  result: {
    homeGoals: number;
    awayGoals: number;
    winner: 'home' | 'away' | 'draw';
  };
  stats: {
    possession: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
    corners: [number, number];
  };
}
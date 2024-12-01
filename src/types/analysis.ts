export interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
}

export interface HeadToHeadResult {
  date: Date;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  predictedCorrectly: boolean;
}

export interface MatchAnalysis {
  matchOverview: {
    match: string;
    competition: string;
    date: Date;
    venue: string;
  };
  predictions: {
    matchResult: {
      home: number;
      draw: number;
      away: number;
    };
    goalsMarkets: {
      over25: number;
      btts: number;
    };
  };
  confidence: number;
  recommendedBets: string[];
}
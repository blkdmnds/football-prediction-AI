export interface MatchScore {
  winner: string | null;
  duration: string;
  fullTime: {
    home: number | null;
    away: number | null;
  };
  halfTime: {
    home: number | null;
    away: number | null;
  };
}

export interface Match {
  id: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  status: string;
  score: MatchScore;
}

export interface ApiMatch {
  id: number;
  competition: {
    id: number;
    name: string;
  };
  utcDate: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
  };
  awayTeam: {
    id: number;
    name: string;
  };
  score: MatchScore;
}

export interface MatchResponse {
  matches: ApiMatch[];
  resultSet?: {
    count: number;
    competitions: string[];
    first: string;
    last: string;
  };
}
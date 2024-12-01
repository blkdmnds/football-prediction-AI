export interface ApiMatch {
  id: number;
  competition: {
    id: number;
    name: string;
    code: string;
  };
  utcDate: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface ApiResponse {
  matches: ApiMatch[];
  resultSet?: {
    count: number;
    competitions: string[];
    first: string;
    last: string;
  };
}
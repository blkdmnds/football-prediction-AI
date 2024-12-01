export const API_CONFIG = {
  BASE_URL: 'https://api.football-data.org/v4',
  API_KEY: 'YOUR_API_KEY',
  SUPPORTED_COMPETITIONS: [
    { id: 'PL', name: 'Premier League' },
    { id: 'PD', name: 'La Liga' },
    { id: 'BL1', name: 'Bundesliga' },
    { id: 'SA', name: 'Serie A' },
    { id: 'FL1', name: 'Ligue 1' },
    { id: 'CL', name: 'Champions League' }
  ],
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
};

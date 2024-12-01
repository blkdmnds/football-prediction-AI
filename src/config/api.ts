export const API_CONFIG = {
  BASE_URL: 'https://api.football-data.org/v4',
  API_KEY: '30a73678de154817a67607401b947eff',
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
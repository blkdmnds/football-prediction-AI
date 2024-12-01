import axios from 'axios';
import { API_CONFIG } from '../../config/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'X-Auth-Token': API_CONFIG.API_KEY
  },
  timeout: 15000
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 429:
          throw new ApiError('API rate limit exceeded. Please try again later.', status, 'RATE_LIMIT');
        case 403:
          throw new ApiError('API authentication failed. Please check API key.', status, 'AUTH_FAILED');
        case 404:
          throw new ApiError('The requested resource was not found.', status, 'NOT_FOUND');
        default:
          throw new ApiError(
            data?.message || 'An unexpected error occurred',
            status,
            'API_ERROR'
          );
      }
    }
    
    throw new ApiError(
      'Network error. Please check your connection.',
      0,
      'NETWORK_ERROR'
    );
  }
);

export default apiClient;
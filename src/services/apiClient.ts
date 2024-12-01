import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';

// Custom error class for API errors
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

// Create and configure the API client
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'X-Auth-Token': API_CONFIG.API_KEY,
  },
  timeout: 15000,
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 429:
          throw new ApiError('API rate limit exceeded. Please try again in a few minutes.', status, 'RATE_LIMIT');
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
    
    if (error.request) {
      throw new ApiError(
        'Network error. Please check your connection.',
        0,
        'NETWORK_ERROR'
      );
    }
    
    throw new ApiError('An unexpected error occurred', 0, 'UNKNOWN_ERROR');
  }
);

export default apiClient;
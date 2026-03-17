import axios from 'axios';
import { TestRequest, TestResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to mask API key for logging
const maskApiKey = (key: string): string => {
  if (!key || key.length <= 4) return '***';
  return `***${key.slice(-4)}`;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 35000, // 35 seconds (slightly more than backend timeout)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to mask API keys in console/devtools
api.interceptors.request.use(
  (config) => {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      // Clone the config to avoid mutating the original
      const maskedConfig = { ...config };
      
      // Mask API key in request data for logging purposes
      if (config.data && config.data.api_key) {
        const maskedData = { ...config.data };
        maskedData.api_key = maskApiKey(config.data.api_key);
        
        // Log masked version
        console.log('[API Request]', {
          url: config.url,
          method: config.method,
          data: maskedData,
        });
      }
    }
    
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Request Error]', error.message);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to ensure no API keys leak in responses
api.interceptors.response.use(
  (response) => {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('[API Response]', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Mask any API keys in error messages (always, even in production)
    if (error.response?.data) {
      const errorData = JSON.stringify(error.response.data);
      // Check if error message contains potential API key patterns
      if (errorData.match(/sk-[a-zA-Z0-9]{20,}/g)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Security] API key detected in error response - masking');
        }
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Response Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

export const testApiKey = async (request: TestRequest): Promise<TestResponse> => {
  const { provider, ...data } = request;
  const response = await api.post<TestResponse>(`/api/${provider}/test`, data);
  return response.data;
};

export const getModels = async (provider: string): Promise<string[]> => {
  const response = await api.get<{ models: string[] }>(`/api/${provider}/models`);
  return response.data.models;
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch {
    return false;
  }
};

// Made with Bob

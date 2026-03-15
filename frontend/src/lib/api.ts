import axios from 'axios';
import { TestRequest, TestResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 35000, // 35 seconds (slightly more than backend timeout)
  headers: {
    'Content-Type': 'application/json',
  },
});

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

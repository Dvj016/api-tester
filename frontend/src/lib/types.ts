export type Provider = 'openai' | 'anthropic' | 'gemini' | 'nvidia' | 'cohere' | 'mistral' | 'huggingface' | 'replicate' | 'together' | 'perplexity' | 'groq' | 'fireworks' | 'ai21';

export interface TestRequest {
  api_key: string;
  model: string;
  provider: Provider;
}

export interface TestResponse {
  valid: boolean;
  provider: string;
  model: string;
  latency_ms?: number;
  message: string;
  error?: string;
  response_preview?: string;
  timestamp: string;
}

export interface ProviderConfig {
  name: string;
  value: Provider;
  description: string;
  icon: string;
}

export interface ModelOption {
  value: string;
  label: string;
}

// Made with Bob

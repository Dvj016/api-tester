/**
 * AI API Key Tester - Main Application Page
 * Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
 * Licensed under MIT License - See LICENSE file for details
 * Repository: https://github.com/Dvj016/api-tester
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Moon, Sun } from 'lucide-react';
import { testApiKey, getModels } from '@/lib/api';
import { Provider, TestResponse, ProviderConfig } from '@/lib/types';
import LoadingAnimation from '@/components/LoadingAnimation';
import ResultCard from '@/components/ResultCard';
import VisitorCounter from '@/components/VisitorCounter';
import WakeUpModal from '@/components/WakeUpModal';
import TrustBadges from '@/components/TrustBadges';
import NewsletterSignup from '@/components/NewsletterSignup';
import AdBanner from '@/components/AdBanner';

const PROVIDERS: ProviderConfig[] = [
  { name: 'OpenAI', value: 'openai', description: 'GPT-4, GPT-3.5', icon: '🤖' },
  { name: 'Anthropic', value: 'anthropic', description: 'Claude 3', icon: '🧠' },
  { name: 'Google Gemini', value: 'gemini', description: 'Gemini Pro', icon: '✨' },
  { name: 'NVIDIA NIM', value: 'nvidia', description: 'Llama, Mixtral', icon: '🚀' },
  { name: 'Groq', value: 'groq', description: 'Ultra-Fast AI', icon: '⚡' },
  { name: 'Fireworks AI', value: 'fireworks', description: 'Fast Inference', icon: '🔥' },
  { name: 'AI21 Labs', value: 'ai21', description: 'Jamba Models', icon: '🎯' },
  { name: 'Cohere', value: 'cohere', description: 'Command Models', icon: '🔷' },
  { name: 'Mistral AI', value: 'mistral', description: 'Mistral Models', icon: '🌊' },
  { name: 'Hugging Face', value: 'huggingface', description: 'Open Models', icon: '🤗' },
  { name: 'Replicate', value: 'replicate', description: 'Cloud AI', icon: '🔁' },
  { name: 'Together AI', value: 'together', description: 'Fast Inference', icon: '💫' },
  { name: 'Perplexity', value: 'perplexity', description: 'Search AI', icon: '🔍' },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResponse | null>(null);
  const [showWakeUpModal, setShowWakeUpModal] = useState(false);

  // Load models when provider changes
  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelList = await getModels(selectedProvider);
        setModels(modelList);
        setSelectedModel(modelList[0] || '');
      } catch (error) {
        console.error('Failed to load models:', error);
        // Fallback to default models if backend is not available
        const defaultModels = getDefaultModels(selectedProvider);
        setModels(defaultModels);
        setSelectedModel(defaultModels[0] || '');
      }
    };
    loadModels();
  }, [selectedProvider]);

  // Default models for each provider (fallback when backend is unavailable)
  const getDefaultModels = (provider: Provider): string[] => {
    const defaults: Record<Provider, string[]> = {
      openai: ['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo'],
      anthropic: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
      gemini: ['gemini-pro', 'gemini-pro-vision'],
      nvidia: ['meta/llama2-70b', 'mistralai/mixtral-8x7b-instruct-v0.1'],
      groq: ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'],
      fireworks: ['accounts/fireworks/models/llama-v3p1-70b-instruct', 'accounts/fireworks/models/mixtral-8x7b-instruct'],
      ai21: ['jamba-1.5-large', 'jamba-1.5-mini', 'jamba-instruct'],
      cohere: ['command', 'command-light', 'command-nightly'],
      mistral: ['mistral-tiny', 'mistral-small', 'mistral-medium'],
      huggingface: ['gpt2', 'facebook/opt-350m', 'bigscience/bloom-560m'],
      replicate: ['meta/llama-2-70b-chat', 'stability-ai/sdxl'],
      together: ['togethercomputer/llama-2-70b-chat', 'mistralai/Mixtral-8x7B-Instruct-v0.1'],
      perplexity: ['pplx-7b-chat', 'pplx-70b-chat', 'pplx-7b-online']
    };
    return defaults[provider] || ['default-model'];
  };

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleTest = async () => {
    if (!apiKey.trim() || !selectedModel) {
      alert('Please enter an API key and select a model');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await testApiKey({
        api_key: apiKey,
        model: selectedModel,
        provider: selectedProvider,
      });
      setResult(response);
      setShowWakeUpModal(false); // Hide modal on success
    } catch (error: any) {
      // Check if it's a timeout or connection error (backend sleeping)
      const isServerSleeping =
        error.code === 'ECONNABORTED' ||
        error.message?.includes('timeout') ||
        error.message?.includes('Network Error') ||
        !error.response;
      
      if (isServerSleeping) {
        // Show wake-up modal
        setShowWakeUpModal(true);
        
        // Retry after 45 seconds
        setTimeout(async () => {
          try {
            const response = await testApiKey({
              api_key: apiKey,
              model: selectedModel,
              provider: selectedProvider,
            });
            setResult(response);
            setShowWakeUpModal(false);
          } catch (retryError: any) {
            setShowWakeUpModal(false);
            handleError(retryError);
          }
        }, 45000); // 45 seconds
        
        return; // Don't show error immediately
      }
      
      handleError(error);
    } finally {
      if (!showWakeUpModal) {
        setLoading(false);
      }
    }
  };

  const handleError = (error: any) => {
    let errorMessage = 'Network error occurred';
    
    if (error.response?.data) {
      const data = error.response.data;
      // Handle FastAPI validation errors
      if (data.detail) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          // Format validation errors
          errorMessage = data.detail.map((err: any) =>
            `${err.loc?.join(' → ') || 'Field'}: ${err.msg}`
          ).join(', ');
        } else {
          errorMessage = JSON.stringify(data.detail);
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    setResult({
      valid: false,
      provider: selectedProvider,
      model: selectedModel,
      message: 'Failed to test API key',
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Wake Up Modal */}
      <WakeUpModal isVisible={showWakeUpModal} />
      
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-bold text-white">AI API Key Tester</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Test Your AI API Keys
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                  Quickly validate your API keys for 13 AI providers including OpenAI, Anthropic, Gemini, Groq, and more.
                  Get instant feedback with response time metrics.
                </p>
                
                {/* Trust Badges */}
                <TrustBadges />
              </div>

          {/* Test Form */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700">
            {/* Provider Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Select AI Provider
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {PROVIDERS.map((provider) => (
                  <button
                    key={provider.value}
                    onClick={() => setSelectedProvider(provider.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedProvider === provider.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{provider.icon}</div>
                    <div className="text-sm font-semibold text-white">{provider.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{provider.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label htmlFor="model" className="block text-sm font-semibold text-gray-300 mb-2">
                Select Model
              </label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* API Key Input */}
            <div className="mb-6">
              <label htmlFor="apiKey" className="block text-sm font-semibold text-gray-300 mb-2">
                API Key
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                🔒 Your API key is never stored and only used for testing
              </p>
            </div>

            {/* Test Button */}
            <button
              onClick={handleTest}
              disabled={loading || !apiKey.trim()}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>{loading ? 'Testing...' : 'Test API Key'}</span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 border border-gray-700">
              <LoadingAnimation />
            </div>
          )}

          {/* Result */}
          {!loading && result && (
            <div className="animate-fade-in">
              <ResultCard result={result} />
            </div>
          )}

          {/* Ad Banner - After Results */}
          {!loading && result && (
            <div className="mt-8">
              <AdBanner slot="RESULT_PAGE_AD_SLOT" format="horizontal" />
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="mt-12">
            <NewsletterSignup />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* About Section */}
            <div>
              <h3 className="text-white font-semibold mb-3">AI API Key Tester</h3>
              <p className="text-gray-400 text-sm">
                A professional developer tool for testing API keys across 13 AI providers.
                Fast, secure, and privacy-focused. Trusted by 1,000+ developers worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/disclaimer" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-white font-semibold mb-3">Get in Touch</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/feedback" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Report Issue / Send Feedback
                  </a>
                </li>
                <li>
                  <a href="/advertise" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Advertise on this website
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 pt-6">
            {/* Copyright and Creator */}
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 space-y-2 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="font-semibold text-gray-300">
                  © 2024-2026 Digvijay Singh Baghel (Dvj016) — All Rights Reserved
                </p>
                <p className="text-xs mt-1">
                  AI API Key Tester™ • Licensed under{' '}
                  <a
                    href="https://github.com/Dvj016/api-tester/blob/main/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 underline"
                  >
                    MIT License
                  </a>
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-300">
                  Created with ❤️ by{' '}
                  <a
                    href="https://github.com/Dvj016"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 font-semibold hover:text-primary-300"
                  >
                    Digvijay Singh Baghel
                  </a>
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  Unauthorized reproduction prohibited
                </p>
              </div>
            </div>

            {/* Visitor Counter */}
            <div className="flex justify-center mt-4">
              <VisitorCounter />
            </div>

            {/* Security Notice */}
            <p className="text-center text-xs text-gray-500 mt-4">
              🔒 API keys are never stored • Keys used only for temporary testing • Secure & Private
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Made with Bob

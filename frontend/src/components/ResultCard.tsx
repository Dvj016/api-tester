'use client';

import React from 'react';
import { CheckCircle, XCircle, Clock, Copy, AlertCircle } from 'lucide-react';
import { TestResponse } from '@/lib/types';

interface ResultCardProps {
  result: TestResponse;
}

export default function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-lg border-2 p-6 transition-all duration-300 ${
      result.valid 
        ? 'border-green-500 bg-green-500/10' 
        : 'border-red-500 bg-red-500/10'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {result.valid ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : (
            <XCircle className="w-8 h-8 text-red-500" />
          )}
          <div>
            <h3 className="text-xl font-bold text-white">
              {result.valid ? 'API Key Valid ✓' : 'API Key Invalid ✗'}
            </h3>
            <p className="text-sm text-gray-400 capitalize">
              {result.provider} - {result.model}
            </p>
          </div>
        </div>
        
        {result.latency_ms && (
          <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-mono text-white">
              {result.latency_ms.toFixed(0)}ms
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-300">{result.message}</p>
        </div>

        {result.error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-sm text-red-300">{result.error}</p>
          </div>
        )}

        {result.response_preview && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">
                Response Preview
              </span>
              <button
                onClick={() => copyToClipboard(result.response_preview!)}
                className="flex items-center space-x-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm text-gray-300 font-mono break-words">
              {result.response_preview}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2">
          Tested at: {new Date(result.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// Made with Bob

'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Server, Clock, CheckCircle } from 'lucide-react';

interface WakeUpModalProps {
  isVisible: boolean;
  onBackendReady?: () => void;
}

export default function WakeUpModal({ isVisible, onBackendReady }: WakeUpModalProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [checkingBackend, setCheckingBackend] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setSecondsElapsed(0);
      return;
    }

    // Start timer
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    // Start checking backend after 30 seconds
    const checkTimer = setTimeout(() => {
      setCheckingBackend(true);
      checkBackendStatus();
    }, 30000);

    return () => {
      clearInterval(timer);
      clearTimeout(checkTimer);
    };
  }, [isVisible]);

  const checkBackendStatus = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/health`);
      
      if (response.ok) {
        console.log('[Wake-Up Modal] Backend is now ready!');
        if (onBackendReady) {
          onBackendReady();
        }
      } else {
        // Check again in 5 seconds
        setTimeout(checkBackendStatus, 5000);
      }
    } catch (error) {
      // Check again in 5 seconds
      setTimeout(checkBackendStatus, 5000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-700 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-blue-500/10 p-4 rounded-full border border-blue-500/30">
              <Server className="w-12 h-12 text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white text-center mb-3">
          {checkingBackend ? 'Almost Ready!' : 'Waking Up Server'}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-center mb-6 leading-relaxed">
          {checkingBackend
            ? 'Backend is warming up, checking connection...'
            : 'Our backend service is starting up from sleep mode. This happens on the free tier after 15 minutes of inactivity.'}
        </p>

        {/* Timer */}
        <div className="bg-blue-500/10 rounded-lg p-3 mb-4 border border-blue-500/30">
          <div className="text-center">
            <span className="text-blue-400 font-mono text-lg font-bold">
              {secondsElapsed}s
            </span>
            <span className="text-gray-400 text-sm ml-2">elapsed</span>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-blue-400 font-medium">Initializing...</span>
        </div>

        {/* Time Estimate */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4">
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Estimated wait time: <span className="font-semibold text-white">40-50 seconds</span>
            </span>
          </div>
        </div>

        {/* Status Messages */}
        {secondsElapsed < 20 && (
          <p className="text-xs text-gray-400 text-center">
            ⏳ Server is waking up...
          </p>
        )}
        {secondsElapsed >= 20 && secondsElapsed < 40 && (
          <p className="text-xs text-yellow-400 text-center">
            ⚡ Almost there, loading services...
          </p>
        )}
        {secondsElapsed >= 40 && !checkingBackend && (
          <p className="text-xs text-green-400 text-center">
            ✓ Should be ready soon, checking connection...
          </p>
        )}
        {checkingBackend && (
          <p className="text-xs text-blue-400 text-center animate-pulse">
            🔄 Verifying backend connection...
          </p>
        )}

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-progress"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-progress {
          animation: progress 45s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Made with Bob

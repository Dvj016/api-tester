'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Server, X } from 'lucide-react';

interface WakeUpModalProps {
  isVisible: boolean;
  onBackendReady?: () => void;
}

export default function WakeUpModal({ isVisible, onBackendReady }: WakeUpModalProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setSecondsElapsed(0);
      setIsDismissed(false);
      return;
    }

    // Start timer
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    // Start checking backend after 30 seconds (reduced from 30s)
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

  if (!isVisible || isDismissed) return null;

  return (
    // Non-blocking notification banner at top
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-2xl max-w-md w-full p-4 border border-blue-400/30">
        <div className="flex items-center justify-between">
          {/* Left: Icon + Message */}
          <div className="flex items-center space-x-3 flex-1">
            <div className="bg-white/20 p-2 rounded-lg">
              <Server className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">
                {checkingBackend ? '🔄 Checking connection...' : '⏳ Server waking up'}
              </p>
              <p className="text-blue-100 text-xs">
                {secondsElapsed}s elapsed • Ready in ~{Math.max(0, 50 - secondsElapsed)}s
              </p>
            </div>
          </div>

          {/* Right: Loading + Close */}
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
            <button
              onClick={() => setIsDismissed(true)}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, (secondsElapsed / 50) * 100)}%` }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Made with Bob

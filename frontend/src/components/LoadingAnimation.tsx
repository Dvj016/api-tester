'use client';

import React from 'react';

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-20 h-20">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-primary-500/30 rounded-full"></div>
        
        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse-slow"></div>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 animate-pulse">Testing API key...</p>
    </div>
  );
}

// Made with Bob

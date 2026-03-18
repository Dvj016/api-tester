/**
 * Total Visit Counter - Counts EVERY Page Load
 * Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
 * 
 * BEHAVIOR: Increments on EVERY page load/refresh to track total visits
 * NO session tracking - every visit counts!
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Users, AlertCircle, RefreshCw } from 'lucide-react';

export default function VisitorCounter() {
  const [visitCount, setVisitCount] = useState<number>(1000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const incrementVisit = async (isRetry = false) => {
    if (isRetry) {
      setRetrying(true);
    }
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      console.log(`[Visit Counter] Calling API: ${apiUrl}/api/visitors/increment`);
      
      // Call API on EVERY page load - no caching
      const response = await fetch(`${apiUrl}/api/visitors/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store' // Disable Next.js caching
      });
      
      console.log(`[Visit Counter] Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[Visit Counter] Success! Total visits: ${data.total}`, data);
        setVisitCount(data.total || 1000);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error(`[Visit Counter] API returned error ${response.status}:`, errorText);
        setError(`API Error: ${response.status}`);
        setVisitCount(1000); // Fallback
      }
    } catch (err: any) {
      console.error('[Visit Counter] Network error:', err);
      console.error('[Visit Counter] Error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setError(err.message || 'Network error');
      setVisitCount(1000); // Fallback
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    // Increment on every mount (page load/refresh)
    incrementVisit();
  }, []); // Empty dependency array = runs once per page load

  const handleRetry = () => {
    setLoading(true);
    incrementVisit(true);
  };

  if (loading && !retrying) {
    return (
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
        <RefreshCw className="w-4 h-4 text-primary-400 animate-spin" />
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
      <Users className="w-4 h-4 text-primary-400" />
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-400">Total Visits:</span>
        <span className="text-white font-semibold">{visitCount.toLocaleString()}</span>
        {error && (
          <button
            onClick={handleRetry}
            className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            title={`Error: ${error}. Click to retry.`}
          >
            {retrying ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Made with Bob

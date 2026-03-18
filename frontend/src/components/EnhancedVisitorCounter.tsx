/**
 * Enhanced Visitor Counter - Shows Total Visits AND Unique Visitors
 * Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
 * 
 * This is a SEPARATE component that can replace VisitorCounter.tsx
 * Shows both metrics side by side
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Users, Eye, AlertCircle, RefreshCw } from 'lucide-react';

interface VisitorStats {
  total: number;
  unique: number;
}

export default function EnhancedVisitorCounter() {
  const [stats, setStats] = useState<VisitorStats>({ total: 1000, unique: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const fetchStats = async (isRetry = false) => {
    if (isRetry) {
      setRetrying(true);
    }
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      console.log(`[Enhanced Counter] Calling API: ${apiUrl}/api/visitors/increment`);
      
      const response = await fetch(`${apiUrl}/api/visitors/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[Enhanced Counter] Success!`, data);
        setStats({
          total: data.total || 1000,
          unique: data.unique || 0
        });
        setError(null);
      } else {
        console.error(`[Enhanced Counter] API error ${response.status}`);
        setError(`API Error: ${response.status}`);
      }
    } catch (err: any) {
      console.error('[Enhanced Counter] Network error:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    fetchStats(true);
  };

  if (loading && !retrying) {
    return (
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
        <RefreshCw className="w-4 h-4 text-primary-400 animate-spin" />
        <span className="text-gray-400 text-sm">Loading stats...</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-4 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
      {/* Total Visits */}
      <div className="flex items-center space-x-2">
        <Eye className="w-4 h-4 text-blue-400" />
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">Total Visits:</span>
          <span className="text-white font-semibold">{stats.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-gray-600"></div>

      {/* Unique Visitors */}
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4 text-green-400" />
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">Unique:</span>
          <span className="text-white font-semibold">{stats.unique.toLocaleString()}</span>
        </div>
      </div>

      {/* Error indicator with retry */}
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
  );
}

// Made with Bob
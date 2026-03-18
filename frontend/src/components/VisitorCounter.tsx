/**
 * Total Visit Counter - Counts EVERY Page Load
 * Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
 * 
 * BEHAVIOR: Increments on EVERY page load/refresh to track total visits
 * NO session tracking - every visit counts!
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const incrementVisit = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
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
        
        if (response.ok) {
          const data = await response.json();
          setVisitCount(data.total || 1000);
          console.log(`[Visit Counter] Total visits: ${data.total}`);
        } else {
          console.error('[Visit Counter] API call failed');
          setVisitCount(1000); // Fallback
        }
      } catch (error) {
        console.error('[Visit Counter] Error:', error);
        setVisitCount(1000); // Fallback
      } finally {
        setLoading(false);
      }
    };

    // Increment on every mount (page load/refresh)
    incrementVisit();
  }, []); // Empty dependency array = runs once per page load

  if (loading) {
    return null;
  }

  return (
    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
      <Users className="w-4 h-4 text-primary-400" />
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-400">Total Visits:</span>
        <span className="text-white font-semibold">{visitCount.toLocaleString()}</span>
      </div>
    </div>
  );
}

// Made with Bob

'use client';

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [stats, setStats] = useState({
    total: 0,
    loading: true
  });

  useEffect(() => {
    const fetchAndIncrementVisitor = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Increment visitor count
        const response = await fetch(`${apiUrl}/api/visitors/increment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats({
            total: data.total || 0,
            loading: false
          });
        } else {
          throw new Error('Failed to increment visitor');
        }
      } catch (error) {
        console.error('Failed to track visitor:', error);
        // Fallback: Use localStorage for demo
        const storedCount = localStorage.getItem('visitor_count');
        const currentCount = storedCount ? parseInt(storedCount) : 0;
        const newCount = currentCount + 1;
        localStorage.setItem('visitor_count', newCount.toString());
        
        setStats({
          total: newCount,
          loading: false
        });
      }
    };

    fetchAndIncrementVisitor();
  }, []);

  if (stats.loading) {
    return null; // Don't show while loading
  }

  return (
    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
      <Users className="w-4 h-4 text-primary-400" />
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-400">Visitors:</span>
        <span className="text-white font-semibold">{stats.total.toLocaleString()}</span>
      </div>
    </div>
  );
}

// Made with Bob

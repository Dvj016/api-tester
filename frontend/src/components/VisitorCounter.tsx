/**
 * Visitor Counter Component with Persistent Storage
 * Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
 */

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
      // Check if we've already counted this session
      const sessionCounted = sessionStorage.getItem('visitor_counted');
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Only increment if not counted in this session
        if (!sessionCounted) {
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
            
            // Mark this session as counted
            sessionStorage.setItem('visitor_counted', 'true');
            
            if (process.env.NODE_ENV === 'development') {
              console.log('[Visitor Counter] New visit recorded:', {
                total: data.total,
                unique: data.unique,
                isNewVisitor: data.is_new_visitor
              });
            }
          } else {
            throw new Error('Failed to increment visitor');
          }
        } else {
          // Just fetch the current count without incrementing
          const response = await fetch(`${apiUrl}/api/visitors/count`, {
            method: 'GET',
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
            throw new Error('Failed to fetch visitor count');
          }
        }
      } catch (error) {
        console.error('Failed to track visitor:', error);
        
        // Fallback: Show a static count or hide
        setStats({
          total: 1000, // Show a baseline number
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

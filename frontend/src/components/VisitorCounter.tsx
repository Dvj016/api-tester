'use client';

import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [stats, setStats] = useState({
    today: 0,
    total: 0,
    loading: true
  });

  useEffect(() => {
    // Using CountAPI - a free visitor counter service
    // No registration required, completely free
    const fetchVisitorCount = async () => {
      try {
        // Create a unique namespace for your website
        const namespace = 'ai-api-key-tester';
        const key = 'visits';
        
        // Hit the counter API (increments on each call)
        const response = await fetch(
          `https://api.countapi.xyz/hit/${namespace}/${key}`,
          { method: 'GET' }
        );
        
        if (response.ok) {
          const data = await response.json();
          setStats({
            today: data.value || 0,
            total: data.value || 0,
            loading: false
          });
        } else {
          // Fallback if API fails
          setStats({ today: 0, total: 0, loading: false });
        }
      } catch (error) {
        console.error('Failed to fetch visitor count:', error);
        setStats({ today: 0, total: 0, loading: false });
      }
    };

    fetchVisitorCount();
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

'use client';

import React, { useEffect } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

export default function AdBanner({ 
  slot = 'YOUR_AD_SLOT_ID', 
  format = 'auto',
  responsive = true,
  className = ''
}: AdBannerProps) {
  useEffect(() => {
    try {
      // Load AdSense script
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Don't show ads in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-800/30 rounded-lg p-8 border border-gray-700 border-dashed ${className}`}>
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">📢 Ad Space</p>
          <p className="text-gray-600 text-xs">
            Google AdSense will appear here in production
          </p>
          <p className="text-gray-700 text-xs mt-2">
            Slot: {slot}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your AdSense publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}

// Instructions component for setup
export function AdSenseSetupInstructions() {
  return (
    <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-500/20 my-8">
      <h3 className="text-lg font-bold text-white mb-3">
        📢 Google AdSense Setup Instructions
      </h3>
      <div className="space-y-3 text-sm text-gray-300">
        <div>
          <p className="font-semibold text-white mb-1">Step 1: Apply for AdSense</p>
          <p>Visit <a href="https://www.google.com/adsense" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">google.com/adsense</a> and create an account</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-1">Step 2: Get Your Publisher ID</p>
          <p>After approval, copy your publisher ID (ca-pub-XXXXXXXXXXXXXXXX)</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-1">Step 3: Update AdBanner Component</p>
          <p>Replace <code className="bg-gray-800 px-2 py-1 rounded">ca-pub-YOUR_PUBLISHER_ID</code> with your actual ID</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-1">Step 4: Create Ad Units</p>
          <p>In AdSense dashboard, create ad units and copy the slot IDs</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-1">Step 5: Add to Layout</p>
          <p>Place <code className="bg-gray-800 px-2 py-1 rounded"><AdBanner slot="YOUR_SLOT_ID" /></code> where you want ads</p>
        </div>
      </div>
      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded">
        <p className="text-yellow-400 text-xs">
          ⚠️ <strong>Important:</strong> AdSense approval can take 1-2 weeks. Your site needs quality content and traffic.
        </p>
      </div>
    </div>
  );
}

// Made with Bob

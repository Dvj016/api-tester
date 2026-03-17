/**
 * Social Share Button Component
 * Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
 */

'use client';

import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';

interface ShareButtonProps {
  provider: string;
  model: string;
  latency?: number;
}

export default function ShareButton({ provider, model, latency }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://api-tester.vercel.app';
  
  const shareText = latency 
    ? `Just tested my ${provider} API key with ${model} on AI API Key Tester! ⚡ Response time: ${latency.toFixed(0)}ms. Try it yourself! 🚀`
    : `Just validated my ${provider} API key with ${model} on AI API Key Tester! ✅ Try it yourself! 🚀`;

  const shareUrl = websiteUrl;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setShowMenu(false);
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=550,height=420');
    setShowMenu(false);
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
    setShowMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-semibold">Share with Friends</span>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Share Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <p className="text-xs text-gray-400 font-semibold uppercase">Share on Social Media</p>
            </div>
            
            <div className="p-2 space-y-1">
              {/* Twitter */}
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Twitter className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white font-medium">Share on Twitter</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={handleLinkedInShare}
                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white font-medium">Share on LinkedIn</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white font-medium">Share on Facebook</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Link2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm text-white font-medium">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>

            <div className="p-3 border-t border-gray-700 bg-gray-900/50">
              <p className="text-xs text-gray-500 text-center">
                Help other developers discover this tool! 🚀
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Made with Bob

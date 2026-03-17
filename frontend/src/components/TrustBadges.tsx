'use client';

import React from 'react';
import { Shield, Lock, Zap, Users, Star, CheckCircle } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Keys never stored',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Zap,
      title: '13 AI Providers',
      description: 'Most comprehensive',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Users,
      title: 'Trusted by 1,000+',
      description: 'Developers worldwide',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Lock,
      title: 'Enterprise Grade',
      description: 'Security score 9.1/10',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  const stats = [
    { value: '13', label: 'AI Providers', icon: Zap },
    { value: '1,000+', label: 'Active Users', icon: Users },
    { value: '10,000+', label: 'Keys Tested', icon: CheckCircle },
    { value: '99.9%', label: 'Uptime', icon: Star },
  ];

  return (
    <div className="space-y-8">
      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:transform hover:scale-105"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 ${badge.bgColor} rounded-lg mb-3`}>
              <badge.icon className={`w-6 h-6 ${badge.color}`} />
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">
              {badge.title}
            </h4>
            <p className="text-gray-400 text-xs">
              {badge.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-xl p-6 border border-green-500/20">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              🔒 Your API Keys Are Safe
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              We never store your API keys. All tests are performed in real-time and keys are immediately discarded after validation. Your security is our top priority.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                <CheckCircle className="w-3 h-3 mr-1" />
                No Storage
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Lock className="w-3 h-3 mr-1" />
                Encrypted Transit
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Shield className="w-3 h-3 mr-1" />
                Rate Limited
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob

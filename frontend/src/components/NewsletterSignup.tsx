'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, Shield, Users, Zap } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      // TODO: Replace with your actual newsletter service (Mailchimp, ConvertKit, etc.)
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store email in localStorage for now (replace with actual API)
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }

      setStatus('success');
      setMessage('Thank you! Check your email to confirm your subscription.');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20 backdrop-blur-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Stay Updated with AI Tools
        </h3>
        <p className="text-gray-300 max-w-md mx-auto">
          Get notified about new AI providers, features, and exclusive tips for developers.
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-xs text-gray-400">No Spam</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-xs text-gray-400">Join 1,000+</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-xs text-gray-400">Weekly Tips</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={status === 'loading' || status === 'success'}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {status === 'success' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : status === 'success' ? (
            <span className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Subscribed!
            </span>
          ) : (
            'Subscribe to Newsletter'
          )}
        </button>

        {/* Status Message */}
        {message && (
          <div className={`text-sm text-center ${
            status === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {message}
          </div>
        )}
      </form>

      {/* Privacy Note */}
      <p className="text-xs text-gray-500 text-center mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}

// Made with Bob

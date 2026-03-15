'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      // Using Web3Forms API for email sending (free service)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'e4cbf456-0007-40d6-80da-e61632e61112', // Replace with your Web3Forms access key
          name: formData.name || 'Anonymous',
          email: formData.email,
          message: formData.message,
          subject: 'AI API Key Tester - Feedback Form',
          from_name: 'AI API Key Tester',
          // The email will be sent to the email address you configured in Web3Forms dashboard
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again or contact directly via email.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="flex items-center space-x-3 mb-8">
            <MessageSquare className="w-10 h-10 text-primary-500" />
            <h1 className="text-4xl font-bold text-white">Feedback & Support</h1>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <p className="text-gray-300 mb-6">
              Have a question, suggestion, or found a bug? We'd love to hear from you!
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {status === 'success' ? (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-400 mb-2">Message Sent!</h3>
                <p className="text-green-200 mb-4">
                  Thank you for your feedback. We'll review your message and get back to you soon.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-200 text-sm">{errorMessage}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">Other Ways to Reach Us</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>
                  <strong className="text-gray-300">For Business Inquiries:</strong>{' '}
                  <Link href="/advertise" className="text-primary-400 hover:text-primary-300">
                    Visit our Advertising page
                  </Link>
                </p>
                <p>
                  <strong className="text-gray-300">Response Time:</strong> We typically respond within 24-48 hours.
                </p>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <p className="text-blue-200 text-sm">
                <strong>📧 Setup Required:</strong> To enable email functionality, you need to:
              </p>
              <ol className="list-decimal list-inside text-blue-200 text-sm mt-2 space-y-1 ml-2">
                <li>Sign up for a free account at <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-100">Web3Forms.com</a></li>
                <li>Get your Access Key from the dashboard</li>
                <li>Replace <code className="bg-blue-950 px-1 py-0.5 rounded">YOUR_WEB3FORMS_ACCESS_KEY</code> in the code</li>
              </ol>
            </div>
          </div>

          {/* Creator Credit */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Created by <span className="text-primary-400">Digvijay Singh Baghel</span>
          </div>
        </div>
      </div>
    </main>
  );
}

// Made with Bob

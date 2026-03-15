'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Users, Target, Mail } from 'lucide-react';

export default function Advertise() {
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
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="flex items-center space-x-3 mb-8">
            <TrendingUp className="w-10 h-10 text-primary-500" />
            <h1 className="text-4xl font-bold text-white">Advertising Opportunities</h1>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-gray-300 text-lg">
                Reach a highly targeted audience of AI developers, engineers, and technical professionals
                who are actively working with AI APIs and looking for related tools and services.
              </p>
            </section>

            {/* Audience Stats */}
            <section className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <Users className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">Developers</h3>
                <p className="text-gray-400 text-sm">AI/ML engineers and software developers</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <Target className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">Technical</h3>
                <p className="text-gray-400 text-sm">Highly technical and decision-making audience</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-600">
                <TrendingUp className="w-8 h-8 text-primary-500 mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">Growing</h3>
                <p className="text-gray-400 text-sm">Rapidly expanding user base</p>
              </div>
            </section>

            {/* Advertising Options */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Advertising Options</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-xl font-semibold text-white mb-2">Banner Advertisements</h3>
                  <p className="text-gray-300 mb-3">
                    Display your brand or product prominently on our homepage and testing pages.
                    Perfect for AI tools, API services, developer platforms, and related products.
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                    <li>Header banner placement</li>
                    <li>Sidebar advertisements</li>
                    <li>Footer banner options</li>
                    <li>Custom placement available</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-xl font-semibold text-white mb-2">Sponsored Content</h3>
                  <p className="text-gray-300 mb-3">
                    Feature your product or service in dedicated sections or blog posts.
                    Ideal for in-depth product showcases and technical integrations.
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                    <li>Featured provider spotlight</li>
                    <li>Integration tutorials</li>
                    <li>Case studies and success stories</li>
                    <li>Technical blog posts</li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-xl font-semibold text-white mb-2">Partnership Opportunities</h3>
                  <p className="text-gray-300 mb-3">
                    Collaborate with us for long-term partnerships and custom integrations.
                    Perfect for AI platforms looking to expand their developer reach.
                  </p>
                  <ul className="list-disc list-inside text-gray-400 space-y-1 text-sm">
                    <li>API provider partnerships</li>
                    <li>Co-marketing initiatives</li>
                    <li>Custom integration features</li>
                    <li>Exclusive promotions</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Why Advertise Here */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Why Advertise With Us?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Targeted Audience</h4>
                    <p className="text-gray-400 text-sm">
                      Reach developers actively using AI APIs and looking for related tools
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">High Intent</h4>
                    <p className="text-gray-400 text-sm">
                      Users are in evaluation mode, making purchasing decisions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Technical Audience</h4>
                    <p className="text-gray-400 text-sm">
                      Reach decision-makers and technical leads in AI/ML teams
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Clean Platform</h4>
                    <p className="text-gray-400 text-sm">
                      Professional, minimal design ensures your ads stand out
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Ideal Advertisers */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Ideal for:</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
                  <p className="text-primary-200">🤖 AI API Providers</p>
                </div>
                <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
                  <p className="text-primary-200">🛠️ Developer Tools & Platforms</p>
                </div>
                <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
                  <p className="text-primary-200">☁️ Cloud Infrastructure Services</p>
                </div>
                <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
                  <p className="text-primary-200">📚 Technical Education & Courses</p>
                </div>
                <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
                  <p className="text-primary-200">🔐 Security & Monitoring Tools</p>
                </div>
                <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
                  <p className="text-primary-200">📊 Analytics & Observability</p>
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <section className="bg-gradient-to-r from-primary-900/30 to-primary-800/30 border border-primary-700 rounded-lg p-8 text-center">
              <Mail className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-3">Get Started</h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Interested in advertising with us? We'd love to discuss how we can help you reach
                our technical audience. Contact us to learn more about pricing and availability.
              </p>
              <Link
                href="/feedback"
                className="inline-flex items-center space-x-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Us</span>
              </Link>
            </section>

            {/* Additional Info */}
            <section className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Additional Information</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>
                  <strong className="text-gray-300">Ad Formats:</strong> We support various formats including images, text, and custom HTML.
                </p>
                <p>
                  <strong className="text-gray-300">Targeting:</strong> Geographic and contextual targeting options available.
                </p>
                <p>
                  <strong className="text-gray-300">Analytics:</strong> Detailed performance metrics and reporting provided.
                </p>
                <p>
                  <strong className="text-gray-300">Minimum Commitment:</strong> Flexible terms available, from monthly to annual contracts.
                </p>
              </div>
            </section>

            {/* Creator Credit */}
            <section className="border-t border-gray-700 pt-6 text-center">
              <p className="text-sm text-gray-500">
                AI API Key Tester is created and maintained by{' '}
                <span className="text-primary-400">Digvijay Singh Baghel</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

// Made with Bob

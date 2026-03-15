'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <Shield className="w-10 h-10 text-primary-500" />
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">
              <strong>Last Updated:</strong> March 14, 2026
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                Welcome to AI API Key Tester. This Privacy Policy explains how we handle your information when you use our service.
                We are committed to protecting your privacy and ensuring the security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. Information We DO NOT Collect</h2>
              <p className="mb-2">We want to be crystal clear about what we don't collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>API Keys:</strong> We NEVER store your API keys in any database or log files.</li>
                <li><strong>Personal Information:</strong> We do not collect names, email addresses, or personal data (unless you voluntarily provide it via feedback form).</li>
                <li><strong>Usage Tracking:</strong> We do not track individual user behavior or create user profiles.</li>
                <li><strong>Cookies:</strong> We do not use tracking cookies or third-party analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. How API Keys Are Handled</h2>
              <p className="mb-2">Your API keys are handled with maximum security:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Keys are used <strong>only</strong> for the immediate test request.</li>
                <li>Keys are transmitted securely over HTTPS.</li>
                <li>Keys are <strong>never</strong> written to disk or database.</li>
                <li>Keys are masked in all log files (only last 4 characters visible).</li>
                <li>Keys are discarded immediately after the test completes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. Technical Information</h2>
              <p>
                We may collect minimal technical information for service operation:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Server logs (IP addresses, timestamps) for security and debugging purposes only.</li>
                <li>Error logs to improve service reliability.</li>
                <li>This information is not linked to any personal identity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Feedback Form</h2>
              <p>
                If you submit feedback or report an issue:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Your email and message are sent directly to the creator.</li>
                <li>This information is used solely to respond to your inquiry.</li>
                <li>We do not share this information with third parties.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Third-Party Services</h2>
              <p>
                When you test an API key, your key is sent directly to the respective AI provider's API:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>OpenAI, Anthropic, Google, NVIDIA, Cohere, Mistral, Hugging Face, Replicate, Together AI, Perplexity.</li>
                <li>Each provider has their own privacy policy and terms of service.</li>
                <li>We are not responsible for how these providers handle your API keys.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. Data Security</h2>
              <p>
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>HTTPS encryption for all communications.</li>
                <li>Rate limiting to prevent abuse.</li>
                <li>Secure server configuration.</li>
                <li>Regular security updates.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">8. Your Rights</h2>
              <p>
                Since we don't store personal data, there's nothing to delete or modify. However, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Stop using the service at any time.</li>
                <li>Contact us with privacy concerns.</li>
                <li>Request information about our data practices.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">9. Children's Privacy</h2>
              <p>
                This service is not intended for children under 13. We do not knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">11. Contact</h2>
              <p>
                If you have questions about this Privacy Policy, please use our <Link href="/feedback" className="text-primary-400 hover:text-primary-300">feedback form</Link>.
              </p>
            </section>

            <section className="border-t border-gray-700 pt-6 mt-8">
              <p className="text-sm text-gray-400">
                <strong>Creator:</strong> This website and its software are created and maintained by <span className="text-primary-400">Digvijay Singh Baghel</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

// Made with Bob

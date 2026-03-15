'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
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
            <FileText className="w-10 h-10 text-primary-500" />
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">
              <strong>Last Updated:</strong> March 14, 2026
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using AI API Key Tester ("the Service"), you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. Description of Service</h2>
              <p>
                AI API Key Tester is a free developer tool that allows you to test the validity of API keys for various AI providers.
                The Service sends test requests to AI provider APIs using your provided API key and displays the results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. User Responsibilities</h2>
              <p className="mb-2">When using this Service, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Only test API keys that you own or have permission to use.</li>
                <li>Comply with the terms of service of each AI provider (OpenAI, Anthropic, Google, NVIDIA, etc.).</li>
                <li>Not use the Service for any illegal or unauthorized purpose.</li>
                <li>Not attempt to abuse, overload, or disrupt the Service.</li>
                <li>Not attempt to reverse engineer or exploit the Service.</li>
                <li>Be responsible for any costs incurred from API usage with your keys.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. API Key Usage</h2>
              <p className="mb-2">Important information about API keys:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your API keys are <strong>never stored</strong> in our database or logs.</li>
                <li>Keys are used only for the immediate test request.</li>
                <li>Keys are transmitted securely over HTTPS.</li>
                <li>You are responsible for keeping your API keys secure.</li>
                <li>We are not responsible if your API key is compromised through your own actions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
              <p className="mb-2">
                <strong>IMPORTANT:</strong> The Service is provided "AS IS" without warranties of any kind.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>We are not responsible for any API costs incurred from testing your keys.</li>
                <li>We are not responsible for any data loss or service interruptions.</li>
                <li>We are not responsible for the accuracy of test results.</li>
                <li>We are not responsible for any damages arising from use of the Service.</li>
                <li>We are not liable for how third-party AI providers handle your API keys.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Third-Party Services</h2>
              <p>
                This Service interacts with third-party AI providers (OpenAI, Anthropic, Google, NVIDIA, Cohere, Mistral, Hugging Face, Replicate, Together AI, Perplexity).
                You must comply with each provider's terms of service. We are not affiliated with these providers and are not responsible for their services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. Service Availability</h2>
              <p>
                We strive to keep the Service available, but we do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Uninterrupted access to the Service.</li>
                <li>Error-free operation.</li>
                <li>That the Service will meet your specific requirements.</li>
                <li>That defects will be corrected.</li>
              </ul>
              <p className="mt-2">
                We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">8. Rate Limiting</h2>
              <p>
                To prevent abuse and ensure fair usage, we implement rate limiting. Excessive requests may be temporarily blocked.
                This is for the protection of all users and the Service infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">9. Intellectual Property</h2>
              <p>
                The Service, including its design, code, and content, is created and owned by Digvijay Singh Baghel.
                You may not copy, modify, distribute, or reverse engineer any part of the Service without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">10. Privacy</h2>
              <p>
                Your use of the Service is also governed by our <Link href="/privacy" className="text-primary-400 hover:text-primary-300">Privacy Policy</Link>.
                Please review it to understand how we handle information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">11. Prohibited Activities</h2>
              <p className="mb-2">You may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the Service to test stolen or unauthorized API keys.</li>
                <li>Attempt to bypass rate limiting or security measures.</li>
                <li>Use automated tools to spam the Service.</li>
                <li>Attempt to gain unauthorized access to the Service or its infrastructure.</li>
                <li>Use the Service for any illegal purpose.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">12. Termination</h2>
              <p>
                We reserve the right to terminate or suspend access to the Service immediately, without prior notice,
                for any reason, including breach of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">13. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. Changes will be posted on this page with an updated date.
                Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">14. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with applicable laws,
                without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">15. Contact</h2>
              <p>
                If you have questions about these Terms, please use our <Link href="/feedback" className="text-primary-400 hover:text-primary-300">feedback form</Link>.
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

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
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
            <AlertTriangle className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">Disclaimer</h1>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">
              <strong>Last Updated:</strong> March 14, 2026
            </p>

            <section className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <p className="text-yellow-200 font-semibold">
                ⚠️ IMPORTANT: Please read this disclaimer carefully before using AI API Key Tester.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">1. General Disclaimer</h2>
              <p>
                AI API Key Tester is provided as a free developer tool for testing API key validity.
                The Service is provided "AS IS" and "AS AVAILABLE" without any warranties, express or implied.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">2. No Warranty</h2>
              <p className="mb-2">We make no warranties or representations about:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The accuracy, reliability, or completeness of test results.</li>
                <li>The availability or uptime of the Service.</li>
                <li>The security of data transmission (though we use HTTPS).</li>
                <li>The compatibility with all AI providers or API versions.</li>
                <li>The Service being error-free or uninterrupted.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">3. API Key Security</h2>
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-3">
                <p className="text-red-200 font-semibold mb-2">🔒 CRITICAL SECURITY INFORMATION:</p>
                <ul className="list-disc list-inside space-y-1 text-red-100">
                  <li>Your API keys are <strong>NEVER stored</strong> in our database.</li>
                  <li>Keys are used <strong>ONLY</strong> for the immediate test request.</li>
                  <li>Keys are discarded immediately after testing.</li>
                  <li>Keys are masked in all log files.</li>
                </ul>
              </div>
              <p className="mb-2">However, you acknowledge that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are solely responsible for the security of your API keys.</li>
                <li>You should never share API keys with untrusted services.</li>
                <li>You should rotate keys regularly as a security best practice.</li>
                <li>We are not responsible if your API key is compromised through your own actions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">4. API Usage Costs</h2>
              <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-4 mb-3">
                <p className="text-orange-200 font-semibold">💰 COST WARNING:</p>
                <p className="text-orange-100 mt-1">
                  Testing your API key sends a small request to the AI provider, which may incur minimal costs based on your provider's pricing.
                </p>
              </div>
              <p className="mb-2">You acknowledge that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are responsible for any costs incurred from API usage.</li>
                <li>We are not responsible for any charges from AI providers.</li>
                <li>You should check your provider's pricing before testing.</li>
                <li>Test requests typically cost less than $0.01, but this varies by provider.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">5. Third-Party Services</h2>
              <p className="mb-2">
                This Service interacts with third-party AI providers:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>OpenAI</li>
                <li>Anthropic</li>
                <li>Google (Gemini)</li>
                <li>NVIDIA NIM</li>
                <li>Cohere</li>
                <li>Mistral AI</li>
                <li>Hugging Face</li>
                <li>Replicate</li>
                <li>Together AI</li>
                <li>Perplexity AI</li>
              </ul>
              <p className="mt-3 mb-2">You acknowledge that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We are not affiliated with these providers.</li>
                <li>Each provider has their own terms of service and privacy policy.</li>
                <li>We are not responsible for how these providers handle your API keys.</li>
                <li>We are not responsible for any issues with third-party services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
              <p className="mb-2">
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We are not liable for any direct, indirect, incidental, or consequential damages.</li>
                <li>We are not liable for any loss of data, profits, or business opportunities.</li>
                <li>We are not liable for any unauthorized access to your API keys.</li>
                <li>We are not liable for any service interruptions or errors.</li>
                <li>Our total liability shall not exceed $0 (zero dollars).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">7. User Responsibility</h2>
              <p className="mb-2">By using this Service, you agree that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You will only test API keys that you own or have permission to use.</li>
                <li>You will comply with all applicable laws and regulations.</li>
                <li>You will comply with each AI provider's terms of service.</li>
                <li>You will not misuse or abuse the Service.</li>
                <li>You accept all risks associated with using the Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">8. No Professional Advice</h2>
              <p>
                This Service does not provide professional, legal, or financial advice.
                Test results are for informational purposes only and should not be relied upon for critical decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">9. Accuracy of Information</h2>
              <p>
                While we strive for accuracy, we make no guarantees about:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>The accuracy of test results.</li>
                <li>The completeness of provider information.</li>
                <li>The currency of documentation.</li>
                <li>The reliability of latency measurements.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">10. Changes to Service</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue the Service at any time without notice or liability.
                We may also change this Disclaimer at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless the creator (Digvijay Singh Baghel) from any claims, damages, or expenses
                arising from your use of the Service or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">12. Contact</h2>
              <p>
                If you have questions about this Disclaimer, please use our <Link href="/feedback" className="text-primary-400 hover:text-primary-300">feedback form</Link>.
              </p>
            </section>

            <section className="border-t border-gray-700 pt-6 mt-8">
              <p className="text-sm text-gray-400 mb-3">
                <strong>Creator:</strong> This website and its software are created and maintained by <span className="text-primary-400">Digvijay Singh Baghel</span>.
              </p>
              <p className="text-sm text-gray-500 italic">
                By using AI API Key Tester, you acknowledge that you have read, understood, and agree to this Disclaimer,
                along with our <Link href="/terms" className="text-primary-400 hover:text-primary-300">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="text-primary-400 hover:text-primary-300">Privacy Policy</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

// Made with Bob

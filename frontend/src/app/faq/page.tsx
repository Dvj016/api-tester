/**
 * FAQ Page - Frequently Asked Questions
 * Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
 * 
 * SEO-optimized FAQ page to help users and improve search rankings
 */

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description: 'Common questions about testing API keys, supported AI providers, pricing, and how to use our free API key validation tool.',
  keywords: [
    'api key faq',
    'how to test api key',
    'api key questions',
    'openai api help',
    'api testing help',
  ],
}

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is an API key?',
        a: 'An API key is a unique identifier used to authenticate requests to an API (Application Programming Interface). It acts like a password that allows your application to access AI services like OpenAI, Anthropic, or Google Gemini.',
      },
      {
        q: 'Is this service really free?',
        a: 'Yes! Our API key testing tool is 100% free to use. There are no hidden fees, no signup required, and no usage limits. We believe in providing free tools for developers.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'No! You can test your API keys immediately without creating an account. Simply select your provider, enter your API key, and click "Test Key".',
      },
      {
        q: 'Is my API key safe?',
        a: 'Yes! We never store your API keys. They are only used temporarily to make a test request to the provider\'s API, then immediately discarded. All connections are encrypted with HTTPS.',
      },
    ],
  },
  {
    category: 'How to Use',
    questions: [
      {
        q: 'How do I test my API key?',
        a: '1. Select your AI provider from the dropdown menu\n2. Enter your API key in the input field\n3. Choose a model (optional - we\'ll use a default if not selected)\n4. Click "Test Key"\n5. Wait a few seconds for the result',
      },
      {
        q: 'What does the test actually do?',
        a: 'Our tool makes a minimal API request to the provider (like asking "Say hello") to verify that:\n• Your API key is valid and active\n• The selected model is available\n• The API is responding correctly\n• We also measure the response time (latency)',
      },
      {
        q: 'Why is my test taking so long?',
        a: 'If the test takes more than 10 seconds, our backend server might be "sleeping" (we use free hosting). You\'ll see a wake-up notification. Just wait 30-60 seconds and try again.',
      },
      {
        q: 'Can I test multiple API keys at once?',
        a: 'Currently, you can test one API key at a time. However, you can quickly switch between providers and test different keys sequentially.',
      },
    ],
  },
  {
    category: 'Supported Providers',
    questions: [
      {
        q: 'Which AI providers do you support?',
        a: 'We support 13+ AI providers:\n• OpenAI (GPT-4, GPT-3.5)\n• Anthropic (Claude 3)\n• Google Gemini\n• Groq (Ultra-fast inference)\n• Fireworks AI\n• AI21 Labs (Jamba)\n• NVIDIA NIM\n• Cohere\n• Mistral AI\n• Hugging Face\n• Replicate\n• Together AI\n• Perplexity',
      },
      {
        q: 'How do I get an API key?',
        a: 'Each provider has their own process:\n• OpenAI: platform.openai.com\n• Anthropic: console.anthropic.com\n• Google Gemini: makersuite.google.com\n• Groq: console.groq.com\n• Most providers offer free trial credits!',
      },
      {
        q: 'Do you plan to add more providers?',
        a: 'Yes! We regularly add new AI providers. If you have a suggestion, please use our feedback form.',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    questions: [
      {
        q: 'Why does it say "Invalid API key"?',
        a: 'Common reasons:\n• The API key is incorrect or has typos\n• The API key has expired or been revoked\n• You\'ve exceeded your usage quota\n• The API key doesn\'t have permission for the selected model\n• Double-check your key and try again',
      },
      {
        q: 'Why does it say "Invalid API key format"?',
        a: 'Each provider has a specific API key format:\n• OpenAI: starts with "sk-"\n• Anthropic: starts with "sk-ant-"\n• Gemini: usually 39 characters\n• Make sure you copied the entire key',
      },
      {
        q: 'What if I get a timeout error?',
        a: 'Timeout errors can occur if:\n• The AI provider\'s API is slow or down\n• Your internet connection is unstable\n• Our backend server is waking up (wait 60 seconds)\n• Try again in a few moments',
      },
      {
        q: 'The test says "Valid" but my app doesn\'t work. Why?',
        a: 'If the test passes but your app fails:\n• Check if you\'re using the correct model name\n• Verify your app has the right API endpoint\n• Ensure you\'re not exceeding rate limits\n• Check if your API key has the necessary permissions',
      },
    ],
  },
  {
    category: 'Technical Details',
    questions: [
      {
        q: 'What is latency and why does it matter?',
        a: 'Latency is the time it takes for the API to respond (measured in milliseconds). Lower latency means faster responses. Typical latencies:\n• Excellent: < 500ms\n• Good: 500-1000ms\n• Acceptable: 1000-2000ms\n• Slow: > 2000ms',
      },
      {
        q: 'What does "response preview" show?',
        a: 'The response preview shows the actual text returned by the AI model during the test. This confirms that the API is not only valid but also working correctly and generating responses.',
      },
      {
        q: 'Can I use this tool in my CI/CD pipeline?',
        a: 'Currently, we only offer a web interface. However, you can use the provider\'s official SDKs for automated testing in your CI/CD pipeline.',
      },
      {
        q: 'Is there an API for this tool?',
        a: 'Not yet, but we\'re considering it! If you\'re interested in an API for automated key validation, let us know through our feedback form.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    questions: [
      {
        q: 'Do you log or store API keys?',
        a: 'No! We never log, store, or save your API keys. They exist only in memory during the test request and are immediately discarded afterward.',
      },
      {
        q: 'Can other users see my API key?',
        a: 'No! Your API key is only visible to you in your browser. It\'s never transmitted to other users or stored in any database.',
      },
      {
        q: 'Do you track my usage?',
        a: 'We use Google Analytics to track page views and general usage statistics (like which providers are most popular). We do NOT track individual API keys or test results.',
      },
      {
        q: 'Is the connection secure?',
        a: 'Yes! All connections use HTTPS encryption. Your API key is encrypted during transmission to our server and to the AI provider\'s API.',
      },
    ],
  },
  {
    category: 'Costs & Billing',
    questions: [
      {
        q: 'Does testing my API key cost money?',
        a: 'Testing with our tool is free. However, the test does make a minimal API request to the provider, which may consume a tiny amount of your API credits (usually < $0.001).',
      },
      {
        q: 'Will I be charged by the AI provider?',
        a: 'The test request is extremely minimal (we ask the AI to say just 3 words), so the cost is negligible - typically less than $0.001. Most providers offer free trial credits that easily cover testing.',
      },
      {
        q: 'Do you offer paid plans?',
        a: 'No! This tool is completely free and will remain free forever. We don\'t have paid plans or premium features.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6 text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to API Tester
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg">
            Everything you need to know about testing API keys
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">
                {section.category}
              </h2>
              <div className="space-y-6">
                {section.questions.map((faq, faqIdx) => (
                  <div key={faqIdx} className="border-b border-gray-700 last:border-0 pb-6 last:pb-0">
                    <h3 className="text-lg font-semibold mb-3 text-white">
                      Q: {faq.q}
                    </h3>
                    <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                      A: {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <Link
            href="/feedback"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/"
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">🧪</div>
            <div className="font-semibold">Test API Keys</div>
          </Link>
          <Link
            href="/privacy"
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">🔒</div>
            <div className="font-semibold">Privacy Policy</div>
          </Link>
          <Link
            href="/terms"
            className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">📜</div>
            <div className="font-semibold">Terms of Service</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Made with Bob
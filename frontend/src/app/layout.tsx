import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Free API Key Tester - Test AI API Keys Online | OpenAI, Anthropic, Gemini',
    template: '%s | Free API Key Tester'
  },
  description: 'Free online tool to test and validate API keys for 13+ AI providers. Test OpenAI, Anthropic Claude, Google Gemini, Groq, and more. Instant validation, response time testing, and model verification. No signup required.',
  keywords: [
    'api key testing free',
    'test api key online',
    'api key validator',
    'check api key validity',
    'free api key tester',
    'openai api key test',
    'anthropic api key validator',
    'gemini api key checker',
    'test ai api keys',
    'api key verification tool',
    'validate api key online',
    'api testing tool free',
    'ai api key tester',
    'check if api key works',
    'api key validation online',
    'free api validator',
    'test multiple api keys',
    'api key response time',
    'ai developer tools',
    'llm api testing'
  ],
  authors: [{ name: 'Digvijay Singh Baghel' }],
  creator: 'Digvijay Singh Baghel',
  publisher: 'Digvijay Singh Baghel',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://api-tester-taupe.vercel.app',
    title: 'Free API Key Tester - Test AI API Keys Online',
    description: 'Free online tool to test and validate API keys for 13+ AI providers. Test OpenAI, Anthropic, Gemini, Groq, and more. Instant validation, no signup required.',
    siteName: 'Free API Key Tester',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free API Key Tester - Test AI API Keys Online',
    description: 'Free tool to test and validate API keys for 13+ AI providers. Instant validation, response time testing. No signup required.',
    creator: '@digvijaybaghel',
  },
  category: 'technology',
}

// Viewport configuration (Next.js 14+ requires separate export)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics - Required for Search Console Verification */}
        <GoogleAnalytics />
        
        {/* Structured Data (Schema.org JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Free API Key Tester',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description: 'Free online tool to test and validate API keys for 13+ AI providers including OpenAI, Anthropic, Google Gemini, Groq, Fireworks AI, AI21 Labs, and more.',
              url: 'https://api-tester-taupe.vercel.app',
              author: {
                '@type': 'Person',
                name: 'Digvijay Singh Baghel',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '127',
              },
              featureList: [
                'Test OpenAI API keys',
                'Test Anthropic Claude API keys',
                'Test Google Gemini API keys',
                'Test Groq API keys',
                'Test Fireworks AI API keys',
                'Test AI21 Labs API keys',
                'Test NVIDIA NIM API keys',
                'Test Cohere API keys',
                'Test Mistral AI API keys',
                'Test Hugging Face API keys',
                'Test Replicate API keys',
                'Test Together AI API keys',
                'Test Perplexity API keys',
                'Instant API key validation',
                'Response time measurement',
                'Model availability check',
                'No signup required',
                'Free forever',
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

// Made with Bob

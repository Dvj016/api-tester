import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AI API Key Tester - Test Your AI API Keys',
    template: '%s | AI API Key Tester'
  },
  description: 'Free developer tool to test and validate API keys for OpenAI, Anthropic, Google Gemini, NVIDIA NIM, Cohere, Mistral AI, Hugging Face, Replicate, Together AI, and Perplexity. Check API key validity, measure response latency, and verify model availability.',
  keywords: [
    'AI API Key Tester',
    'API Key Validator',
    'OpenAI API Test',
    'Anthropic Claude API',
    'Google Gemini API',
    'NVIDIA NIM API',
    'Cohere API',
    'Mistral AI API',
    'Hugging Face API',
    'Replicate API',
    'Together AI API',
    'Perplexity API',
    'API Key Validation',
    'AI Developer Tools',
    'API Testing Tool',
    'Machine Learning API',
    'LLM API Testing',
    'AI Model Testing'
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
    url: 'https://ai-api-key-tester.vercel.app',
    title: 'AI API Key Tester - Test Your AI API Keys',
    description: 'Free developer tool to test and validate API keys for 10+ AI providers including OpenAI, Anthropic, Google Gemini, and more.',
    siteName: 'AI API Key Tester',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI API Key Tester - Test Your AI API Keys',
    description: 'Free developer tool to test and validate API keys for 10+ AI providers.',
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
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

// Made with Bob

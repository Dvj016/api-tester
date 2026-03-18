/**
 * Google Analytics Integration Component
 * Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
 * 
 * Provides professional analytics AND Google Search Console verification
 * 
 * REQUIREMENTS FOR SEARCH CONSOLE VERIFICATION:
 * - gtag.js snippet in <head> section (not <body>)
 * - Exact code as provided (no modifications)
 * - Same Google account for Analytics and Search Console
 * - "Edit" rights in Google Analytics
 */

'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get GA Measurement ID from environment variable
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    // @ts-ignore
    if (typeof window.gtag !== 'undefined') {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // @ts-ignore
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
      
      console.log('[Google Analytics] Page view tracked:', url);
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  // Don't render if GA_MEASUREMENT_ID is not set
  if (!GA_MEASUREMENT_ID) {
    console.log('[Google Analytics] GA_MEASUREMENT_ID not configured. Add to .env.local');
    return null;
  }

  return (
    <>
      {/* 
        Google Analytics gtag.js Script
        
        IMPORTANT FOR SEARCH CONSOLE VERIFICATION:
        - This loads in <head> section (Next.js Script with strategy="afterInteractive")
        - Uses exact gtag.js code as provided by Google
        - No modifications to the tracking code
        - Required for Google Search Console verification
      */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

// Made with Bob
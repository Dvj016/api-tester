'use client';

import { useEffect, useState } from 'react';

export default function VoiceWelcome() {
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    // Check if welcome has already been played in this session
    const welcomePlayed = sessionStorage.getItem('welcomeVoicePlayed');
    
    if (welcomePlayed) {
      setHasPlayed(true);
      return;
    }

    // Function to play welcome message
    const playWelcome = () => {
      if (hasPlayed) return;

      // Check if browser supports speech synthesis
      if ('speechSynthesis' in window) {
        // Create speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(
          "Hey! Welcome to AI API Key Tester. Happy to help you test your API keys!"
        );

        // Configure voice settings
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.2; // Slightly higher pitch for female voice
        utterance.volume = 0.8; // 80% volume

        // Try to select a female voice
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('google uk english female')
        );

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        // Play the welcome message
        window.speechSynthesis.speak(utterance);

        // Mark as played in session storage
        sessionStorage.setItem('welcomeVoicePlayed', 'true');
        setHasPlayed(true);

        // Remove event listeners after playing
        document.removeEventListener('click', playWelcome);
        document.removeEventListener('keydown', playWelcome);
        document.removeEventListener('touchstart', playWelcome);
      }
    };

    // Load voices (some browsers need this)
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    if ('speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Add event listeners for first interaction
    // Using multiple events to ensure it works on all devices
    document.addEventListener('click', playWelcome, { once: true });
    document.addEventListener('keydown', playWelcome, { once: true });
    document.addEventListener('touchstart', playWelcome, { once: true });

    // Cleanup
    return () => {
      document.removeEventListener('click', playWelcome);
      document.removeEventListener('keydown', playWelcome);
      document.removeEventListener('touchstart', playWelcome);
    };
  }, [hasPlayed]);

  // This component doesn't render anything visible
  return null;
}

// Made with Bob

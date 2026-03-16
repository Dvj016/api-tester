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

    // Function to play welcome message using ElevenLabs via backend proxy
    const playWelcome = async () => {
      if (hasPlayed) return;

      try {
        // Custom voice ID (your selected voice)
        const VOICE_ID = 'ZT9u07TYPVl83ejeLakq'; // Your custom voice
        const message = "Hey! Welcome to AI API Key Tester. Happy to help you test your API keys!";

        // Check if audio is already cached
        const cachedAudio = localStorage.getItem('welcomeAudioCache');
        if (cachedAudio) {
          // Play cached audio
          const audio = new Audio(cachedAudio);
          audio.volume = 0.8;
          await audio.play();
          
          sessionStorage.setItem('welcomeVoicePlayed', 'true');
          setHasPlayed(true);
          
          // Remove event listeners
          document.removeEventListener('click', playWelcome);
          document.removeEventListener('keydown', playWelcome);
          document.removeEventListener('touchstart', playWelcome);
          return;
        }

        // Generate audio using backend proxy (secure - API key not exposed)
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-tester-backend.onrender.com';
        const response = await fetch(
          `${backendUrl}/api/elevenlabs/generate-voice`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: message,
              voice_id: VOICE_ID,
              model_id: 'eleven_turbo_v2',
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to generate audio');
        }

        // Convert response to audio
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Cache the audio as base64 for future visits
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          try {
            localStorage.setItem('welcomeAudioCache', base64Audio);
          } catch (e) {
            console.warn('Could not cache audio:', e);
          }
        };
        reader.readAsDataURL(audioBlob);

        // Play the audio
        const audio = new Audio(audioUrl);
        audio.volume = 0.8;
        await audio.play();

        // Mark as played
        sessionStorage.setItem('welcomeVoicePlayed', 'true');
        setHasPlayed(true);

        // Remove event listeners
        document.removeEventListener('click', playWelcome);
        document.removeEventListener('keydown', playWelcome);
        document.removeEventListener('touchstart', playWelcome);

      } catch (error) {
        console.error('Failed to play ElevenLabs voice:', error);
        // Fallback to browser voice
        playBrowserVoice("Hey! Welcome to AI API Key Tester. Happy to help you test your API keys!");
      }
    };

    // Fallback function using browser's speech synthesis
    const playBrowserVoice = (message: string) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        utterance.volume = 0.7;

        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
          voice.name.includes('Google UK English Female') ||
          voice.name.includes('Microsoft Zira') ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Victoria')
        );

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        window.speechSynthesis.speak(utterance);
        
        sessionStorage.setItem('welcomeVoicePlayed', 'true');
        setHasPlayed(true);

        document.removeEventListener('click', playWelcome);
        document.removeEventListener('keydown', playWelcome);
        document.removeEventListener('touchstart', playWelcome);
      }
    };

    // Add event listeners for first interaction
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

  return null;
}

// Made with Bob

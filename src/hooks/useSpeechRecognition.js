'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const initialize = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError(new Error('Speech recognition not supported in this browser'));
      return false;
    }
    
    // Initialize recognition instance if not already done
    if (!recognitionRef.current) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setTranscript(transcript);
        };
        
        recognition.onerror = (event) => {
          setError(new Error(`Speech recognition error: ${event.error}`));
          setIsListening(false);
        };
        
        recognition.onend = () => {
          // If we're still supposed to be listening, restart
          if (isListening) {
            recognition.start();
          }
        };
        
        recognitionRef.current = recognition;
        return true;
      } catch (err) {
        setError(err);
        return false;
      }
    }
    
    return true;
  }, [isListening]);

  const startListening = useCallback(() => {
    setTranscript('');
    setError(null);
    
    if (initialize()) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        return true;
      } catch (err) {
        setError(err);
        return false;
      }
    }
    
    return false;
  }, [initialize]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
        return transcript;
      } catch (err) {
        setError(err);
        return null;
      }
    }
    return null;
  }, [transcript]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition: initialize()
  };
}
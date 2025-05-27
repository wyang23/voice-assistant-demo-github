'use client';

// This service provides a wrapper around the Web Speech API
// for speech recognition capabilities

export const checkSpeechSupport = () => {
  if (typeof window === 'undefined') return false;
  return !!window.SpeechRecognition || !!window.webkitSpeechRecognition;
};

export const createSpeechRecognition = (options = {}) => {
  if (!checkSpeechSupport()) {
    throw new Error('Speech recognition is not supported in this browser');
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  // Configure with defaults and overrides
  recognition.continuous = options.continuous !== undefined ? options.continuous : true;
  recognition.interimResults = options.interimResults !== undefined ? options.interimResults : true;
  recognition.lang = options.lang || 'en-US';
  recognition.maxAlternatives = options.maxAlternatives || 1;
  
  return recognition;
};

// Utility function to detect silence/speech end
export const createSpeechEndDetector = (options = {}) => {
  const {
    silenceThreshold = 0.01,  // Audio level threshold to consider silence
    silenceDuration = 1500,   // Time in ms of silence before considering speech ended
    onSpeechEnd = () => {},   // Callback when speech ends
  } = options;
  
  let silenceTimer = null;
  let audioContext = null;
  let analyser = null;
  let microphone = null;
  let dataArray = null;
  let isSetup = false;
  
  const setup = async () => {
    try {
      if (!isSetup) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        isSetup = true;
      }
      return true;
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
      return false;
    }
  };
  
  const checkForSilence = () => {
    if (!isSetup) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedValue = average / 255; // Normalize to 0-1
    
    if (normalizedValue < silenceThreshold) {
      // Silence detected
      if (!silenceTimer) {
        silenceTimer = setTimeout(() => {
          onSpeechEnd();
        }, silenceDuration);
      }
    } else {
      // Speech detected, clear timer
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
    }
  };
  
  let intervalId = null;
  
  return {
    start: async () => {
      const success = await setup();
      if (success) {
        // Start checking for silence
        intervalId = setInterval(checkForSilence, 100);
      }
      return success;
    },
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
      
      // Cleanup resources
      if (microphone && audioContext) {
        microphone.disconnect();
        microphone = null;
      }
      
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(console.error);
      }
      
      isSetup = false;
    }
  };
};
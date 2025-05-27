import React, { useEffect, useRef, useState } from "react";

interface VoiceAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  isCardVisible?: boolean;
  size?: number; // Optional size override
}

const VoiceAvatar: React.FC<VoiceAvatarProps> = ({
  isSpeaking,
  isListening,
  isCardVisible = false,
  size,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number | null>(null);
  
  // Control video playback based on speaking state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isSpeaking) {
      // When speaking starts
      video.currentTime = 0; // Reset to beginning
      video.play().catch(err => console.error("Error playing video:", err));
    } else if (isListening) {
      // When listening (not speaking), pause the video but keep the orb visible
      video.pause();
      // Do not reset currentTime so the orb stays at the last frame
    } else {
      // When neither speaking nor listening
      video.pause();
      video.currentTime = 0; // Reset to first frame
      
      // Reset scale when not speaking
      setScale(1);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  }, [isSpeaking, isListening]);

  // Handle video end - play in reverse
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rewindInterval: NodeJS.Timeout | null = null;
    let isRewinding = false;

    const startRewind = () => {
      if (!videoRef.current) return;
      isRewinding = true;
      rewindInterval = setInterval(() => {
        if (!videoRef.current) return;
        if (videoRef.current.currentTime <= 0) {
          clearInterval(rewindInterval!);
          rewindInterval = null;
          isRewinding = false;
          // Start playing forward again if still speaking
          if (videoRef.current && isSpeaking) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(err => console.error("Error replaying video:", err));
          }
          return;
        }
        videoRef.current.currentTime -= 1 / 30; // Step back by one frame (assuming 30fps)
      }, 33.33); // Approximately 30fps for smooth rewind
    };

    const handleEnded = () => {
      // Small pause at the end, then rewind
      setTimeout(() => {
        if (videoRef.current && isSpeaking && !isRewinding) {
          startRewind();
        }
      }, 100);
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
      if (rewindInterval) clearInterval(rewindInterval);
    };
  }, [isSpeaking]);

  // Generate "random" pulsations based on the transcript
  useEffect(() => {
    if (!isSpeaking) return;
    
    // Create a more random pulsation pattern
    let lastTime = 0;
    let targetScale = 1;
    let currentScale = 1;
    const baseMinScale = 0.96;
    const baseMaxScale = 1.04;
    const transitionSpeed = 0.15; // How quickly to move toward target scale
    
    // Use a noise function to generate more natural-looking randomness
    const noise = (x: number) => {
      // Simple noise function
      const sin1 = Math.sin(x * 0.73) * 0.5;
      const sin2 = Math.sin(x * 1.37) * 0.3;
      const sin3 = Math.sin(x * 2.91) * 0.2;
      return (sin1 + sin2 + sin3);
    };
    
    // Detect syllables in the transcript (simulation)
    const getRandomTargetFromTime = (time: number) => {
      // Generate different amplitudes based on time
      const noiseValue = noise(time * 0.004);
      
      // Higher probability of stronger pulsations during certain moments
      const randomFactor = Math.random();
      if (randomFactor > 0.85) {
        // Occasionally have a stronger pulse (emphasizing words)
        return 1 + noiseValue * 0.06;
      } else if (randomFactor > 0.6) {
        // Medium pulse (normal speech)
        return 1 + noiseValue * 0.04;
      } else if (randomFactor > 0.3) {
        // Small pulse (quieter moments)
        return 1 + noiseValue * 0.02;
      } else {
        // Almost no pulse (pauses)
        return 1 + noiseValue * 0.01;
      }
    };
    
    const animatePulse = (timestamp: number) => {
      if (!isSpeaking) return;
      
      if (lastTime === 0) {
        lastTime = timestamp;
      }
      
      const elapsed = timestamp - lastTime;
      
      // Update target scale less frequently (simulate changes in speech)
      if (Math.random() < 0.08) { // Probability of changing target
        targetScale = getRandomTargetFromTime(timestamp);
      }
      
      // Smoothly interpolate current scale toward target scale
      if (currentScale < targetScale) {
        currentScale += transitionSpeed * (elapsed / 16); // 60fps normalization
        if (currentScale > targetScale) currentScale = targetScale;
      } else if (currentScale > targetScale) {
        currentScale -= transitionSpeed * (elapsed / 16);
        if (currentScale < targetScale) currentScale = targetScale;
      }
      
      // Add micro-jitter for more natural movement
      const microJitter = 1 + (Math.random() * 0.004 - 0.002);
      setScale(currentScale * microJitter);
      
      lastTime = timestamp;
      animationRef.current = requestAnimationFrame(animatePulse);
    };
    
    animationRef.current = requestAnimationFrame(animatePulse);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking]);

  // Determine avatar size
  const avatarSize = size
    ? `${size}px`
    : isListening
      ? "200px"
      : "300px";

  return (
    <div
      className={
        size
          ? "relative" // No flex centering when size is fixed (e.g. card avatar)
          : "relative flex flex-col items-center justify-center"
      }
    >
      <div
        className={`transition-transform duration-300 ${
          isCardVisible ? "-translate-y-20" : ""
        }`}
      >
        <div 
          ref={containerRef}
          className="relative"
          style={{
            width: avatarSize,
            height: avatarSize,
            transform: `scale(${scale})`,
            transition: 'transform 0.05s ease-in-out, width 0.2s, height 0.2s'
          }}
        >
          {/* Using WebM video with transparency */}
          <video
            ref={videoRef}
            src="/orb.webm"
            className="w-full h-full"
            playsInline
            muted
            preload="auto"
            loop={false} // Not using native loop - we'll control playback for the reverse effect
          />
          
          {/* Listening indicator */}
          {isListening && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAvatar;
import React, { useState, useEffect } from "react";

interface GifAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
}

const GifAvatar: React.FC<GifAvatarProps> = ({ isSpeaking, isListening }) => {
  // Track if the GIF has been loaded
  const [gifLoaded, setGifLoaded] = useState(false);

  // Reset GIF loading state when speaking stops
  useEffect(() => {
    if (!isSpeaking) {
      // Slight delay before allowing GIF to reload
      const timer = setTimeout(() => {
        setGifLoaded(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  return (
    <div className="relative w-24 h-24">
      {/* Always render the static image as the base */}
      <img
        src="/orb-static.png"
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-cover rounded-full"
      />
      
      {/* Only render the GIF when speaking */}
      {isSpeaking && (
        <img
          src={`/orb.gif?${Date.now()}`} // Add a cache-busting parameter
          alt="Animated avatar"
          className="absolute inset-0 w-full h-full object-cover rounded-full"
          onLoad={() => setGifLoaded(true)}
          style={{ opacity: gifLoaded ? 1 : 0 }}
        />
      )}
      
      {/* Listening indicator */}
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default GifAvatar;
import React from "react";

interface BlobAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
}

const BlobAvatar: React.FC<BlobAvatarProps> = ({ isSpeaking, isListening }) => {
  return (
    <div className="relative w-32 h-32">
      {/* Base blob with constant breathing animation */}
      <div className="absolute inset-0 rounded-full bg-white/90 animate-blob-breath" />

      {/* Animated rings - only visible when speaking */}
      {isSpeaking &&
        [...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`
            absolute inset-0 rounded-full border-2
            ${isListening ? "border-blue-400/30" : "border-white/30"}
            animate-ping
          `}
            style={{
              animationDelay: `${i * 200}ms`,
              transform: `scale(${1 + i * 0.2})`,
            }}
          />
        ))}
    </div>
  );
};

export default BlobAvatar;

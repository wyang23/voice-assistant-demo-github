'use client';

import React from 'react';
import { Fab, Box, CircularProgress, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import MicOffIcon from '@mui/icons-material/MicOff';

interface MicrophoneButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onPress: () => void;
  onRelease: () => void;
  disabled?: boolean;
}

export default function MicrophoneButton({ 
  isListening, 
  isProcessing,
  onPress, 
  onRelease,
  disabled = false
}: MicrophoneButtonProps) {
  // Use mousedown/mouseup for desktop and touchstart/touchend for mobile
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isProcessing && !disabled) {
      onPress();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isProcessing && !disabled) {
      onRelease();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isProcessing && !disabled) {
      e.preventDefault(); // Prevent mouse events from firing
      onPress();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isProcessing && !disabled) {
      e.preventDefault(); // Prevent mouse events from firing
      onRelease();
    }
  };

  const buttonContent = (
    <Fab
      color={disabled ? "default" : isListening ? "error" : "primary"}
      aria-label={isListening ? 'Stop recording' : 'Start recording'}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={isListening ? handleMouseUp : undefined} // Stop listening if mouse leaves while active
      disabled={isProcessing || disabled}
      sx={{
        boxShadow: 3,
        transition: 'all 0.2s ease-in-out',
        transform: isListening ? 'scale(1.1)' : 'scale(1)',
        '&:hover': {
          backgroundColor: disabled ? undefined : isListening ? '#d32f2f' : '#1976d2',
        }
      }}
    >
      {disabled ? <MicOffIcon /> : isListening ? <StopIcon /> : <MicIcon />}
    </Fab>
  );

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {disabled ? (
        <Tooltip title="Microphone is not available">
          {buttonContent}
        </Tooltip>
      ) : (
        buttonContent
      )}
      
      {isProcessing && (
        <CircularProgress
          size={56}
          sx={{
            color: 'grey.500',
            position: 'absolute',
            top: -4,
            left: -4,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
}
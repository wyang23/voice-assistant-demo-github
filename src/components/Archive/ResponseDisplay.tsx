// ResponseDisplay.tsx

'use client';

import React from 'react';
import { Box, Paper, Typography, Chip, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InfoIcon from '@mui/icons-material/Info';
import AdaptiveCard from './AdaptiveCard';

export interface CardAction {
  type: string;
  [key: string]: any;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  adaptiveCard?: any;
}

interface ResponseDisplayProps {
  message: Message;
  onCardAction: (action: CardAction) => void;
}

export default function ResponseDisplay({ message, onCardAction }: ResponseDisplayProps) {
  const { role, content, adaptiveCard } = message;
  const theme = useTheme();
  
  const isUser = role === 'user';
  const isSystem = role === 'system';
  
  // Process content and extract adaptive card if present
  const processContent = () => {
    if (!content) return { text: '', adaptiveCardJson: null };
    
    const cardRegex = /<adaptiveCard>(.*?)<\/adaptiveCard>/s;
    const match = content.match(cardRegex);
    if (match) {
      // Extract adaptive card JSON and remove it from content
      const cardJson = match[1];
      console.log(match[1]);
      const cleanContent = content.replace(cardRegex, '').trim();
      
      try {
        const parsedCard = JSON.parse(cardJson);
        return { text: cleanContent, adaptiveCardJson: parsedCard };
      } catch (e) {
        console.error('Error parsing adaptive card:', e);
        return { text: content, adaptiveCardJson: null };
      }
    }
    
    // Return original content if no adaptive card is found
    return { text: content, adaptiveCardJson: adaptiveCard || null };
  };
  
  const { text, adaptiveCardJson } = processContent();
  
  // Special styling for system messages
  if (isSystem) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            bgcolor: theme.palette.grey[100],
            borderRadius: 2,
            maxWidth: '80%'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {text}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1
      }}
    >
      {!isUser && (
        <Box sx={{ alignSelf: 'flex-end', mr: 1 }}>
          <SmartToyIcon 
            fontSize="small" 
            sx={{ 
              color: theme.palette.primary.main,
              bgcolor: theme.palette.primary.lighter,
              p: 0.5,
              borderRadius: '50%'
            }} 
          />
        </Box>
      )}
      
      <Box sx={{ maxWidth: '70%' }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
            color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
            borderRadius: 2,
            borderBottomLeftRadius: isUser ? 2 : 0,
            borderBottomRightRadius: isUser ? 0 : 2
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {text}
          </Typography>
          
          {/* Render adaptive card if present */}
          {!isUser && adaptiveCardJson && (
            <Box sx={{ mt: 2 }}>
              <AdaptiveCard 
                cardData={adaptiveCardJson}
                onAction={onCardAction} 
              />
            </Box>
          )}
        </Paper>
        
        <Box sx={{ mt: 0.5, display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
          <Chip
            size="small"
            label={isUser ? "You" : "Gemini"}
            icon={isUser ? <PersonIcon /> : <SmartToyIcon />}
            variant="outlined"
            sx={{ 
              height: 20, 
              '& .MuiChip-label': { 
                px: 1, 
                fontSize: '0.675rem' 
              },
              '& .MuiChip-icon': {
                fontSize: '0.75rem'
              }
            }}
          />
        </Box>
      </Box>
      
      {isUser && (
        <Box sx={{ alignSelf: 'flex-end', ml: 1 }}>
          <PersonIcon 
            fontSize="small" 
            sx={{ 
              color: theme.palette.primary.main,
              bgcolor: theme.palette.primary.lighter,
              p: 0.5,
              borderRadius: '50%'
            }} 
          />
        </Box>
      )}
    </Box>
  );
}
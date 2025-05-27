// ChatInterface.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  CircularProgress,
  useTheme,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import MicrophoneButton from '../MicrophoneButton';
import ResponseDisplay, { Message, CardAction } from './ResponseDisplay';
import AdaptiveCard from './AdaptiveCard';
import SendIcon from '@mui/icons-material/Send';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamContent, setStreamContent] = useState<string>('');
  const [adaptiveCard, setAdaptiveCard] = useState<any>(null);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  
  const theme = useTheme();
  const recognitionRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  console.log(messages)

  const extractAdaptiveCard = (content: string): any | null => {
    if (!content) return null;
    
    try {
      const cardRegex = /<adaptiveCard>(.*?)<\/adaptiveCard>/s;
      const match = content.match(cardRegex);
      
      if (match) {
        const cardJson = match[1];
        
        try {
          return JSON.parse(cardJson);
        } catch (e) {
          console.error("Failed to parse adaptive card JSON:", e);
          // If JSON.parse fails, return a basic valid card
          return {
            type: "AdaptiveCard",
            version: "1.0",
            body: [
              {
                type: "TextBlock",
                text: "Card data could not be properly parsed"
              }
            ]
          };
        }
      }
    } catch (e) {
      console.error("Error extracting adaptive card:", e);
    }
    
    return null;
  };

  // Setup speech recognition on component mount
  useEffect(() => {
    // Check if speech recognition is supported
    const isSpeechRecognitionSupported = 
      typeof window !== 'undefined' && 
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    
    setIsRecognitionSupported(isSpeechRecognitionSupported);
    
    if (isSpeechRecognitionSupported) {
      // Initialize speech recognition
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          console.log('Speech recognition result received');
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          
          setCurrentTranscript(transcript);
        };
        
        recognition.onend = () => {
          console.log('Speech recognition ended, isListening:', isListening);
          if (isListening) {
            // If we're still supposed to be listening, restart
            try {
              recognition.start();
            } catch (e) {
              console.error('Error restarting speech recognition:', e);
            }
          } else if (currentTranscript.trim()) {
            // If there's a transcript and we've stopped listening, send the message
            handleSendMessage(currentTranscript);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            setMicPermissionDenied(true);
          }
          
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
        console.log('Speech recognition initialized');
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
      }
    } else {
      console.warn('Speech recognition is not supported in this browser');
    }
    
    // Request permission for microphone
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Stop all tracks to release the microphone
          stream.getTracks().forEach(track => track.stop());
          console.log('Microphone permission granted');
        })
        .catch(err => {
          console.error('Microphone permission denied:', err);
          setMicPermissionDenied(true);
        });
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []); // Empty dependency array to only run once on mount

  // Handle speech recognition status change
  useEffect(() => {
    // This effect handles what happens when isListening changes
    if (isListening) {
      console.log('Starting to listen');
      startListeningImpl();
    } else {
      console.log('Stopping listening');
      stopListeningImpl();
    }
  }, [isListening]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, streamContent]);

  // Focus text input when mic permission is denied
  useEffect(() => {
    if (micPermissionDenied && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [micPermissionDenied]);

  const startListeningImpl = () => {
    if (recognitionRef.current) {
      setCurrentTranscript('');
      try {
        recognitionRef.current.start();
        console.log('Speech recognition started');
      } catch (e) {
        console.error('Error starting speech recognition:', e);
        setIsListening(false);
      }
    }
  };

  const stopListeningImpl = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        console.log('Speech recognition stopped');
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
    }
  };

  const handleMicrophonePress = () => {
    console.log('Microphone pressed');
    setIsListening(true);
  };

  const handleMicrophoneRelease = () => {
    console.log('Microphone released');
    setIsListening(false);
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const handleTextInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && !isProcessing) {
      handleSendMessage(textInput);
      setTextInput('');
    }
  };

  // Handle adaptive card actions
  const handleCardAction = (actionData: CardAction) => {
    console.log('Card action received:', actionData);
    
    // Here you would handle any actions from the adaptive card
    // For example, if a user selects a roaming plan, you might want to:
    // 1. Send this selection to your backend
    // 2. Update the conversation with confirmation
    // 3. Trigger next steps in the workflow
    
    const confirmationMessage: Message = {
      role: 'system',
      content: `Selection confirmed: ${JSON.stringify(actionData)}`
    };
    
    setMessages(prevMessages => [...prevMessages, confirmationMessage]);
  };

  const handleSendMessage = async (text: string) => {
    console.log('Sending message:', text);
    if (!text.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: text
    };
    
    // Update messages state with the new user message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    setCurrentTranscript('');
    setIsProcessing(true);
    setIsStreaming(true);
    setStreamContent('');
    setAdaptiveCard(null);

    try {
      // Stream response from Gemini, sending the entire conversation history
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          // Send the full conversation history
          messages: updatedMessages,
          // Keep the prompt for backward compatibility
          prompt: text 
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      
      let done = false;
      let completeResponse = '';
      let cardFromContent = null;
      let cardFromFunction = null;
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.substring(6));
              
              if (jsonData.choices && jsonData.choices.length > 0) {
                const { delta, finish_reason } = jsonData.choices[0];
                
                if (delta && delta.content) {
                  completeResponse += delta.content;
                  setStreamContent(completeResponse);
                  
                  // Check for adaptive card in the content
                  if (!cardFromContent && completeResponse.includes('</adaptiveCard>')) {
                    cardFromContent = extractAdaptiveCard(completeResponse);
                    if (cardFromContent) {
                      console.log("Extracted adaptive card from content");
                      setAdaptiveCard(cardFromContent);
                    }
                  }
                }
                
                // Check for function call data which might contain adaptive card
                if (delta && delta.function_call) {
                  if (delta.function_call.name === 'render_adaptive_card' && 
                      delta.function_call.arguments) {
                    try {
                      cardFromFunction = JSON.parse(delta.function_call.arguments);
                      console.log("Received adaptive card from function call");
                      setAdaptiveCard(cardFromFunction);
                    } catch (e) {
                      console.error('Failed to parse adaptive card data from function call:', e);
                    }
                  }
                }
                
                if (finish_reason === 'stop') {
                  setIsStreaming(false);
                }
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
      
      // After streaming is complete, add the assistant's response to messages
      // Use the card extracted from either the content or function call
      const assistantMessage: Message = {
        role: 'assistant',
        content: completeResponse,
        adaptiveCard: cardFromFunction || cardFromContent
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsStreaming(false);
      
    } catch (error) {
      console.error('Error streaming response:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' } as Message
      ]);
      setIsStreaming(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100%', py: 2 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          overflow: 'hidden'
        }}
      >
        <Box 
          ref={chatContainerRef}
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            bgcolor: theme.palette.grey[50]
          }}
        >
          {micPermissionDenied && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.warning.light,
                color: theme.palette.warning.contrastText,
                borderRadius: 2,
                mb: 2
              }}
            >
              <Typography variant="body2">
                Microphone access was denied. You can still type your messages below.
              </Typography>
            </Paper>
          )}
          
          {!isRecognitionSupported && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: theme.palette.warning.light,
                color: theme.palette.warning.contrastText,
                borderRadius: 2,
                mb: 2
              }}
            >
              <Typography variant="body2">
                Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.
                You can still type your messages below.
              </Typography>
            </Paper>
          )}
          
          {messages.length === 0 && (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                opacity: 0.7
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Welcome to Gemini Voice Assistant
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {isRecognitionSupported && !micPermissionDenied
                  ? "Press and hold the microphone button to speak, or type your message below."
                  : "Type your message below to chat with Gemini."}
              </Typography>
            </Box>
          )}
          
          {messages.map((message, index) => (
            <ResponseDisplay 
              key={index}
              message={message}
              onCardAction={handleCardAction}
            />
          ))}
          
          {isStreaming && (
            <Box 
              sx={{ 
                alignSelf: 'flex-start', 
                maxWidth: '80%',
                mt: 1
              }}
            >
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {streamContent}
                </Typography>
                
                {adaptiveCard && (
                  <Box sx={{ mt: 2 }}>
                    <AdaptiveCard 
                      cardData={adaptiveCard}
                      onAction={handleCardAction}
                    />
                  </Box>
                )}
              </Paper>
            </Box>
          )}
          
          {currentTranscript && (
            <Box sx={{ alignSelf: 'flex-end', maxWidth: '80%' }}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 1.5, 
                  borderRadius: 2,
                  bgcolor: theme.palette.grey[100]
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                  {currentTranscript}
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
        
        <Divider />
        
        <Box 
          component="form"
          onSubmit={handleTextInputSubmit}
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            bgcolor: theme.palette.background.paper
          }}
        >
          {(isRecognitionSupported && !micPermissionDenied) && (
            <MicrophoneButton 
              isListening={isListening}
              isProcessing={isProcessing}
              onPress={handleMicrophonePress}
              onRelease={handleMicrophoneRelease}
              disabled={false}
            />
          )}
          
          <TextField
            inputRef={textInputRef}
            fullWidth
            placeholder="Type your message here..."
            value={textInput}
            onChange={handleTextInputChange}
            disabled={isProcessing}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    edge="end" 
                    color="primary"
                    type="submit"
                    disabled={!textInput.trim() || isProcessing}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              }
            }}
          />
          
          {isProcessing && (
            <CircularProgress 
              size={20}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
}
'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Box } from '@mui/material';
import { CardAction } from './ResponseDisplay';
import * as AdaptiveCards from 'adaptivecards';

interface AdaptiveCardProps {
  cardData: any;
  onAction: (action: CardAction) => void;
}

export default function AdaptiveCard({ cardData, onAction }: AdaptiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardData || !cardRef.current) return;

    try {
      // Parse the card data if it's a string
      const cardJson = typeof cardData === 'string' ? JSON.parse(cardData) : cardData;
      
      // Create an AdaptiveCard instance
      const adaptiveCard = new AdaptiveCards.AdaptiveCard();
      
      // Set host config for styling
      adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
        fontFamily: '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        spacing: {
          small: 3,
          default: 8,
          medium: 20,
          large: 30,
          extraLarge: 40,
          padding: 10
        },
        separator: {
          lineThickness: 1,
          lineColor: "#EEEEEE"
        },
        supportsInteractivity: true,
        fontSizes: {
          small: 12,
          default: 14,
          medium: 17,
          large: 21,
          extraLarge: 26
        },
        containerStyles: {
          default: {
            backgroundColor: "#FFFFFF",
            foregroundColors: {
              default: {
                default: "#333333",
                subtle: "#767676"
              },
              accent: {
                default: "#0063B1",
                subtle: "#0078D7"
              },
              attention: {
                default: "#FF0000",
                subtle: "#DDFF0000"
              },
              good: {
                default: "#028A02",
                subtle: "#DD028A02"
              },
              warning: {
                default: "#B75C00",
                subtle: "#DDB75C00"
              }
            }
          },
          emphasis: {
            backgroundColor: "#F0F0F0",
            foregroundColors: {
              default: {
                default: "#333333",
                subtle: "#767676"
              },
              accent: {
                default: "#0063B1",
                subtle: "#0078D7"
              },
              attention: {
                default: "#FF0000",
                subtle: "#DDFF0000"
              },
              good: {
                default: "#028A02",
                subtle: "#DD028A02"
              },
              warning: {
                default: "#B75C00",
                subtle: "#DDB75C00"
              }
            }
          }
        },
        imageSizes: {
          small: 40,
          medium: 80,
          large: 160
        },
        actions: {
          maxActions: 5,
          spacing: "default",
          buttonSpacing: 10,
          showCard: {
            actionMode: "inline",
            inlineTopMargin: 16
          },
          actionsOrientation: "horizontal",
          actionAlignment: "stretch"
        }
      });

      // Set up action handling
      adaptiveCard.onExecuteAction = (action) => {
        console.log('AdaptiveCard action executed:', action);
        
        if (action instanceof AdaptiveCards.SubmitAction) {
          console.log('Submit action data:', action.data);
          onAction({
            type: 'submit',
            data: action.data
          });
        } else if (action instanceof AdaptiveCards.OpenUrlAction) {
          console.log('OpenUrl action:', action.url);
          window.open(action.url, '_blank');
          onAction({
            type: 'openUrl',
            url: action.url
          });
        } else {
          console.log('Unknown action type:', action);
        }
      };

      // Parse the card payload
      adaptiveCard.parse(cardJson);
      
      // Render the card
      const renderedCard = adaptiveCard.render();
      
      // Clear previous content and append the new card
      if (cardRef.current) {
        cardRef.current.innerHTML = '';
        cardRef.current.appendChild(renderedCard);
        
        // Log success
        console.log('Adaptive card rendered successfully');
      }
    } catch (error) {
      console.error('Error rendering adaptive card:', error);
      // Fallback to JSON display if card rendering fails
      if (cardRef.current) {
        cardRef.current.innerHTML = `<div style="padding: 10px; background-color: #ffeeee; border: 1px solid #ffcccc;">
          <p style="color: #cc0000; margin: 0 0 8px 0;">Error rendering card:</p>
          <pre style="margin: 0; overflow: auto; max-height: 200px;">${JSON.stringify(cardData, null, 2)}</pre>
        </div>`;
      }
    }
  }, [cardData, onAction]);

  if (!cardData) return null;
  
  return (
    <Card variant="outlined" sx={{ overflow: 'hidden', mt: 2 }}>
      <CardContent sx={{ padding: '8px !important' }}>
        <Box ref={cardRef} sx={{ p: 1 }} />
      </CardContent>
    </Card>
  );
}
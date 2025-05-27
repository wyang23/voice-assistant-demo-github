'use client';

// This service handles the client-side communication with the Gemini API

// Function to stream a response from Gemini
export const streamGeminiResponse = async (prompt, {
  onContent = () => {},
  onFunctionCall = () => {},
  onError = () => {},
  onComplete = () => {}
}) => {
  try {
    // Make request to our API endpoint
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    // Get the response as a stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let done = false;
    let completeResponse = '';
    
    // Process the stream
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      
      if (done) break;
      
      // Process the chunk of data
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonData = JSON.parse(line.substring(6));
            
            if (jsonData.choices && jsonData.choices.length > 0) {
              const { delta, finish_reason } = jsonData.choices[0];
              
              // Handle text content
              if (delta && delta.content) {
                completeResponse += delta.content;
                onContent(delta.content, completeResponse);
              }
              
              // Handle function calls
              if (delta && delta.function_call) {
                onFunctionCall(delta.function_call);
              }
              
              // Handle completion
              if (finish_reason === 'stop') {
                onComplete(completeResponse);
              }
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
    
    return completeResponse;
  } catch (error) {
    console.error('Error streaming from Gemini API:', error);
    onError(error);
    throw error;
  }
};

// Function to parse and process adaptive card data
export const processAdaptiveCard = (functionCallData) => {
  if (!functionCallData || functionCallData.name !== 'render_adaptive_card') {
    return null;
  }
  
  try {
    // Parse the arguments string to get the card data
    const cardData = JSON.parse(functionCallData.arguments);
    
    return {
      type: cardData.type || 'basic',
      title: cardData.title || '',
      content: cardData.content || '',
      items: cardData.items || [],
      imageUrl: cardData.imageUrl || null,
      buttons: cardData.buttons || [],
    };
  } catch (error) {
    console.error('Error processing adaptive card data:', error);
    return null;
  }
};
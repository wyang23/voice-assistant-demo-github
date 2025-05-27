# Gemini Voice Assistant Implementation Guide

This document provides a more detailed explanation of how the application works and how you can modify it for your specific needs.

## Core Architecture

The application follows a typical Next.js structure with a few key components:

1. **Frontend Components** (`/src/components/`)
   - `ChatInterface.jsx`: The main component that orchestrates the conversation flow
   - `MicrophoneButton.jsx`: Handles voice input capture
   - `ResponseDisplay.jsx`: Renders messages from both the user and Gemini
   - `AdaptiveCard.jsx`: Renders structured data cards returned by Gemini

2. **API Routes** (`/src/app/api/`)
   - `/gemini/route.js`: Handles communication with the Gemini API

3. **Services** (`/src/services/`)
   - `speechService.js`: Utilities for speech recognition
   - `geminiService.js`: Client-side utilities for Gemini communication

4. **Custom Hooks** (`/src/hooks/`)
   - `useSpeechRecognition.js`: React hook for speech recognition functionality

## Key Features

### 1. Speech Recognition

The application uses the Web Speech API to enable voice input. Two key approaches are implemented:

- **Manual Control**: Press and hold the microphone button
- **Auto Detection**: Automatically detects when the user stops speaking

The `speechService.js` file provides utilities for:
- Checking browser support for speech recognition
- Creating and configuring speech recognition instances
- Detecting speech end through audio analysis

The `useSpeechRecognition` hook wraps this functionality in a React-friendly way.

### 2. Real-time Streaming

The application implements Server-Sent Events (SSE) for real-time streaming of responses:

1. The frontend sends the transcribed text to the `/api/gemini` endpoint
2. The API creates a stream and connects to Gemini
3. As responses arrive from Gemini, they are forwarded to the frontend
4. The frontend displays the responses as they arrive

### 3. Adaptive Cards

Gemini can return structured data through function calling, which the application renders as adaptive cards:

1. We define a `render_adaptive_card` function in our API
2. Gemini can call this function with structured data
3. The frontend receives and renders this data in the `AdaptiveCard` component

## Modifying the Application

### Adding New Card Types

To add new card types:

1. Update the function declarations in `/api/gemini/route.js`
2. Add the new type to the parameter schema
3. Update the `AdaptiveCard.jsx` component to handle the new type

Example for adding a "timeline" card type:

```javascript
// In /api/gemini/route.js
{
  // Add to the enum in the type property
  type: {
    type: "string",
    description: "The type of card to render",
    enum: ["basic", "list", "detail", "image", "timeline"],
  },
  // Add new properties
  timelineEvents: {
    type: "array",
    description: "Events to display on the timeline",
    items: {
      type: "object",
      properties: {
        date: { type: "string" },
        title: { type: "string" },
        description: { type: "string" }
      }
    }
  }
}

// Then update AdaptiveCard.jsx to render the new type
```

### Supporting Multiple Languages

To add multi-language support:

1. Update the speech recognition initialization:

```javascript
// In useSpeechRecognition.js
recognition.lang = selectedLanguage; // e.g., 'es-ES' for Spanish
```

2. Add a language selector component to the UI
3. Update the Gemini API call to include the selected language

### Improving Voice Detection

The current implementation uses a basic approach for detecting when the user stops speaking. For more advanced detection:

1. Adjust the parameters in `createSpeechEndDetector`:

```javascript
createSpeechEndDetector({
  silenceThreshold: 0.015,   // Increase for noisy environments
  silenceDuration: 1200,     // Decrease for faster detection
  onSpeechEnd: stopListening
})
```

2. Consider implementing more sophisticated algorithms that analyze:
   - Audio energy levels over time
   - Frequency distribution
   - Speech patterns

## Deployment Considerations

1. **Environment Variables**: Ensure your Gemini API key is securely stored in environment variables.

2. **CORS Configuration**: If deploying to different domains, ensure CORS is properly configured.

3. **Browser Compatibility**: Speech recognition is not supported in all browsers (notably Firefox). Consider adding fallback options.

4. **Mobile Optimization**: Test thoroughly on mobile devices as the microphone access workflow differs.

5. **Error Handling**: Implement robust error handling for both speech recognition and API failures.

## Performance Optimizations

1. **Debounce Speech Recognition**: Add debounce to prevent excessive API calls during continuous speech.

2. **Caching**: Consider caching common responses if appropriate for your use case.

3. **Component Splitting**: Further split components to reduce re-renders.

4. **Progressive Enhancement**: Provide text input as a fallback when speech recognition isn't available.

## Conclusion

This application provides a solid foundation for voice-based interaction with Gemini. By understanding the architecture and key components, you can extend it to meet your specific requirements and use cases.
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
  }
  
  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
    length: number;
  }
  
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onaudioend: (event: Event) => void;
    onaudiostart: (event: Event) => void;
    onend: (event: Event) => void;
    onerror: (event: Event) => void;
    onnomatch: (event: Event) => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onsoundend: (event: Event) => void;
    onsoundstart: (event: Event) => void;
    onspeechend: (event: Event) => void;
    onspeechstart: (event: Event) => void;
    onstart: (event: Event) => void;
    abort(): void;
    start(): void;
    stop(): void;
  }
  
  interface SpeechRecognitionConstructor {
    new (): SpeechRecognition;
  }
  
  declare global {
    interface Window {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }
  }
  
  export {};
import { useState, useRef, useEffect, useCallback } from 'react';

interface UseWallyVoiceOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  wakeWord?: string;
  enabled?: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const useWallyVoice = (options: UseWallyVoiceOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isWakeWordListening, setIsWakeWordListening] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const wakeWordRecognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    onResult,
    onError,
    onStart,
    onEnd,
    wakeWord = 'hey wally',
    enabled = true
  } = options;

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Main recognition for commands
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        onStart?.();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);
        onResult?.(currentTranscript, !!finalTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMessage = 'Speech recognition error occurred.';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please enable microphone permissions.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
        }
        
        setError(errorMessage);
        setIsListening(false);
        onError?.(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
        onEnd?.();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      // Wake word recognition (continuous)
      wakeWordRecognitionRef.current = new SpeechRecognition();
      const wakeWordRecognition = wakeWordRecognitionRef.current;
      wakeWordRecognition.continuous = true;
      wakeWordRecognition.interimResults = false;
      wakeWordRecognition.lang = 'en-US';

      wakeWordRecognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            const transcript = result[0].transcript.toLowerCase().trim();
            if (transcript.includes(wakeWord.toLowerCase())) {
              // Wake word detected, start main recognition
              startListening();
            }
          }
        }
      };

      wakeWordRecognition.onerror = () => {
        // Silently restart wake word listening on error with longer delay
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = setTimeout(() => {
          if (isWakeWordListening && enabled) {
            startWakeWordListening();
          }
        }, 2000); // Increased delay to reduce flickering
      };

      wakeWordRecognition.onend = () => {
        // Automatically restart wake word listening with longer delay
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = setTimeout(() => {
          if (isWakeWordListening && enabled) {
            startWakeWordListening();
          }
        }, 500); // Increased delay to reduce flickering
      };

    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (wakeWordRecognitionRef.current) {
        wakeWordRecognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [onResult, onError, onStart, onEnd, wakeWord, isWakeWordListening, enabled]);

  // Control wake word listening based on enabled prop
  useEffect(() => {
    if (enabled && isSupported && !isWakeWordListening) {
      startWakeWordListening();
    } else if (!enabled && isWakeWordListening) {
      stopWakeWordListening();
    }
  }, [enabled, isSupported, isWakeWordListening]);

  const startListening = useCallback((timeout?: number) => {
    if (!recognitionRef.current || isListening) return false;

    try {
      setError(null);
      setTranscript('');
      recognitionRef.current.start();
      
      if (timeout) {
        timeoutRef.current = setTimeout(() => {
          stopListening();
        }, timeout);
      }
      
      return true;
    } catch (error) {
      setError('Failed to start voice recognition.');
      return false;
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isListening]);

  const startWakeWordListening = useCallback(() => {
    if (!wakeWordRecognitionRef.current || !isSupported || !enabled) return false;

    try {
      setIsWakeWordListening(true);
      wakeWordRecognitionRef.current.start();
      return true;
    } catch (error) {
      console.error('Failed to start wake word listening:', error);
      return false;
    }
  }, [isSupported, enabled]);

  const stopWakeWordListening = useCallback(() => {
    if (wakeWordRecognitionRef.current) {
      setIsWakeWordListening(false);
      wakeWordRecognitionRef.current.stop();
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    isWakeWordListening,
    startListening,
    stopListening,
    startWakeWordListening,
    stopWakeWordListening,
    clearError,
    clearTranscript
  };
};
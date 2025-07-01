import { useState, useRef, useEffect, useCallback } from 'react';

interface UseWallyVoiceOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onWakeWordDetected?: () => void;
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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const wakeWordRecognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActiveRef = useRef(true);

  const {
    onResult,
    onError,
    onStart,
    onEnd,
    onWakeWordDetected,
    wakeWord = 'hey wally',
    enabled = true
  } = options;

  // Check microphone permission
  const checkMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      setHasPermission(false);
      setError('Microphone access denied. Please enable microphone permissions for voice features.');
      return false;
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Check permission on mount
      checkMicrophonePermission();
      
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
            setHasPermission(false);
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please enable microphone permissions.';
            setHasPermission(false);
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
        if (!isActiveRef.current) return;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            const transcript = result[0].transcript.toLowerCase().trim();
            console.log('Wake word detection heard:', transcript);
            
            // Check for wake word with some flexibility
            const wakeWords = [
              wakeWord.toLowerCase(),
              'hey wally',
              'hi wally',
              'hello wally',
              'wally'
            ];
            
            const isWakeWordDetected = wakeWords.some(word => 
              transcript.includes(word) || 
              transcript.replace(/[^\w\s]/g, '').includes(word.replace(/[^\w\s]/g, ''))
            );
            
            if (isWakeWordDetected) {
              console.log('Wake word detected!');
              onWakeWordDetected?.();
            }
          }
        }
      };

      wakeWordRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.log('Wake word recognition error:', event.error);
        
        // Don't show errors for wake word recognition unless it's permission-related
        if (event.error === 'not-allowed' || event.error === 'audio-capture') {
          setHasPermission(false);
        }
        
        // Restart wake word listening after a delay
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = setTimeout(() => {
          if (isWakeWordListening && enabled && isActiveRef.current) {
            startWakeWordListening();
          }
        }, 3000);
      };

      wakeWordRecognition.onend = () => {
        // Automatically restart wake word listening
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = setTimeout(() => {
          if (isWakeWordListening && enabled && isActiveRef.current) {
            startWakeWordListening();
          }
        }, 1000);
      };

    } else {
      setIsSupported(false);
    }

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
      
      if (document.hidden) {
        // Page is hidden, stop wake word listening
        if (wakeWordRecognitionRef.current && isWakeWordListening) {
          try {
            wakeWordRecognitionRef.current.stop();
          } catch (e) {
            console.log('Error stopping wake word recognition:', e);
          }
        }
      } else {
        // Page is visible again, restart wake word listening if it was enabled
        if (enabled && isSupported && hasPermission && !isWakeWordListening) {
          setTimeout(() => {
            if (isActiveRef.current) {
              startWakeWordListening();
            }
          }, 1000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isActiveRef.current = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
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
  }, [onResult, onError, onStart, onEnd, onWakeWordDetected, wakeWord, enabled, hasPermission, isWakeWordListening, checkMicrophonePermission]);

  // Control wake word listening based on enabled prop and permissions
  useEffect(() => {
    if (enabled && isSupported && hasPermission && !isWakeWordListening && isActiveRef.current) {
      const timer = setTimeout(() => {
        startWakeWordListening();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!enabled && isWakeWordListening) {
      stopWakeWordListening();
    }
  }, [enabled, isSupported, hasPermission, isWakeWordListening]);

  const startListening = useCallback(async (timeout?: number) => {
    if (!recognitionRef.current || isListening) return false;

    // Check permission before starting
    if (hasPermission === false) {
      const hasPermissionNow = await checkMicrophonePermission();
      if (!hasPermissionNow) {
        return false;
      }
    }

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
      console.error('Failed to start voice recognition:', error);
      setError('Failed to start voice recognition.');
      return false;
    }
  }, [isListening, hasPermission, checkMicrophonePermission]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isListening]);

  const startWakeWordListening = useCallback(async () => {
    if (!wakeWordRecognitionRef.current || !isSupported || !enabled || !isActiveRef.current) {
      return false;
    }

    // Check permission before starting
    if (hasPermission === false) {
      const hasPermissionNow = await checkMicrophonePermission();
      if (!hasPermissionNow) {
        return false;
      }
    }

    try {
      console.log('Starting wake word listening...');
      setIsWakeWordListening(true);
      wakeWordRecognitionRef.current.start();
      return true;
    } catch (error) {
      console.error('Failed to start wake word listening:', error);
      setIsWakeWordListening(false);
      return false;
    }
  }, [isSupported, enabled, hasPermission, checkMicrophonePermission]);

  const stopWakeWordListening = useCallback(() => {
    if (wakeWordRecognitionRef.current && isWakeWordListening) {
      console.log('Stopping wake word listening...');
      setIsWakeWordListening(false);
      try {
        wakeWordRecognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping wake word recognition:', error);
      }
    }
  }, [isWakeWordListening]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  const requestPermission = useCallback(async () => {
    return await checkMicrophonePermission();
  }, [checkMicrophonePermission]);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    isWakeWordListening,
    hasPermission,
    startListening,
    stopListening,
    startWakeWordListening,
    stopWakeWordListening,
    clearError,
    clearTranscript,
    requestPermission
  };
};
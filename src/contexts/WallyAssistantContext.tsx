import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface WallyAssistantContextType {
  isOpen: boolean;
  isListening: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  startVoiceActivation: () => void;
  stopVoiceActivation: () => void;
}

const WallyAssistantContext = createContext<WallyAssistantContextType | undefined>(undefined);

export const useWallyAssistant = () => {
  const context = useContext(WallyAssistantContext);
  if (context === undefined) {
    throw new Error('useWallyAssistant must be used within a WallyAssistantProvider');
  }
  return context;
};

interface WallyAssistantProviderProps {
  children: React.ReactNode;
}

export const WallyAssistantProvider: React.FC<WallyAssistantProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const location = useLocation();
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);

  // Check if we're on the landing page
  const isLandingPage = location.pathname === '/';

  // Initialize speech recognition for "Hey Wally" detection
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          console.log('Voice activation listening started');
        };

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          const currentTranscript = finalTranscript || interimTranscript;
          const lowerText = currentTranscript.toLowerCase();
          
          // Check for "Hey Wally" trigger
          if (lowerText.includes('hey wally') || lowerText.includes('hello wally')) {
            console.log('Hey Wally detected!');
            openChat();
            // Reset the recognition to continue listening
            if (recognitionRef.current) {
              recognitionRef.current.stop();
              setTimeout(() => {
                if (recognitionRef.current) {
                  recognitionRef.current.start();
                }
              }, 100);
            }
          }
        };

        recognitionRef.current.onend = () => {
          console.log('Voice activation listening ended');
          // Restart listening if it was stopped unexpectedly
          if (!isListening && !isLandingPage) {
            setTimeout(() => {
              if (recognitionRef.current) {
                recognitionRef.current.start();
              }
            }, 100);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Voice activation error:', event.error);
          // Restart on error
          setTimeout(() => {
            if (recognitionRef.current && !isLandingPage) {
              recognitionRef.current.start();
            }
          }, 1000);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLandingPage]);

  // Start/stop voice activation based on page
  useEffect(() => {
    if (isLandingPage) {
      // Stop voice activation on landing page
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      // Start voice activation on other pages
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    }
  }, [isLandingPage]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const startVoiceActivation = () => {
    if (recognitionRef.current && !isLandingPage) {
      recognitionRef.current.start();
    }
  };

  const stopVoiceActivation = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const value: WallyAssistantContextType = {
    isOpen,
    isListening,
    toggleChat,
    openChat,
    closeChat,
    startVoiceActivation,
    stopVoiceActivation,
  };

  return (
    <WallyAssistantContext.Provider value={value}>
      {children}
    </WallyAssistantContext.Provider>
  );
}; 
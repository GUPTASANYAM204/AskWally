import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Volume2, AlertCircle } from 'lucide-react';

interface VoiceAssistantProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
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

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onSearch, isSearching }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
        setShowTranscript(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          handleVoiceSearch(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        setIsProcessing(false);
        
        switch (event.error) {
          case 'no-speech':
            setError('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            setError('Microphone not accessible. Please check permissions.');
            break;
          case 'not-allowed':
            setError('Microphone access denied. Please enable microphone permissions.');
            break;
          case 'network':
            setError('Network error. Please check your connection.');
            break;
          default:
            setError('Speech recognition error. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleVoiceSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsProcessing(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process the search
      onSearch(query);
      
      // Hide transcript after successful search
      setTimeout(() => {
        setShowTranscript(false);
        setTranscript('');
      }, 2000);
      
    } catch (error) {
      setError('Failed to process voice search. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening || isSearching) return;

    setError(null);
    setTranscript('');
    
    try {
      recognitionRef.current.start();
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
      }, 10000);
      
    } catch (error) {
      setError('Failed to start voice recognition. Please try again.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearError = () => {
    setError(null);
    setShowTranscript(false);
    setTranscript('');
  };

  if (!isSupported) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <MicOff className="w-5 h-5" />
        <span className="text-sm">Voice search not supported</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Voice Button */}
      <button
        onClick={handleMicClick}
        disabled={isSearching || isProcessing}
        className={`relative p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : isProcessing
            ? 'bg-walmart-blue text-white'
            : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-walmart-blue'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice search'}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isListening ? (
          <Mic className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
        
        {/* Recording indicator */}
        {isListening && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        )}
      </button>

      {/* Transcript Display */}
      {showTranscript && (transcript || isListening || isProcessing) && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 min-w-80 max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-walmart-blue" />
                <span className="font-semibold text-gray-800">
                  {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Voice Search'}
                </span>
              </div>
              <button
                onClick={clearError}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ×
              </button>
            </div>

            {/* Status Indicator */}
            <div className="mb-4">
              {isListening && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Listening for your voice...</span>
                </div>
              )}
              
              {isProcessing && (
                <div className="flex items-center space-x-2 text-walmart-blue">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing your request...</span>
                </div>
              )}
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="mb-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed">
                    "{transcript}"
                  </p>
                  {confidence > 0 && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-walmart-blue h-1 rounded-full transition-all duration-300"
                          style={{ width: `${confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(confidence * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            {isListening && !transcript && (
              <div className="text-center">
                <div className="mb-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-full flex items-center justify-center">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Try saying something like:
                </p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>"Find a yellow top under $15"</p>
                  <p>"Show me Samsung TVs"</p>
                  <p>"Coffee maker with good reviews"</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isListening && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={stopListening}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-50">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg max-w-sm">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium mb-1">Voice Search Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 transition-colors duration-200"
              >
                ×
              </button>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => {
                  clearError();
                  startListening();
                }}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
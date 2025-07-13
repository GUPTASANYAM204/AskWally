import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceAssistantProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onSearch, isSearching }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

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
            onSearch(finalTranscript.trim());
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }
  }, [onSearch]);


  const startListening = async () => {
    if (!recognitionRef.current || isListening || isSearching) return;

    setError(null);
    setTranscript('');
    
    try {
      // Check if getUserMedia is supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // First, request microphone access
        await navigator.mediaDevices.getUserMedia({ audio: true })
          .then(function(stream) {
            console.log("Microphone access granted");
            // Stop the stream as we just needed permission
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(function(err) {
            console.error("Microphone access denied:", err);
            throw new Error('Microphone access denied. Please allow microphone permissions and try again.');
          });
      } else {
        console.warn("getUserMedia not supported");
      }

      // Now start speech recognition
      recognitionRef.current.start();
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
      }, 10000);
      
          } catch (error) {
        if (error instanceof Error && error.message.includes('Microphone access denied')) {
          setError(error.message);
        } else {
          setError('Failed to start voice recognition. Please try again.');
        }
      }
    };

    const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      {/* Voice Button with 3D Effects */}
      <motion.button
        type="button"
        onClick={isListening ? stopListening : startListening}
        disabled={isSearching}
        className={`relative p-3 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed perspective-1000 transform-gpu ${
          isListening
            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl'
            : 'bg-gradient-to-br from-walmart-blue to-walmart-blue-dark text-white shadow-xl hover:shadow-2xl'
        }`}
        whileHover={{ 
          scale: 1.1,
          rotateY: 10,
          boxShadow: isListening 
            ? '0 15px 35px rgba(239,68,68,0.4)' 
            : '0 15px 35px rgba(0,76,145,0.4)'
        }}
        whileTap={{ scale: 0.9 }}
        animate={isListening ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            '0 10px 25px rgba(239,68,68,0.3)',
            '0 20px 40px rgba(239,68,68,0.5)',
            '0 10px 25px rgba(239,68,68,0.3)'
          ]
        } : {}}
        transition={isListening ? {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={isListening ? {
            background: [
              'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)',
              'linear-gradient(135deg, rgba(255,255,255,0.2), transparent)',
              'linear-gradient(225deg, rgba(255,255,255,0.1), transparent)',
              'linear-gradient(315deg, rgba(255,255,255,0.2), transparent)',
              'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Icon with 3D Animation */}
        <motion.div
          className="relative z-10"
          animate={isListening ? {
            rotateY: [0, 360],
            scale: [1, 1.2, 1]
          } : {}}
          transition={isListening ? {
            rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          } : {}}
        >
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
              </motion.div>
            ) : isListening ? (
              <motion.div
                key="listening"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <MicOff className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Mic className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pulse Effect for Listening State */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-red-400"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ 
                scale: [1, 1.5, 2],
                opacity: [1, 0.5, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Voice Feedback Tooltip */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap backdrop-blur-sm"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Volume2 className="w-4 h-4 text-red-400" />
              </motion.div>
              <span>Listening...</span>
              {/* Audio Visualizer */}
              <div className="flex items-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-red-400 rounded-full"
                    animate={{
                      height: [4, 12, 4],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Transcript Preview */}
            {transcript && (
              <motion.div
                className="mt-2 text-xs text-gray-300 max-w-48 truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                "{transcript}"
              </motion.div>
            )}

            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confidence Indicator */}
      <AnimatePresence>
        {confidence > 0 && !isListening && (
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(confidence * 100)}% confident
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
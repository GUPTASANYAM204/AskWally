import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User,
  Loader2,
  Volume2
} from 'lucide-react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface WallyAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onVoiceActivation?: () => void;
}

export const WallyAssistant: React.FC<WallyAssistantProps> = ({
  isOpen,
  onToggle,
  onVoiceActivation
}) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Wally, your AI shopping assistant. How can I help you find what you're looking for today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Initialize speech recognition
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
          setError(null);
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
          setTranscript(currentTranscript);
          setInputText(currentTranscript);

          if (finalTranscript) {
            handleSendMessage(finalTranscript.trim());
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setError('Voice recognition failed. Please try again.');
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        };
      }
    }
  }, []);

  // Voice activation listener for "Hey Wally"
  useEffect(() => {
    const handleVoiceActivation = () => {
      if (onVoiceActivation) {
        onVoiceActivation();
      }
    };

    // Listen for "Hey Wally" trigger
    const checkForHeyWally = (text: string) => {
      const lowerText = text.toLowerCase();
      if (lowerText.includes('hey wally') || lowerText.includes('hello wally')) {
        handleVoiceActivation();
        return true;
      }
      return false;
    };

    if (recognitionRef.current) {
      const originalOnResult = recognitionRef.current.onresult;
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
        
        // Check for "Hey Wally" trigger
        if (!isOpen && checkForHeyWally(currentTranscript)) {
          return;
        }

        // Continue with normal processing if chat is open
        if (isOpen) {
          setTranscript(currentTranscript);
          setInputText(currentTranscript);

          if (finalTranscript) {
            handleSendMessage(finalTranscript.trim());
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = recognitionRef.current.onresult;
      }
    };
  }, [isOpen, onVoiceActivation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const startListening = async () => {
    if (!recognitionRef.current || isListening || isProcessing) return;

    setError(null);
    setTranscript('');
    
    try {
      // Check if getUserMedia is supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true })
          .then(function(stream) {
            console.log("Microphone access granted");
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(function(err) {
            console.error("Microphone access denied:", err);
            throw new Error('Microphone access denied. Please allow microphone permissions and try again.');
          });
      }

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

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setTranscript('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! I'm here to help you find the best products at Walmart. What are you looking for today?";
    }
    
    if (lowerInput.includes('product') || lowerInput.includes('item') || lowerInput.includes('find')) {
      return "I can help you find products! Try searching for specific items like 'electronics', 'groceries', or 'clothing'. You can also use voice commands to search.";
    }
    
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('expensive')) {
      return "I can help you find the best prices! Walmart offers competitive pricing and daily deals. Would you like me to show you today's special offers?";
    }
    
    if (lowerInput.includes('location') || lowerInput.includes('store') || lowerInput.includes('near me')) {
      return "I can help you find Walmart stores near you! Use the store map feature to locate the closest Walmart and check product availability.";
    }
    
    if (lowerInput.includes('thank')) {
      return "You're welcome! I'm here to make your shopping experience easier. Is there anything else I can help you with?";
    }
    
    return "I understand you're looking for something. I can help you search for products, find store locations, check prices, and more. What specific item or category are you interested in?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  if (!isSupported || isLandingPage) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={onToggle}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Wally Assistant</h3>
                  <p className="text-xs text-white/80">AI Shopping Helper</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[350px]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-walmart-blue text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'assistant' && (
                        <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isProcessing && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="px-4 py-2 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent"
                    disabled={isProcessing}
                  />
                  {transcript && (
                    <div className="absolute -top-8 left-0 right-0 bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm text-blue-800">
                      <Volume2 className="w-3 h-3 inline mr-1" />
                      {transcript}
                    </div>
                  )}
                </div>
                
                {/* Voice Button */}
                <motion.button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={!isProcessing ? { scale: 1.1 } : {}}
                  whileTap={!isProcessing ? { scale: 0.9 } : {}}
                  animate={isListening ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 rgba(239,68,68,0)',
                      '0 0 0 8px rgba(239,68,68,0.3)',
                      '0 0 0 0 rgba(239,68,68,0)'
                    ]
                  } : {}}
                  transition={isListening ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </motion.button>
                
                {/* Send Button */}
                <motion.button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    inputText.trim() && !isProcessing
                      ? 'bg-walmart-blue text-white hover:bg-walmart-blue-dark'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={inputText.trim() && !isProcessing ? { scale: 1.1 } : {}}
                  whileTap={inputText.trim() && !isProcessing ? { scale: 0.9 } : {}}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}; 
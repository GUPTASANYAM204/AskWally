import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  User,
  Volume2,
  ShoppingCart,
  Heart,
  ExternalLink
} from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { ProductProcessor } from '../services/productProcessor';
import { LocalProductSearch } from '../services/localProductSearch';
import { ProcessedProduct } from '../types/Product';

// Import both raw data for processing and processed data as fallback
import { rawWalmartProducts } from '../data/mockProducts';
import { Product } from '../types/Product';

// Process the products once when component loads with error handling
let processedProducts: ProcessedProduct[] = [];
let productSearch: LocalProductSearch;

// Initialize with error handling
function initializeProducts() {
  try {
    // Process the raw Walmart data
    if (Array.isArray(rawWalmartProducts) && rawWalmartProducts.length > 0) {
      console.log(`Processing ${rawWalmartProducts.length} raw products...`);
      return ProductProcessor.processProducts(rawWalmartProducts);
    } else {
      console.warn('No raw products data available');
      return [];
    }
  } catch (error) {
    console.error('Error processing products data:', error);
    return [];
  }
}

processedProducts = initializeProducts();
productSearch = new LocalProductSearch(processedProducts);
console.log(`Initialized with ${processedProducts.length} products`);

// Updated Message interface to use ProcessedProduct
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  products?: ProcessedProduct[]; // Updated to use ProcessedProduct
  action?: string;
}

interface WallyAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onVoiceActivation?: () => void;
  addToCart?: (product: any) => void; // Made more flexible
  addToWishlist?: (product: any) => void;
  currentProduct?: any; // Made more flexible
}

export const WallyAssistant: React.FC<WallyAssistantProps> = ({
  isOpen,
  onToggle,
  onVoiceActivation,
  addToCart,
  addToWishlist,
  currentProduct
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLandingPage = location.pathname === '/';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Wally, your AI shopping assistant! I can help you find products, compare items, and answer your shopping questions. What are you looking for today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  // Set to connected since we're using local data
  const [connectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('connected');
  const [apiError, setApiError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the voice recognition hook
  const {
    isListening,
    isSupported,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    clearError,
    clearTranscript
  } = useVoiceRecognition({
    continuous: false,
    interimResults: true,
    onResult: (transcript, isFinal) => {
      setInputText(transcript);
      if (isFinal) {
        handleSendMessage(transcript.trim());
      }
    },
    onError: (error) => {
      console.error('Voice recognition error:', error);
    }
  });

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

  // Clear voice error when user starts typing
  useEffect(() => {
    if (inputText && voiceError) {
      clearError();
    }
  }, [inputText, voiceError, clearError]);

  // Helper function to check if message is asking for products
  const isProductSearchQuery = (message: string): boolean => {
    const productKeywords = [
      'show me', 'find', 'search', 'looking for', 'need', 'want', 'buy',
      'eyeshadow', 'makeup', 'beauty', 'cosmetics', 'laura mercier',
      'under', 'price', 'cheap', 'expensive', 'dollar', '$', 'category',
      'brand', 'product', 'item', 'clothing', 'electronics', 'food'
    ];
    
    const lowerMessage = message.toLowerCase();
    return productKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const generateGeneralResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help you find products. Try asking me something like 'show me eyeshadow under $30' or 'find Laura Mercier products'!";
    }
    
    if (lowerMessage.includes('help')) {
      return "I can help you find products! Try these examples:\n• 'Show me eyeshadow under $30'\n• 'Find Laura Mercier products'\n• 'I need beauty products'\n• 'What makeup do you have?'";
    }

    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you find today? 😊";
    }
    
    return "I'm here to help you find products! Try asking me about specific items, brands, categories, or price ranges. For example, 'show me makeup under $25' or 'find beauty products'.";
  };

  // Updated handleSendMessage to use backend API with Ollama
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
    clearTranscript();
    setIsProcessing(true);
    setApiError(null);

    try {
      // Call the backend API
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          context: {
            currentUrl: location.pathname,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API call failed');
      }

      // Process the API response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'assistant',
        timestamp: new Date(),
        products: data.products || [], // Include products if returned
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error calling backend API:', error);
      setApiError(error instanceof Error ? error.message : 'Unknown error');
      
      // Fallback to local search on API failure
      try {
        const isProductQuery = isProductSearchQuery(text);
        let fallbackResponse = '';
        let fallbackProducts: ProcessedProduct[] = [];

        if (isProductQuery) {
          fallbackProducts = productSearch.searchProducts(text);
          fallbackResponse = productSearch.generateAIResponse(text, fallbackProducts);
        } else {
          fallbackResponse = generateGeneralResponse(text);
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: fallbackResponse + " (Using local search - backend unavailable)",
          sender: 'assistant',
          timestamp: new Date(),
          products: fallbackProducts.slice(0, 10),
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (fallbackError) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I encountered an error while processing your request. Please try again!",
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsProcessing(false);
    }
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

  const handleVoiceToggle = async () => {
    if (isListening) {
      stopListening();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        startListening(10000); // 10 second timeout
      } catch (error) {
        console.error('Microphone permission denied:', error);
      }
    }
  };

  // Updated to handle ProcessedProduct
  const handleProductAction = (product: ProcessedProduct, action: 'cart' | 'wishlist' | 'view') => {
    switch (action) {
      case 'cart':
        if (addToCart) {
          // Convert ProcessedProduct to format expected by addToCart
          const cartProduct = {
            id: product.id,
            name: product.name,
            image: product.image,
            brand: product.brand,
            price: product.price,
            description: product.description,
            category: product.category,
            rating: product.rating
          };
          addToCart(cartProduct);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: `Added "${product.name}" to your cart! 🛒`,
            sender: 'assistant',
            timestamp: new Date()
          }]);
        }
        break;
      case 'wishlist':
        if (addToWishlist) {
          const wishlistProduct = {
            id: product.id,
            name: product.name,
            image: product.image,
            brand: product.brand,
            price: product.price
          };
          addToWishlist(wishlistProduct);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: `Added "${product.name}" to your wishlist! 💝`,
            sender: 'assistant',
            timestamp: new Date()
          }]);
        }
        break;
      case 'view':
        // Open product URL in new tab since these are Walmart URLs
        window.open(product.url, '_blank');
        break;
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
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark text-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-6 h-6" />
            {/* Always show connected since we use local data */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
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
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[450px]">
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
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        
                        {/* Display products if any */}
                        {message.products && message.products.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.products.slice(0, 3).map((product) => (
                              <div
                                key={product.id}
                                className="bg-white border rounded-lg p-2 text-gray-800 cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleProductAction(product, 'view')}
                              >
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder-product.jpg';
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {product.brand} • ${product.price.toFixed(2)}
                                    </p>
                                    {product.rating > 0 && (
                                      <p className="text-xs text-yellow-600">
                                        ⭐ {product.rating}/5 ({product.reviewCount} reviews)
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductAction(product, 'cart');
                                      }}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                      title="Add to Cart"
                                    >
                                      <ShoppingCart className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductAction(product, 'wishlist');
                                      }}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      title="Add to Wishlist"
                                    >
                                      <Heart className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductAction(product, 'view');
                                      }}
                                      className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                      title="View on Walmart"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                                                        {/* Show "View All" if there are more products */}
                            {message.products.length > 3 && (
                              <button
                                onClick={() => {
                                  // Navigate to products page with search results
                                  navigate('/products', { 
                                    state: { 
                                      searchResults: message.products,
                                      searchQuery: message.text 
                                    }
                                  });
                                }}
                                className="w-full py-2 text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                View All {message.products.length} Products →
                              </button>
                            )}
                          </div>
                        )}
                        
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

            {/* Error Messages */}
            <AnimatePresence>
              {(voiceError || apiError) && (
                <motion.div
                  className="px-4 py-2 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {voiceError || apiError}
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
                    placeholder="Ask me about products... (e.g., 'show me eyeshadow under $30')"
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
                  onClick={handleVoiceToggle}
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
              
              {/* Quick suggestions for better UX */}
              {messages.length === 1 && !isProcessing && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "Show me eyeshadow under $30",
                    "Find Laura Mercier products",
                    "Beauty products on sale",
                    "Makeup with high ratings"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Data info for transparency */}
              <div className="mt-2 text-xs text-gray-500 text-center">
                💡 Searching through {processedProducts.length} products locally
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
                            
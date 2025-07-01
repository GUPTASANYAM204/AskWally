import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Loader2, 
  ShoppingCart, 
  Heart, 
  ExternalLink,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useWally } from '../contexts/WallyContext';
import { useWallyVoice } from '../hooks/useWallyVoice';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { wallyService } from '../services/wallyService';
import type { Product } from '../data/mockProducts';

export const WallyAssistant: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isOpen,
    isProcessing,
    messages,
    currentProduct,
    lastViewedProduct,
    conversationContext,
    toggleAssistant,
    closeAssistant,
    addMessage,
    updateMessage,
    startProcessing,
    stopProcessing,
    updateContext
  } = useWally();

  const { addItem, openCart } = useCart();
  const { addToWishlist } = useWishlist();
  
  const [textInput, setTextInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  const {
    isListening,
    isSupported,
    transcript,
    error: voiceError,
    isWakeWordListening,
    startListening,
    stopListening,
    startWakeWordListening,
    stopWakeWordListening,
    clearTranscript
  } = useWallyVoice({
    onResult: (transcript, isFinal) => {
      if (isFinal && transcript.trim()) {
        handleUserInput(transcript.trim(), true);
        clearTranscript();
      }
    },
    onError: (error) => {
      console.error('Voice error:', error);
    },
    enabled: !isHomePage // Only enable wake word listening when not on home page
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus text input when assistant opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const handleUserInput = async (input: string, isVoice = false) => {
    if (!input.trim()) return;

    // Check for navigation commands first
    const navigationResult = handleNavigationCommands(input.toLowerCase());
    if (navigationResult) {
      addMessage({
        type: 'user',
        content: input,
      });
      addMessage({
        type: 'assistant',
        content: navigationResult,
      });
      return;
    }

    // Add user message
    addMessage({
      type: 'user',
      content: input,
    });

    // Add typing indicator
    const typingMessageId = Date.now().toString() + '_typing';
    addMessage({
      type: 'assistant',
      content: '',
      isTyping: true,
    });

    startProcessing();

    try {
      // Process with Wally service
      const response = await wallyService.processUserInput(
        input,
        {
          currentProduct,
          lastViewedProduct,
          ...conversationContext
        },
        addToWishlist,
        addItem,
        navigate
      );

      // Remove typing indicator
      updateMessage(typingMessageId, { isTyping: false });

      // Add assistant response
      addMessage({
        type: 'assistant',
        content: response.message,
        products: response.products,
      });

      // Update conversation context
      updateContext({
        lastQuery: input,
        lastAction: response.action,
        lastProducts: response.products,
      });

    } catch (error) {
      console.error('Error processing user input:', error);
      
      // Remove typing indicator and add error message
      updateMessage(typingMessageId, { isTyping: false });
      addMessage({
        type: 'assistant',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
      });
    } finally {
      stopProcessing();
    }
  };

  const handleNavigationCommands = (input: string): string | null => {
    if (input.includes('navigate') || input.includes('go to') || input.includes('take me to') || input.includes('open')) {
      if (input.includes('store map') || input.includes('map')) {
        navigate('/store-map');
        return "I'll take you to the store map! 🗺️";
      }
      if (input.includes('cart') || input.includes('shopping cart')) {
        openCart(); // Open the cart drawer
        return "I'll show you your shopping cart! 🛒";
      }
      if (input.includes('wishlist') || input.includes('wish list')) {
        navigate('/wishlist');
        return "I'll take you to your wishlist! 💝";
      }
      if (input.includes('products') || input.includes('shop')) {
        navigate('/products');
        return "I'll take you to the products page! 🛍️";
      }
      if (input.includes('home') || input.includes('main page')) {
        navigate('/');
        return "I'll take you back to the home page! 🏠";
      }
      if (input.includes('profile') || input.includes('account')) {
        navigate('/profile');
        return "I'll take you to your profile! 👤";
      }
    }
    return null;
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserInput(textInput.trim());
      setTextInput('');
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(10000); // 10 second timeout
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    updateContext({ currentProduct: product });
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    addMessage({
      type: 'assistant',
      content: `Added "${product.name}" to your cart! 🛒`,
    });
  };

  const handleAddToWishlist = (product: Product) => {
    addToWishlist({
      id: product.id,
      name: product.name,
      image: product.image,
      brand: product.brand,
      price: product.price,
    });
    addMessage({
      type: 'assistant',
      content: `Added "${product.name}" to your wishlist! 💝`,
    });
  };

  // Don't render Wally assistant on home page
  if (isHomePage) {
    return null;
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleAssistant}
          className="w-16 h-16 bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
          title="Open Wally Assistant"
        >
          <div className="relative">
            <MessageCircle className="w-8 h-8" />
            {isWakeWordListening && (
              <>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                {/* Ripple effect only when wake word is active */}
                <div className="absolute inset-0 rounded-full bg-walmart-blue opacity-30 animate-ping"></div>
              </>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-walmart-blue to-walmart-blue-dark text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Wally</h3>
              <p className="text-xs opacity-90">AI Shopping Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title={isMinimized ? 'Maximize' : 'Minimize'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={closeAssistant}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-walmart-blue to-walmart-blue-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Hi! I'm Wally 👋</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Your AI shopping assistant. I can help you find products, navigate the store, and more!
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Try saying: "Find a black laptop under $500"</p>
                    <p>Or: "Navigate me to store map"</p>
                    <p>Wake word: "Hey Wally"</p>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-walmart-blue text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Wally is thinking...</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {message.content}
                        </p>
                        
                        {/* Product Cards */}
                        {message.products && message.products.length > 0 && (
                          <div className="mt-3 space-y-3">
                            {message.products.map((product) => (
                              <div
                                key={product.id}
                                className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm"
                              >
                                <div className="flex items-start space-x-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                                      {product.name}
                                    </h5>
                                    <p className="text-xs text-gray-600 mb-1">{product.brand}</p>
                                    <p className="text-lg font-bold text-walmart-blue">
                                      ${product.price}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                      <button
                                        onClick={() => handleProductClick(product)}
                                        className="flex items-center space-x-1 text-xs bg-walmart-blue text-white px-2 py-1 rounded-lg hover:bg-walmart-blue-dark transition-colors duration-200"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>View</span>
                                      </button>
                                      <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex items-center space-x-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                      >
                                        <ShoppingCart className="w-3 h-3" />
                                        <span>Cart</span>
                                      </button>
                                      <button
                                        onClick={() => handleAddToWishlist(product)}
                                        className="flex items-center space-x-1 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                      >
                                        <Heart className="w-3 h-3" />
                                        <span>Save</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              {/* Voice transcript display */}
              {isListening && transcript && (
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🎤 "{transcript}"
                  </p>
                </div>
              )}

              {/* Voice error display */}
              {voiceError && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{voiceError}</p>
                </div>
              )}

              <form onSubmit={handleTextSubmit} className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={textInputRef}
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Ask Wally anything..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-walmart-blue pr-12"
                    disabled={isProcessing}
                  />
                  {isSupported && (
                    <button
                      type="button"
                      onClick={handleVoiceToggle}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors duration-200 ${
                        isListening
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={!textInput.trim() || isProcessing}
                  className="p-3 bg-walmart-blue text-white rounded-xl hover:bg-walmart-blue-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>

              {/* Status indicators */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  {isWakeWordListening && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Listening for "Hey Wally"</span>
                    </div>
                  )}
                  {isListening && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span>Recording...</span>
                    </div>
                  )}
                </div>
                <span>Powered by Gemini AI</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
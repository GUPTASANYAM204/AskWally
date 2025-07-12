import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import type { Product } from '../data/mockProducts';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: Product[];
  isTyping?: boolean;
}

export interface WallyState {
  isOpen: boolean;
  isListening: boolean;
  isProcessing: boolean;
  messages: ChatMessage[];
  currentProduct: Product | null;
  lastViewedProduct: Product | null;
  comparisonProducts: Product[];
  conversationContext: any;
  wakeWordEnabled: boolean;
}

type WallyAction =
  | { type: 'TOGGLE_ASSISTANT' }
  | { type: 'OPEN_ASSISTANT' }
  | { type: 'CLOSE_ASSISTANT' }
  | { type: 'START_LISTENING' }
  | { type: 'STOP_LISTENING' }
  | { type: 'START_PROCESSING' }
  | { type: 'STOP_PROCESSING' }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<ChatMessage> } }
  | { type: 'SET_CURRENT_PRODUCT'; payload: Product | null }
  | { type: 'SET_LAST_VIEWED_PRODUCT'; payload: Product | null }
  | { type: 'SET_COMPARISON_PRODUCTS'; payload: Product[] }
  | { type: 'UPDATE_CONTEXT'; payload: any }
  | { type: 'CLEAR_CHAT' }
  | { type: 'TOGGLE_WAKE_WORD' };

const wallyReducer = (state: WallyState, action: WallyAction): WallyState => {
  switch (action.type) {
    case 'TOGGLE_ASSISTANT':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_ASSISTANT':
      return { ...state, isOpen: true };
    case 'CLOSE_ASSISTANT':
      return { ...state, isOpen: false };
    case 'START_LISTENING':
      return { ...state, isListening: true };
    case 'STOP_LISTENING':
      return { ...state, isListening: false };
    case 'START_PROCESSING':
      return { ...state, isProcessing: true };
    case 'STOP_PROCESSING':
      return { ...state, isProcessing: false };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload.updates } : msg
        )
      };
    case 'SET_CURRENT_PRODUCT':
      return { ...state, currentProduct: action.payload };
    case 'SET_LAST_VIEWED_PRODUCT':
      return { ...state, lastViewedProduct: action.payload };
    case 'SET_COMPARISON_PRODUCTS':
      return { ...state, comparisonProducts: action.payload };
    case 'UPDATE_CONTEXT':
      return { ...state, conversationContext: { ...state.conversationContext, ...action.payload } };
    case 'CLEAR_CHAT':
      return { ...state, messages: [], conversationContext: {} };
    case 'TOGGLE_WAKE_WORD':
      return { ...state, wakeWordEnabled: !state.wakeWordEnabled };
    default:
      return state;
  }
};

const initialState: WallyState = {
  isOpen: false,
  isListening: false,
  isProcessing: false,
  messages: [],
  currentProduct: null,
  lastViewedProduct: null,
  comparisonProducts: [],
  conversationContext: {},
  wakeWordEnabled: true,
};

interface WallyContextType extends WallyState {
  toggleAssistant: () => void;
  openAssistant: () => void;
  closeAssistant: () => void;
  startListening: () => void;
  stopListening: () => void;
  startProcessing: () => void;
  stopProcessing: () => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLastViewedProduct: (product: Product | null) => void;
  setComparisonProducts: (products: Product[]) => void;
  updateContext: (context: any) => void;
  clearChat: () => void;
  toggleWakeWord: () => void;
  processUserInput: (input: string, isVoice?: boolean) => Promise<void>;
}

const WallyContext = createContext<WallyContextType | undefined>(undefined);

export const WallyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wallyReducer, initialState);

  const toggleAssistant = () => dispatch({ type: 'TOGGLE_ASSISTANT' });
  const openAssistant = () => dispatch({ type: 'OPEN_ASSISTANT' });
  const closeAssistant = () => dispatch({ type: 'CLOSE_ASSISTANT' });
  const startListening = () => dispatch({ type: 'START_LISTENING' });
  const stopListening = () => dispatch({ type: 'STOP_LISTENING' });
  const startProcessing = () => dispatch({ type: 'START_PROCESSING' });
  const stopProcessing = () => dispatch({ type: 'STOP_PROCESSING' });
  const setCurrentProduct = (product: Product | null) => dispatch({ type: 'SET_CURRENT_PRODUCT', payload: product });
  const setLastViewedProduct = (product: Product | null) => dispatch({ type: 'SET_LAST_VIEWED_PRODUCT', payload: product });
  const setComparisonProducts = (products: Product[]) => dispatch({ type: 'SET_COMPARISON_PRODUCTS', payload: products });
  const updateContext = (context: any) => dispatch({ type: 'UPDATE_CONTEXT', payload: context });
  const clearChat = () => dispatch({ type: 'CLEAR_CHAT' });
  const toggleWakeWord = () => dispatch({ type: 'TOGGLE_WAKE_WORD' });

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const fullMessage: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: fullMessage });
  };

  const updateMessage = (id: string, updates: Partial<ChatMessage>) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: { id, updates } });
  };

  const processUserInput = async (input: string, isVoice = false) => {
    // This will be implemented in the WallyService
    console.log('Processing user input:', input, 'isVoice:', isVoice);
  };

  const contextValue = useMemo(() => ({
    ...state,
    toggleAssistant,
    openAssistant,
    closeAssistant,
    startListening,
    stopListening,
    startProcessing,
    stopProcessing,
    addMessage,
    updateMessage,
    setCurrentProduct,
    setLastViewedProduct,
    setComparisonProducts,
    updateContext,
    clearChat,
    toggleWakeWord,
    processUserInput,
  }), [
    state,
    toggleAssistant,
    openAssistant,
    closeAssistant,
    startListening,
    stopListening,
    startProcessing,
    stopProcessing,
    addMessage,
    updateMessage,
    setCurrentProduct,
    setLastViewedProduct,
    setComparisonProducts,
    updateContext,
    clearChat,
    toggleWakeWord,
    processUserInput,
  ]);

  return (
    <WallyContext.Provider value={contextValue}>
      {children}
    </WallyContext.Provider>
  );
};

export const useWally = () => {
  const context = useContext(WallyContext);
  if (context === undefined) {
    throw new Error('useWally must be used within a WallyProvider');
  }
  return context;
};
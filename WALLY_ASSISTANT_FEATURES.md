# Wally Assistant - AI Shopping Chatbot

## Overview
Wally Assistant is an AI-powered shopping chatbot that helps users find products, get information about prices, locate stores, and more. The chatbot is available on all pages except the landing page.

## Features

### 🎯 Activation Methods
1. **Floating Button**: Click the floating chat button in the bottom-right corner
2. **Voice Activation**: Say "Hey Wally" or "Hello Wally" to open the chat

### 🎤 Voice Recognition
- **Microphone Button**: Click the microphone icon in the chat input to start voice input
- **Real-time Transcription**: See your speech converted to text in real-time
- **Auto-submission**: Voice input is automatically sent when you finish speaking
- **Error Handling**: Clear error messages for microphone permission issues

### 💬 Chat Interface
- **Modern UI**: Clean, modern chat interface with smooth animations
- **Message History**: View conversation history with timestamps
- **Typing Indicators**: Visual feedback when the assistant is processing
- **Auto-scroll**: Automatically scrolls to the latest message

### 🤖 AI Responses
The assistant can help with:
- **Product Search**: Find specific items or categories
- **Price Information**: Get information about pricing and deals
- **Store Locations**: Find Walmart stores near you
- **General Help**: Answer questions about shopping and services

### 🎨 Visual Design
- **Walmart Branding**: Uses official Walmart blue and yellow colors
- **Smooth Animations**: Framer Motion animations for a polished experience
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper focus management and keyboard navigation

## Technical Implementation

### Components
- `WallyAssistant.tsx`: Main chatbot component
- `WallyAssistantContext.tsx`: Context for state management
- Integration in `App.tsx`: Global availability across the app

### Voice Recognition
- Uses Web Speech API (`webkitSpeechRecognition`)
- Continuous listening for "Hey Wally" trigger
- Automatic microphone permission handling
- Error recovery and retry mechanisms

### State Management
- Context-based state management
- Persistent chat state across page navigation
- Voice activation state management
- Page-aware behavior (disabled on landing page)

## Usage Examples

### Voice Commands
- "Hey Wally, help me find electronics"
- "Hello Wally, what are today's deals?"
- "Hey Wally, where is the nearest store?"

### Text Commands
- "I'm looking for groceries"
- "What's the price of this item?"
- "Show me clothing options"
- "Thank you for your help"

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Limited support (may need HTTPS)
- Safari: Limited support
- Mobile browsers: Varies by platform

## Security & Privacy
- Voice data is processed locally (no server transmission)
- Microphone permissions are requested explicitly
- No persistent storage of voice data
- Clear error messages for permission issues 
# Wally - AI Shopping Assistant

Wally is a conversational AI assistant powered by Google's Gemini Flash API, integrated into the AskWally shopping app. It provides natural language interaction for product search, wishlist management, and shopping assistance.

## Features

### 🎤 Voice & Text Interaction
- **Wake Word Detection**: Say "Hey Wally" anywhere on the site to activate
- **Voice Commands**: Speak naturally to search, add items, or get help
- **Text Input**: Type your queries in the chat interface
- **Multi-turn Conversations**: Maintains context across interactions

### 🛍️ Shopping Capabilities
- **Product Search**: "Find a black laptop under $500"
- **Wishlist Management**: "Add this to my wishlist"
- **Cart Operations**: "Add this to cart"
- **Product Comparison**: "Compare this with similar items"
- **Navigation**: "Open Samsung TV"

### 🧠 AI-Powered Understanding
- **Intent Recognition**: Understands shopping intents and commands
- **Entity Extraction**: Identifies products, colors, prices, brands
- **Context Awareness**: Remembers current and last viewed products
- **Natural Language**: Processes conversational queries

### 🎨 Beautiful UI
- **Floating Assistant**: Always accessible from bottom-right corner
- **Minimizable Chat**: Expandable/collapsible interface
- **Product Cards**: Rich product displays with actions
- **Voice Indicators**: Visual feedback for voice interactions
- **Typing Animations**: Smooth conversation flow

## Setup

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini
3. Copy the API key

### 2. Environment Configuration
1. Copy `.env.example` to `.env`
2. Add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Enable Microphone Permissions
- Allow microphone access when prompted
- Required for voice commands and wake word detection

## Usage

### Activating Wally
- **Click**: Click the floating blue button in bottom-right corner
- **Voice**: Say "Hey Wally" anywhere on the site
- **Auto-listening**: Wally continuously listens for the wake word

### Voice Commands Examples
```
"Hey Wally, find a yellow shirt under $20"
"Add this product to my wishlist"
"Compare this with similar laptops"
"Open Samsung TV"
"Add this to cart"
"Show me electronics under $100"
```

### Text Commands Examples
```
Find budget-friendly headphones
Add to wishlist
Compare with alternatives
What can you help me with?
Show me the best rated products
```

## Architecture

### Components
- **WallyAssistant**: Main chat interface component
- **WallyContext**: Global state management for conversations
- **WallyProductTracker**: Tracks current/viewed products
- **useWallyVoice**: Voice recognition hook with wake word detection

### Services
- **GeminiService**: Handles Gemini API integration
- **WallyService**: Processes user intents and executes actions
- **Voice Recognition**: Web Speech API integration

### Features
- **Context Tracking**: Maintains conversation state and product context
- **Error Handling**: Graceful fallbacks for API failures
- **Responsive Design**: Works on desktop and mobile
- **Accessibility**: Keyboard navigation and screen reader support

## Customization

### Adding New Intents
1. Update `GeminiService.simulateGeminiResponse()` with new intent patterns
2. Add corresponding actions in `WallyService.processUserInput()`
3. Update UI components to handle new response types

### Modifying Wake Word
Change the wake word in `WallyAssistant.tsx`:
```typescript
const { ... } = useWallyVoice({
  wakeWord: 'hey assistant' // Change this
});
```

### Styling
All components use Tailwind CSS classes and follow the app's design system:
- Primary: Walmart blue (`walmart-blue`)
- Secondary: Walmart yellow (`walmart-yellow`)
- Consistent with existing component patterns

## Browser Support

### Voice Features
- Chrome/Edge: Full support
- Firefox: Limited support
- Safari: Basic support
- Mobile: Varies by browser

### Fallbacks
- Text input always available
- Visual indicators for voice status
- Error messages for unsupported features

## Production Considerations

### Security
- Store Gemini API key securely (environment variables)
- Implement rate limiting for API calls
- Add user authentication for personalized features

### Performance
- Implement response caching
- Add request debouncing
- Optimize for mobile networks

### Monitoring
- Track conversation success rates
- Monitor API usage and costs
- Log errors for debugging

## Troubleshooting

### Voice Not Working
1. Check microphone permissions
2. Ensure HTTPS (required for Web Speech API)
3. Try different browsers
4. Check console for errors

### API Errors
1. Verify Gemini API key is correct
2. Check API quotas and billing
3. Monitor network connectivity
4. Review error logs

### Wake Word Issues
1. Speak clearly and at normal volume
2. Ensure quiet environment
3. Try manual activation via button
4. Check browser compatibility

## Future Enhancements

- **Multi-language Support**: Support for Spanish, French, etc.
- **Voice Synthesis**: Text-to-speech responses
- **Advanced Context**: Remember preferences across sessions
- **Integration**: Connect with real Walmart API
- **Analytics**: Conversation insights and optimization
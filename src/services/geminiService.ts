interface GeminiResponse {
  intent: string;
  entities: {
    product?: string;
    color?: string;
    price_range?: string;
    brand?: string;
    category?: string;
  };
  action: string;
  response: string;
  confidence: number;
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor() {
    // In production, this should be stored securely
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key';
  }

  async processQuery(
    userInput: string,
    context: any = {},
    conversationHistory: any[] = []
  ): Promise<GeminiResponse> {
    // For demo purposes, we'll simulate Gemini API responses
    // In production, replace this with actual Gemini API calls
    return this.simulateGeminiResponse(userInput, context);
  }

  private async simulateGeminiResponse(userInput: string, context: any): Promise<GeminiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const lowerInput = userInput.toLowerCase();
    
    // Intent recognition
    let intent = 'search';
    let action = 'search_products';
    let response = '';
    const entities: any = {};

    // Product search intents
    if (lowerInput.includes('find') || lowerInput.includes('search') || lowerInput.includes('show me')) {
      intent = 'search';
      action = 'search_products';
      
      // Extract entities
      if (lowerInput.includes('laptop')) entities.category = 'electronics';
      if (lowerInput.includes('shirt') || lowerInput.includes('top')) entities.category = 'clothing';
      if (lowerInput.includes('black')) entities.color = 'black';
      if (lowerInput.includes('blue')) entities.color = 'blue';
      if (lowerInput.includes('red')) entities.color = 'red';
      if (lowerInput.includes('yellow')) entities.color = 'yellow';
      if (lowerInput.includes('budget') || lowerInput.includes('cheap')) entities.price_range = 'low';
      if (lowerInput.includes('premium') || lowerInput.includes('expensive')) entities.price_range = 'high';
      if (lowerInput.includes('samsung')) entities.brand = 'samsung';
      if (lowerInput.includes('apple')) entities.brand = 'apple';
      if (lowerInput.includes('sony')) entities.brand = 'sony';

      response = `I'll help you find ${entities.color ? entities.color + ' ' : ''}${entities.category || 'products'}${entities.brand ? ' from ' + entities.brand : ''}. Let me search for you!`;
    }
    
    // Wishlist intents
    else if (lowerInput.includes('add to wishlist') || lowerInput.includes('save this') || lowerInput.includes('wishlist')) {
      intent = 'wishlist';
      action = 'add_to_wishlist';
      response = context.currentProduct 
        ? `I'll add "${context.currentProduct.name}" to your wishlist!`
        : context.lastViewedProduct
        ? `I'll add "${context.lastViewedProduct.name}" to your wishlist!`
        : "I don't see a specific product to add. Could you tell me which product you'd like to add to your wishlist?";
    }
    
    // Comparison intents
    else if (lowerInput.includes('compare') || lowerInput.includes('alternative') || lowerInput.includes('similar')) {
      intent = 'compare';
      action = 'compare_products';
      response = context.currentProduct
        ? `I'll find similar products to compare with "${context.currentProduct.name}".`
        : "I'll help you compare products. Which product would you like to compare?";
    }
    
    // Navigation intents
    else if (lowerInput.includes('open') || lowerInput.includes('show product')) {
      intent = 'navigate';
      action = 'open_product';
      
      // Extract product name
      const productMatch = lowerInput.match(/open (.+)|show (.+)/);
      if (productMatch) {
        entities.product = productMatch[1] || productMatch[2];
        response = `I'll open the product page for "${entities.product}".`;
      } else {
        response = "Which product would you like me to open?";
      }
    }
    
    // Cart intents
    else if (lowerInput.includes('add to cart') || lowerInput.includes('buy this')) {
      intent = 'cart';
      action = 'add_to_cart';
      response = context.currentProduct
        ? `I'll add "${context.currentProduct.name}" to your cart!`
        : "Which product would you like to add to your cart?";
    }
    
    // General help
    else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      intent = 'help';
      action = 'show_help';
      response = `Hi! I'm your shopping assistant. I can help you:
      
• Find products: "Find a black laptop under $500"
• Add to wishlist: "Add this to my wishlist"
• Compare products: "Compare this with similar items"
• Add to cart: "Add this to cart"
• Open products: "Open Samsung TV"

What would you like to do?`;
    }
    
    // Greeting
    else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      intent = 'greeting';
      action = 'greet';
      response = "Hello! I'm your AI shopping assistant. How can I help you find the perfect products today?";
    }
    
    // Default fallback
    else {
      intent = 'search';
      action = 'search_products';
      entities.product = userInput;
      response = `I'll search for "${userInput}" in our product catalog.`;
    }

    return {
      intent,
      entities,
      action,
      response,
      confidence: 0.85 + Math.random() * 0.1
    };
  }

  private async callGeminiAPI(prompt: string): Promise<any> {
    // Actual Gemini API implementation would go here
    // This is a placeholder for the real API call
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
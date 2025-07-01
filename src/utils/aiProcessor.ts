// AI Processing utility for voice queries
export interface AIProcessedQuery {
  intent: string;
  category: string;
  filters: {
    color?: string;
    price_max?: number;
    price_min?: number;
    brand?: string;
    rating_min?: number;
    size?: string;
    gender?: string;
  };
  searchTerms: string[];
  confidence: number;
}

export const processVoiceQuery = async (transcript: string): Promise<AIProcessedQuery> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const lowerTranscript = transcript.toLowerCase();
  
  // Extract intent
  let intent = 'search';
  if (lowerTranscript.includes('find') || lowerTranscript.includes('show me') || lowerTranscript.includes('look for')) {
    intent = 'find';
  } else if (lowerTranscript.includes('compare') || lowerTranscript.includes('versus')) {
    intent = 'compare';
  } else if (lowerTranscript.includes('buy') || lowerTranscript.includes('purchase')) {
    intent = 'buy';
  }

  // Extract category
  let category = 'general';
  const categoryKeywords = {
    'clothing': ['shirt', 'top', 'jacket', 'dress', 'pants', 'jeans', 'hoodie', 'clothing', 'apparel', 'wear'],
    'electronics': ['phone', 'laptop', 'tv', 'computer', 'tablet', 'headphones', 'speaker', 'electronics'],
    'food': ['food', 'snacks', 'drink', 'coffee', 'milk', 'fruit', 'grocery'],
    'home': ['coffee maker', 'appliance', 'furniture', 'home', 'kitchen', 'decor'],
    'toys': ['toy', 'toys', 'game', 'games', 'kids', 'children'],
    'health': ['vitamin', 'medicine', 'health', 'beauty', 'skincare'],
    'sports': ['fitness', 'exercise', 'sports', 'outdoor', 'yoga', 'gym']
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
      category = cat;
      break;
    }
  }

  // Extract filters
  const filters: AIProcessedQuery['filters'] = {};

  // Price extraction
  const priceUnderMatch = lowerTranscript.match(/under\s*\$?(\d+)/);
  const priceLessThanMatch = lowerTranscript.match(/less than\s*\$?(\d+)/);
  const priceBelowMatch = lowerTranscript.match(/below\s*\$?(\d+)/);
  
  if (priceUnderMatch) {
    filters.price_max = parseInt(priceUnderMatch[1]);
  } else if (priceLessThanMatch) {
    filters.price_max = parseInt(priceLessThanMatch[1]);
  } else if (priceBelowMatch) {
    filters.price_max = parseInt(priceBelowMatch[1]);
  }

  // Color extraction
  const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange', 'brown'];
  const foundColor = colors.find(color => lowerTranscript.includes(color));
  if (foundColor) {
    filters.color = foundColor;
  }

  // Brand extraction
  const brands = ['samsung', 'apple', 'sony', 'hp', 'nintendo', 'lego', 'coleman'];
  const foundBrand = brands.find(brand => lowerTranscript.includes(brand));
  if (foundBrand) {
    filters.brand = foundBrand;
  }

  // Rating extraction
  if (lowerTranscript.includes('good reviews') || lowerTranscript.includes('highly rated')) {
    filters.rating_min = 4;
  } else if (lowerTranscript.includes('excellent') || lowerTranscript.includes('best rated')) {
    filters.rating_min = 4.5;
  }

  // Size extraction
  const sizeMatch = lowerTranscript.match(/size\s*([smlx]+|\d+)/i);
  if (sizeMatch) {
    filters.size = sizeMatch[1].toUpperCase();
  }

  // Gender extraction
  if (lowerTranscript.includes('men\'s') || lowerTranscript.includes('mens')) {
    filters.gender = 'men';
  } else if (lowerTranscript.includes('women\'s') || lowerTranscript.includes('womens')) {
    filters.gender = 'women';
  } else if (lowerTranscript.includes('kids') || lowerTranscript.includes('children')) {
    filters.gender = 'kids';
  }

  // Extract search terms
  const searchTerms = transcript
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 2)
    .filter(term => !['find', 'show', 'me', 'get', 'buy', 'purchase', 'under', 'over', 'with', 'good', 'reviews'].includes(term));

  // Calculate confidence based on extracted information
  let confidence = 0.7; // Base confidence
  if (Object.keys(filters).length > 0) confidence += 0.1;
  if (category !== 'general') confidence += 0.1;
  if (searchTerms.length > 0) confidence += 0.1;

  return {
    intent,
    category,
    filters,
    searchTerms,
    confidence: Math.min(confidence, 1.0)
  };
};

export const enhanceQueryWithAI = (originalQuery: string, aiProcessed: AIProcessedQuery): string => {
  // Enhance the original query with AI insights
  let enhancedQuery = originalQuery;
  
  // Add category context if detected
  if (aiProcessed.category !== 'general') {
    enhancedQuery = `${aiProcessed.category} ${enhancedQuery}`;
  }
  
  // Add filter context
  const filterParts = [];
  if (aiProcessed.filters.color) filterParts.push(aiProcessed.filters.color);
  if (aiProcessed.filters.price_max) filterParts.push(`under $${aiProcessed.filters.price_max}`);
  if (aiProcessed.filters.brand) filterParts.push(aiProcessed.filters.brand);
  if (aiProcessed.filters.rating_min) filterParts.push('highly rated');
  
  if (filterParts.length > 0) {
    enhancedQuery = `${filterParts.join(' ')} ${enhancedQuery}`;
  }
  
  return enhancedQuery.trim();
};
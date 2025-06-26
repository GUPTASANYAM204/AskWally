export interface ParsedQuery {
  category: string;
  filters: {
    color?: string;
    price_max?: number;
    price_min?: number;
    gender?: string;
    size?: string;
    brand?: string;
    rating_min?: number;
  };
  location?: string;
  intent: string;
}

export const parseQuery = (query: string): ParsedQuery => {
  const lowerQuery = query.toLowerCase();
  
  // Extract category
  let category = 'general';
  const categoryKeywords = {
    'clothing': ['shirt', 'top', 'jacket', 'coat', 'raincoat', 'dress', 'pants', 'jeans', 'hoodie', 'tank', 'clothing', 'apparel'],
    'electronics': ['phone', 'laptop', 'headphones', 'speaker', 'tv', 'computer', 'tablet', 'gaming', 'console', 'camera', 'electronics'],
    'food': ['snacks', 'food', 'drink', 'coffee', 'tea', 'soda', 'milk', 'banana', 'fruit', 'vegetable', 'grocery'],
    'home': ['coffee maker', 'appliance', 'furniture', 'decor', 'lamp', 'pillow', 'dinnerware', 'kitchen', 'home'],
    'toys': ['toy', 'toys', 'game', 'games', 'gift', 'blocks', 'car', 'educational', 'kids'],
    'health': ['medicine', 'vitamin', 'health', 'beauty', 'skincare', 'toothbrush', 'cream', 'supplement'],
    'sports': ['yoga', 'fitness', 'exercise', 'dumbbell', 'camping', 'tent', 'sports', 'outdoor', 'workout']
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      category = cat;
      break;
    }
  }

  // Extract filters
  const filters: ParsedQuery['filters'] = {};

  // Price extraction
  const priceUnderMatch = lowerQuery.match(/under\s*\$?(\d+)/);
  const priceLessThanMatch = lowerQuery.match(/less than\s*\$?(\d+)/);
  const priceMaxMatch = lowerQuery.match(/max\s*\$?(\d+)/);
  const priceBelowMatch = lowerQuery.match(/below\s*\$?(\d+)/);
  
  if (priceUnderMatch) {
    filters.price_max = parseInt(priceUnderMatch[1]);
  } else if (priceLessThanMatch) {
    filters.price_max = parseInt(priceLessThanMatch[1]);
  } else if (priceMaxMatch) {
    filters.price_max = parseInt(priceMaxMatch[1]);
  } else if (priceBelowMatch) {
    filters.price_max = parseInt(priceBelowMatch[1]);
  }

  // Price minimum extraction
  const priceOverMatch = lowerQuery.match(/over\s*\$?(\d+)/);
  const priceAboveMatch = lowerQuery.match(/above\s*\$?(\d+)/);
  const priceMinMatch = lowerQuery.match(/min\s*\$?(\d+)/);
  
  if (priceOverMatch) {
    filters.price_min = parseInt(priceOverMatch[1]);
  } else if (priceAboveMatch) {
    filters.price_min = parseInt(priceAboveMatch[1]);
  } else if (priceMinMatch) {
    filters.price_min = parseInt(priceMinMatch[1]);
  }

  // Color extraction
  const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange', 'brown', 'gray', 'grey'];
  const foundColor = colors.find(color => lowerQuery.includes(color));
  if (foundColor) {
    filters.color = foundColor;
  }

  // Gender extraction
  if (lowerQuery.includes('men\'s') || lowerQuery.includes('mens') || lowerQuery.includes('male')) {
    filters.gender = 'men';
  } else if (lowerQuery.includes('women\'s') || lowerQuery.includes('womens') || lowerQuery.includes('female')) {
    filters.gender = 'women';
  } else if (lowerQuery.includes('kids') || lowerQuery.includes('children') || lowerQuery.includes('child')) {
    filters.gender = 'kids';
  }

  // Size extraction
  const sizeMatch = lowerQuery.match(/size\s*([smlx]+|\d+)/i);
  if (sizeMatch) {
    filters.size = sizeMatch[1].toUpperCase();
  }

  // Brand extraction
  const brands = ['samsung', 'apple', 'sony', 'hp', 'nintendo', 'hanes', 'lego', 'coleman', 'oral-b', 'olay'];
  const foundBrand = brands.find(brand => lowerQuery.includes(brand));
  if (foundBrand) {
    filters.brand = foundBrand;
  }

  // Rating extraction
  if (lowerQuery.includes('good reviews') || lowerQuery.includes('highly rated') || lowerQuery.includes('4 star')) {
    filters.rating_min = 4;
  } else if (lowerQuery.includes('excellent reviews') || lowerQuery.includes('top rated') || lowerQuery.includes('5 star')) {
    filters.rating_min = 4.5;
  } else if (lowerQuery.includes('best rated') || lowerQuery.includes('highest rated')) {
    filters.rating_min = 4.7;
  }

  // Location extraction
  let location = undefined;
  if (lowerQuery.includes('near me') || lowerQuery.includes('nearby') || lowerQuery.includes('local') || lowerQuery.includes('in store')) {
    location = 'user_location';
  }

  // Intent extraction
  let intent = 'search';
  if (lowerQuery.includes('find') || lowerQuery.includes('show me') || lowerQuery.includes('look for')) {
    intent = 'find';
  } else if (lowerQuery.includes('compare') || lowerQuery.includes('versus') || lowerQuery.includes('vs')) {
    intent = 'compare';
  } else if (lowerQuery.includes('buy') || lowerQuery.includes('purchase') || lowerQuery.includes('order')) {
    intent = 'buy';
  }

  return {
    category,
    filters,
    location,
    intent
  };
};
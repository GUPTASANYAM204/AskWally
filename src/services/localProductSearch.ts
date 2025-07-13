// src/services/localProductSearch.ts
import { ProcessedProduct } from '../types/Product';

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  searchText?: string;
  colors?: string[];
  rating?: number;
}

export class LocalProductSearch {
  private products: ProcessedProduct[];

  constructor(products: ProcessedProduct[]) {
    this.products = products;
  }

  searchProducts(query: string): ProcessedProduct[] {
    const filters = this.parseQuery(query);
    const results = this.filterProducts(filters);
    
    // Sort by relevance: price match first, then rating, then name
    return results.sort((a, b) => {
      // If price filter exists, prioritize products within range
      if (filters.maxPrice) {
        const aInRange = a.price <= filters.maxPrice;
        const bInRange = b.price <= filters.maxPrice;
        if (aInRange && !bInRange) return -1;
        if (!aInRange && bInRange) return 1;
      }
      
      // Then sort by rating (higher first)
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      
      // Then by price (lower first)
      return a.price - b.price;
    });
  }

  private parseQuery(query: string): SearchFilters {
    const lowerQuery = query.toLowerCase();
    const filters: SearchFilters = {};

    // Extract price filters
    const underMatch = lowerQuery.match(/under\s*\$?(\d+)/);
    if (underMatch) {
      filters.maxPrice = parseInt(underMatch[1]);
    }

    const overMatch = lowerQuery.match(/over\s*\$?(\d+)/);
    if (overMatch) {
      filters.minPrice = parseInt(overMatch[1]);
    }

    // Extract categories - map to your actual category structure
    const categoryKeywords = {
      // Beauty categories
      'makeup': ['beauty', 'makeup'],
      'eyeshadow': ['eye shadow', 'eyeshadow', 'eye makeup'],
      'beauty': ['beauty', 'cosmetics'],
      
      // Clothing
      'clothing': ['clothing', 'clothes', 'apparel'],
      'shirt': ['shirt', 'tshirt', 't-shirt'],
      'shoes': ['shoes', 'footwear'],
      
      // Electronics
      'electronics': ['electronics', 'electronic'],
      'phone': ['phone', 'mobile', 'smartphone'],
      'laptop': ['laptop', 'computer'],
      
      // Other categories
      'food': ['food', 'grocery', 'snack'],
      'home': ['home', 'household'],
      'toys': ['toys', 'toy', 'games']
    };

    for (const [key, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        filters.category = key;
        break;
      }
    }

    // Extract brand mentions
    const brands = ['laura mercier', 'apple', 'samsung', 'nike', 'walmart'];
    for (const brand of brands) {
      if (lowerQuery.includes(brand)) {
        filters.brand = brand;
        break;
      }
    }

    // Extract color mentions
    const colors = ['black', 'white', 'red', 'blue', 'green', 'pink', 'purple', 'yellow'];
    const mentionedColors = colors.filter(color => lowerQuery.includes(color));
    if (mentionedColors.length > 0) {
      filters.colors = mentionedColors;
    }

    // Extract rating requirements
    if (lowerQuery.includes('high rated') || lowerQuery.includes('best rated')) {
      filters.rating = 4;
    }

    // Extract search text (remove price and category terms)
    let searchText = query
      .replace(/under\s*\$?\d+/gi, '')
      .replace(/over\s*\$?\d+/gi, '')
      .replace(/show me/gi, '')
      .replace(/find/gi, '')
      .replace(/search/gi, '')
      .replace(/i need/gi, '')
      .replace(/looking for/gi, '')
      .trim();

    if (searchText) {
      filters.searchText = searchText;
    }

    return filters;
  }

  private filterProducts(filters: SearchFilters): ProcessedProduct[] {
    return this.products.filter(product => {
      // Price filters
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;

      // Category filter - check both category and categories array
      if (filters.category) {
        const categoryMatch = 
          product.category.toLowerCase().includes(filters.category) ||
          product.categories.some(cat => cat.toLowerCase().includes(filters.category!));
        
        if (!categoryMatch) return false;
      }

      // Brand filter
      if (filters.brand && !product.brand.toLowerCase().includes(filters.brand.toLowerCase())) {
        return false;
      }

      // Color filter
      if (filters.colors && filters.colors.length > 0) {
        const hasColor = filters.colors.some(color => 
          product.colors.some(productColor => 
            productColor.toLowerCase().includes(color.toLowerCase())
          )
        );
        if (!hasColor) return false;
      }

      // Rating filter
      if (filters.rating && product.rating < filters.rating) {
        return false;
      }

      // Text search in name, description, brand, categories
      if (filters.searchText) {
        const searchFields = [
          product.name,
          product.description,
          product.brand,
          product.category,
          ...product.categories,
          ...product.tags
        ].join(' ').toLowerCase();

        const searchTerms = filters.searchText.toLowerCase().split(' ');
        const hasAllTerms = searchTerms.every(term => 
          term.length > 2 ? searchFields.includes(term) : true
        );
        
        if (!hasAllTerms) return false;
      }

      return true;
    });
  }

  generateAIResponse(query: string, products: ProcessedProduct[]): string {
    if (products.length === 0) {
      return `I couldn't find any products matching "${query}". Try searching for different terms or browse our categories like Beauty, Electronics, or Clothing!`;
    }

    const filters = this.parseQuery(query);
    let response = `Great! I found ${products.length} product${products.length > 1 ? 's' : ''} for you! `;

    if (filters.maxPrice) {
      response += `All items are under $${filters.maxPrice}. `;
    }

    if (filters.category) {
      response += `Here are the best ${filters.category} options `;
    }

    if (products.length > 0) {
      const topProducts = products.slice(0, 3).map(p => 
        `"${p.name}" by ${p.brand} ($${p.price.toFixed(2)})`
      );
      response += `including: ${topProducts.join(', ')}.`;
    }

    if (products.length > 3) {
      response += ` Click "View All" to see all ${products.length} results!`;
    }

    // Add helpful suggestions
    if (products.length > 0) {
      const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
      response += ` 💡 Average price: $${avgPrice.toFixed(2)}`;
      
      if (products.some(p => p.availableForDelivery)) {
        response += ` 🚚 Many items available for delivery!`;
      }
    }

    return response;
  }
}
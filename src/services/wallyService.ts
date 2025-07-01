import { geminiService } from './geminiService';
import { getFilteredProducts, mockProducts } from '../data/mockProducts';
import type { Product } from '../data/mockProducts';

interface WallyServiceResponse {
  message: string;
  products?: Product[];
  action?: string;
  success: boolean;
}

class WallyService {
  async processUserInput(
    input: string,
    context: any,
    addToWishlist?: (product: any) => void,
    addToCart?: (product: Product) => void,
    navigate?: (path: string, state?: any) => void
  ): Promise<WallyServiceResponse> {
    try {
      // Process with Gemini
      const geminiResponse = await geminiService.processQuery(input, context);
      
      let products: Product[] = [];
      let message = geminiResponse.response;
      let success = true;

      // Execute actions based on Gemini's response
      switch (geminiResponse.action) {
        case 'search_products':
          products = await this.searchProducts(geminiResponse.entities);
          if (products.length === 0) {
            message = "I couldn't find any products matching your criteria. Try adjusting your search terms.";
            success = false;
          } else {
            message = `Found ${products.length} products for you!`;
          }
          break;

        case 'add_to_wishlist':
          if (context.currentProduct || context.lastViewedProduct) {
            const product = context.currentProduct || context.lastViewedProduct;
            if (addToWishlist) {
              addToWishlist({
                id: product.id,
                name: product.name,
                image: product.image,
                brand: product.brand,
                price: product.price,
                selectedSize: product.selectedSize,
              });
              message = `Added "${product.name}" to your wishlist! 💝`;
            }
          } else {
            message = "I don't see a specific product to add. Could you tell me which product you'd like to add to your wishlist?";
            success = false;
          }
          break;

        case 'add_to_cart':
          if (context.currentProduct || context.lastViewedProduct) {
            const product = context.currentProduct || context.lastViewedProduct;
            if (addToCart) {
              addToCart(product);
              message = `Added "${product.name}" to your cart! 🛒`;
            }
          } else {
            message = "Which product would you like to add to your cart?";
            success = false;
          }
          break;

        case 'compare_products':
          if (context.currentProduct) {
            products = await this.findSimilarProducts(context.currentProduct);
            message = `Here are some products similar to "${context.currentProduct.name}" for comparison:`;
          } else {
            products = await this.getPopularProducts();
            message = "Here are some popular products you might want to compare:";
          }
          break;

        case 'open_product':
          if (geminiResponse.entities.product) {
            const foundProduct = await this.findProductByName(geminiResponse.entities.product);
            if (foundProduct && navigate) {
              navigate(`/product/${foundProduct.id}`);
              message = `Opening "${foundProduct.name}" for you!`;
            } else {
              message = `I couldn't find a product named "${geminiResponse.entities.product}". Could you be more specific?`;
              success = false;
            }
          }
          break;

        case 'show_help':
          // Message already set by Gemini
          break;

        case 'greet':
          // Message already set by Gemini
          break;

        default:
          products = await this.searchProducts({ product: input });
          if (products.length === 0) {
            message = "I'm not sure how to help with that. Try asking me to find products, add items to your wishlist, or compare products!";
            success = false;
          }
      }

      return {
        message,
        products: products.length > 0 ? products : undefined,
        action: geminiResponse.action,
        success
      };

    } catch (error) {
      console.error('Wally service error:', error);
      return {
        message: "I'm having trouble processing your request right now. Please try again in a moment.",
        success: false
      };
    }
  }

  private async searchProducts(entities: any): Promise<Product[]> {
    const filters: any = {};
    
    if (entities.color) filters.color = entities.color;
    if (entities.brand) filters.brand = entities.brand;
    if (entities.price_range === 'low') filters.price_max = 50;
    if (entities.price_range === 'high') filters.price_min = 200;

    let products = getFilteredProducts(entities.category, filters);

    // If we have a specific product search term, filter by name
    if (entities.product) {
      const searchTerm = entities.product.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    return products.slice(0, 6); // Limit to 6 results for chat display
  }

  private async findSimilarProducts(product: Product): Promise<Product[]> {
    return getFilteredProducts(product.category, {
      color: product.color,
      brand: product.brand !== 'Generic' ? undefined : product.brand // Avoid same brand if generic
    }).filter(p => p.id !== product.id).slice(0, 4);
  }

  private async findProductByName(productName: string): Promise<Product | null> {
    const searchTerm = productName.toLowerCase();
    return mockProducts.find(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    ) || null;
  }

  private async getPopularProducts(): Promise<Product[]> {
    return mockProducts
      .filter(p => p.rating >= 4.5)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 4);
  }
}

export const wallyService = new WallyService();
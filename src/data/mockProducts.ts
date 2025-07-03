export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  brand: string;
  category: string;
  color?: string;
  size?: string[];
  inStock: boolean;
  storeLocation: string;
  aisle: string;
  description: string;
  barcode?: string;
  is_featured?: boolean;
  store_availability?: StoreAvailability[];
}

export interface StoreAvailability {
  store_id: string;
  aisle_number: string;
  section: string;
  shelf_label: string;
  quantity: number;
}

export interface Store {
  store_id: string;
  store_name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  hours: {
    [key: string]: string;
  };
  services: string[];
  layout: {
    total_aisles: number;
    departments: Department[];
    special_areas: SpecialArea[];
  };
}

export interface Department {
  name: string;
  aisles: string[];
  sections: Section[];
}

export interface Section {
  aisle: string;
  section: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface SpecialArea {
  name: string;
  coordinates: {
    x: number;
    y: number;
  };
}

// Import the realistic dataset
import productsData from './products.json';
import fullProductsData from './fullProducts.json';
import storesData from './stores.json';

// Combine all products
const allProductsData = [...productsData, ...fullProductsData];

// Transform the imported data to match our Product interface
export const mockProducts: Product[] = allProductsData.map((product: any) => {
  // Find the primary store location for this product
  const primaryStore = product.store_availability?.[0];
  const store = storesData.find((s: any) => s.store_id === primaryStore?.store_id);
  
  return {
    id: product.id,
    name: product.title,
    price: product.price,
    originalPrice: product.original_price,
    image: product.image_url,
    rating: product.rating,
    reviewCount: Math.floor(Math.random() * 1000) + 50, // Generate review count
    brand: product.brand,
    category: product.category.toLowerCase(),
    color: extractColorFromName(product.title),
    size: generateSizesForCategory(product.category),
    inStock: (primaryStore?.quantity || 0) > 0,
    storeLocation: store?.store_name || 'Walmart Supercenter - Main St',
    aisle: primaryStore?.aisle_number || 'A1',
    description: product.description,
    barcode: product.barcode,
    is_featured: product.is_featured,
    store_availability: product.store_availability
  };
});

// Store data
export const stores: Store[] = storesData as Store[];

// Helper functions
function extractColorFromName(name: string): string | undefined {
  const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange', 'brown', 'gray', 'navy'];
  const lowerName = name.toLowerCase();
  return colors.find(color => lowerName.includes(color));
}

function generateSizesForCategory(category: string): string[] | undefined {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('apparel') || lowerCategory.includes('clothing')) {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  }
  
  if (lowerCategory.includes('shoes') || lowerCategory.includes('footwear')) {
    return ['6', '7', '8', '9', '10', '11', '12'];
  }
  
  return undefined;
}

export const getFilteredProducts = (category?: string, filters?: any): Product[] => {
  let filtered = [...mockProducts];

  if (category && category !== 'general') {
    filtered = filtered.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (filters) {
    if (filters.color) {
      filtered = filtered.filter(product => 
        product.color?.toLowerCase().includes(filters.color.toLowerCase())
      );
    }

    if (filters.price_max) {
      filtered = filtered.filter(product => product.price <= filters.price_max);
    }

    if (filters.price_min) {
      filtered = filtered.filter(product => product.price >= filters.price_min);
    }

    if (filters.rating_min) {
      filtered = filtered.filter(product => product.rating >= filters.rating_min);
    }

    if (filters.brand) {
      filtered = filtered.filter(product => 
        product.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.is_featured) {
      filtered = filtered.filter(product => product.is_featured === true);
    }

    if (filters.store_id) {
      filtered = filtered.filter(product => 
        product.store_availability?.some(store => store.store_id === filters.store_id)
      );
    }
  }

  return filtered;
};

// Get products by store
export const getProductsByStore = (storeId: string): Product[] => {
  return mockProducts.filter(product => 
    product.store_availability?.some(store => store.store_id === storeId)
  );
};

// Get store by ID
export const getStoreById = (storeId: string): Store | undefined => {
  return stores.find(store => store.store_id === storeId);
};

// Get product availability at specific store
export const getProductAvailabilityAtStore = (productId: string, storeId: string): StoreAvailability | undefined => {
  const product = mockProducts.find(p => p.id === productId);
  return product?.store_availability?.find(store => store.store_id === storeId);
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.is_featured === true);
};

// Search products by query
export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  );
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};

// Get all unique categories
export const getCategories = (): string[] => {
  const categories = [...new Set(mockProducts.map(product => product.category))];
  return categories.sort();
};

// Get all unique brands
export const getBrands = (): string[] => {
  const brands = [...new Set(mockProducts.map(product => product.brand))];
  return brands.sort();
};

// Get price range
export const getPriceRange = (): { min: number; max: number } => {
  const prices = mockProducts.map(product => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Get products in specific aisle
export const getProductsInAisle = (storeId: string, aisleNumber: string): Product[] => {
  return mockProducts.filter(product => 
    product.store_availability?.some(store => 
      store.store_id === storeId && store.aisle_number === aisleNumber
    )
  );
};

// Get nearby stores (mock implementation)
export const getNearbyStores = (latitude: number, longitude: number, radiusKm: number = 10): Store[] => {
  // Simple distance calculation (in a real app, you'd use proper geolocation)
  return stores.filter(store => {
    const distance = Math.sqrt(
      Math.pow(store.latitude - latitude, 2) + Math.pow(store.longitude - longitude, 2)
    ) * 111; // Rough conversion to km
    return distance <= radiusKm;
  });
};

export default mockProducts;
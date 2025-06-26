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
}

export const mockProducts: Product[] = [
  // Clothing
  {
    id: '1',
    name: 'Women\'s Bright Yellow Cotton T-Shirt',
    price: 12.99,
    originalPrice: 16.99,
    image: 'https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviewCount: 234,
    brand: 'Hanes',
    category: 'clothing',
    color: 'yellow',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'C7',
    description: 'Comfortable cotton t-shirt in bright yellow, perfect for casual wear. Made from 100% cotton with a relaxed fit.'
  },
  {
    id: '2',
    name: 'Classic Yellow Hoodie Sweatshirt',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.2,
    reviewCount: 156,
    brand: 'Fruit of the Loom',
    category: 'clothing',
    color: 'yellow',
    size: ['S', 'M', 'L', 'XL'],
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'C8',
    description: 'Cozy hoodie sweatshirt in sunny yellow, great for layering. Features a kangaroo pocket and adjustable drawstring hood.'
  },
  {
    id: '3',
    name: 'Lightweight Yellow Rain Jacket',
    price: 19.99,
    originalPrice: 29.99,
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviewCount: 89,
    brand: 'WeatherShield',
    category: 'clothing',
    color: 'yellow',
    size: ['XS', 'S', 'M', 'L'],
    inStock: true,
    storeLocation: 'Walmart Supercenter - Oak Ave',
    aisle: 'D12',
    description: 'Water-resistant rain jacket in bright yellow for visibility and protection. Lightweight and packable design.'
  },
  {
    id: '4',
    name: 'Yellow Tank Top - Summer Collection',
    price: 8.99,
    image: 'https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.1,
    reviewCount: 67,
    brand: 'Summer Basics',
    category: 'clothing',
    color: 'yellow',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'C6',
    description: 'Breathable tank top perfect for hot summer days. Moisture-wicking fabric keeps you cool and comfortable.'
  },
  {
    id: '5',
    name: 'Men\'s Blue Denim Jeans',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviewCount: 342,
    brand: 'Wrangler',
    category: 'clothing',
    color: 'blue',
    size: ['30x30', '32x30', '34x32', '36x32', '38x34'],
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'C9',
    description: 'Classic straight-fit denim jeans with traditional five-pocket styling. Durable cotton blend construction.'
  },
  {
    id: '6',
    name: 'Women\'s Black Dress Pants',
    price: 22.99,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviewCount: 198,
    brand: 'George',
    category: 'clothing',
    color: 'black',
    size: ['2', '4', '6', '8', '10', '12', '14'],
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'C10',
    description: 'Professional dress pants perfect for work or formal occasions. Wrinkle-resistant fabric with comfortable stretch.'
  },

  // Electronics
  {
    id: '7',
    name: 'Samsung 55" 4K Smart TV',
    price: 449.99,
    originalPrice: 599.99,
    image: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviewCount: 1247,
    brand: 'Samsung',
    category: 'electronics',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'E1',
    description: '55-inch 4K UHD Smart TV with HDR, built-in streaming apps, and voice control. Crystal clear picture quality with vibrant colors.'
  },
  {
    id: '8',
    name: 'Apple iPhone 15 128GB',
    price: 799.99,
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviewCount: 2156,
    brand: 'Apple',
    category: 'electronics',
    color: 'blue',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'E3',
    description: 'Latest iPhone with A17 Pro chip, advanced camera system, and all-day battery life. Available in multiple colors.'
  },
  {
    id: '9',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    price: 349.99,
    originalPrice: 399.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviewCount: 892,
    brand: 'Sony',
    category: 'electronics',
    color: 'black',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Oak Ave',
    aisle: 'E4',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.'
  },
  {
    id: '10',
    name: 'HP Pavilion 15.6" Laptop',
    price: 599.99,
    originalPrice: 749.99,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    reviewCount: 567,
    brand: 'HP',
    category: 'electronics',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'E2',
    description: '15.6-inch laptop with Intel Core i5 processor, 8GB RAM, and 256GB SSD. Perfect for work, school, and entertainment.'
  },
  {
    id: '11',
    name: 'Nintendo Switch OLED Console',
    price: 349.99,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviewCount: 1834,
    brand: 'Nintendo',
    category: 'electronics',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'E5',
    description: 'Gaming console with vibrant 7-inch OLED screen, enhanced audio, and versatile play modes for home and on-the-go gaming.'
  },

  // Food & Grocery
  {
    id: '12',
    name: 'Mixed Nuts Trail Mix - 16oz',
    price: 6.99,
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviewCount: 312,
    brand: 'Great Value',
    category: 'food',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'A14',
    description: 'Premium mix of almonds, cashews, peanuts, and raisins. Perfect for snacking or adding to recipes.'
  },
  {
    id: '13',
    name: 'Chocolate Chip Cookies - Family Pack',
    price: 4.99,
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviewCount: 189,
    brand: 'Chips Ahoy!',
    category: 'food',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'A12',
    description: 'Crispy chocolate chip cookies, perfect for snacking. Family-size pack with resealable packaging.'
  },
  {
    id: '14',
    name: 'Organic Bananas - 3 lbs',
    price: 2.99,
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviewCount: 456,
    brand: 'Organic',
    category: 'food',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'A1',
    description: 'Fresh organic bananas, perfect for snacking, smoothies, or baking. Rich in potassium and natural energy.'
  },
  {
    id: '15',
    name: 'Whole Milk - 1 Gallon',
    price: 3.49,
    image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviewCount: 234,
    brand: 'Great Value',
    category: 'food',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'A3',
    description: 'Fresh whole milk from local farms. Rich in calcium and protein, perfect for drinking or cooking.'
  },

  // Home & Garden
  {
    id: '16',
    name: 'Premium Coffee Maker - 12 Cup',
    price: 45.99,
    originalPrice: 59.99,
    image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviewCount: 423,
    brand: 'Mr. Coffee',
    category: 'home',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Oak Ave',
    aisle: 'H6',
    description: 'Programmable coffee maker with auto shut-off and glass carafe. Brews perfect coffee every time with easy-to-use controls.'
  },
  {
    id: '17',
    name: 'Ceramic Dinnerware Set - 16 Piece',
    price: 39.99,
    originalPrice: 54.99,
    image: 'https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviewCount: 298,
    brand: 'Better Homes & Gardens',
    category: 'home',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'H3',
    description: 'Beautiful ceramic dinnerware set including plates, bowls, and mugs. Dishwasher and microwave safe.'
  },
  {
    id: '18',
    name: 'LED Desk Lamp with USB Charging',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviewCount: 167,
    brand: 'Mainstays',
    category: 'home',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'H8',
    description: 'Modern LED desk lamp with adjustable brightness and built-in USB charging port. Perfect for home office or study.'
  },
  {
    id: '19',
    name: 'Memory Foam Pillow Set - 2 Pack',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviewCount: 512,
    brand: 'Lucid',
    category: 'home',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'H12',
    description: 'Comfortable memory foam pillows that contour to your head and neck. Hypoallergenic and machine washable covers.'
  },

  // Toys & Games
  {
    id: '20',
    name: 'Building Blocks Set - 500 Pieces',
    price: 29.99,
    image: 'https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviewCount: 267,
    brand: 'LEGO',
    category: 'toys',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'T8',
    description: 'Creative building blocks set perfect for kids aged 6-12. Encourages creativity and problem-solving skills.'
  },
  {
    id: '21',
    name: 'Remote Control Racing Car',
    price: 34.99,
    originalPrice: 44.99,
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviewCount: 189,
    brand: 'Hot Wheels',
    category: 'toys',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'T5',
    description: 'High-speed remote control car with 2.4GHz frequency and rechargeable battery. Perfect for indoor and outdoor play.'
  },
  {
    id: '22',
    name: 'Educational Tablet for Kids',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    reviewCount: 445,
    brand: 'LeapFrog',
    category: 'toys',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'T3',
    description: 'Interactive learning tablet with educational games, e-books, and creative activities. Designed for ages 3-9.'
  },

  // Health & Beauty
  {
    id: '23',
    name: 'Electric Toothbrush with Timer',
    price: 39.99,
    originalPrice: 54.99,
    image: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6,
    reviewCount: 678,
    brand: 'Oral-B',
    category: 'health',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'HB2',
    description: 'Advanced electric toothbrush with built-in timer and pressure sensor. Removes more plaque than manual brushing.'
  },
  {
    id: '24',
    name: 'Vitamin D3 Supplements - 90 Count',
    price: 12.99,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviewCount: 234,
    brand: 'Nature Made',
    category: 'health',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'HB5',
    description: 'High-quality Vitamin D3 supplements to support bone health and immune system. USP verified for purity and potency.'
  },
  {
    id: '25',
    name: 'Moisturizing Face Cream - Anti-Aging',
    price: 18.99,
    originalPrice: 24.99,
    image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.4,
    reviewCount: 356,
    brand: 'Olay',
    category: 'health',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'HB7',
    description: 'Advanced anti-aging face cream with retinol and hyaluronic acid. Reduces fine lines and improves skin texture.'
  },

  // Sports & Outdoors
  {
    id: '26',
    name: 'Yoga Mat with Carrying Strap',
    price: 19.99,
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    reviewCount: 423,
    brand: 'Gaiam',
    category: 'sports',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'S4',
    description: 'Premium yoga mat with excellent grip and cushioning. Includes carrying strap for easy transport to classes.'
  },
  {
    id: '27',
    name: 'Adjustable Dumbbells Set - 20 lbs',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviewCount: 289,
    brand: 'CAP Barbell',
    category: 'sports',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Main St',
    aisle: 'S2',
    description: 'Adjustable dumbbell set with quick-change weight plates. Perfect for home workouts and strength training.'
  },
  {
    id: '28',
    name: 'Camping Tent - 4 Person',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.3,
    reviewCount: 167,
    brand: 'Coleman',
    category: 'sports',
    inStock: true,
    storeLocation: 'Walmart Supercenter - Oak Ave',
    aisle: 'S8',
    description: 'Spacious 4-person camping tent with easy setup and weather-resistant design. Perfect for family camping trips.'
  }
];

export const getFilteredProducts = (category?: string, filters?: any): Product[] => {
  let filtered = [...mockProducts];

  if (category && category !== 'general') {
    filtered = filtered.filter(product => product.category === category);
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
  }

  return filtered;
};
import { Product, Category, Coupon } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Cuts',
    icon: 'Grid',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'curry-cut',
    name: 'Curry Cuts',
    icon: 'Scissors',
    image: 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'boneless',
    name: 'Boneless Special',
    icon: 'Feather',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'wings-drumsticks',
    name: 'Wings & Legs',
    icon: 'Flame',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'whole-chicken',
    name: 'Whole Chicken',
    icon: 'TrendingUp',
    image: 'https://images.unsplash.com/photo-1606728035253-49e81231d50c?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'kebabs-mince',
    name: 'Kebabs & Mince',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=150&auto=format&fit=crop&q=80'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Fresh Chicken Curry Cut (Large)',
    category: 'curry-cut',
    weight: '500g',
    price: 159,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=600&auto=format&fit=crop&q=80',
    description: 'Freshly cut, perfectly sized bone-in chicken pieces. Ideal for classic chicken curries, biryanis, and gravies. Tender, juicy, and 100% Halal certified.',
    isHalal: true,
    bestSeller: true
  },
  {
    id: 'p2',
    name: 'Fresh Chicken Curry Cut (Small)',
    category: 'curry-cut',
    weight: '500g',
    price: 165,
    originalPrice: 210,
    image: 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=600&auto=format&fit=crop&q=80',
    description: 'Bite-sized chicken pieces with bone. Cooks faster and absorbs spices beautifully, making it perfect for dry masalas, pepper chicken, and quick gravies.',
    isHalal: true,
    bestSeller: false
  },
  {
    id: 'p3',
    name: 'Premium Chicken Breast - Boneless',
    category: 'boneless',
    weight: '500g',
    price: 229,
    originalPrice: 289,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
    description: 'Juicy, high-protein boneless chicken breast fillets. Trimmed of excess fat, carefully cleaned, and ready to grill, pan-fry, or cut into strips.',
    isHalal: true,
    bestSeller: true
  },
  {
    id: 'p4',
    name: 'Chicken Mince / Keema',
    category: 'kebabs-mince',
    weight: '500g',
    price: 219,
    originalPrice: 269,
    image: 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=600&auto=format&fit=crop&q=80', // raw mince
    description: 'Finely ground, fat-free fresh chicken breast mince. Highly versatile for making delicious chicken meatballs, parathas, kebabs, or spaghetti bolognese.',
    isHalal: true,
    bestSeller: false
  },
  {
    id: 'p5',
    name: 'Tender Chicken Drumsticks',
    category: 'wings-drumsticks',
    weight: '4 Pieces (approx 450g)',
    price: 199,
    originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
    description: 'Meaty chicken leg drumsticks with clean skinless cuts. Perfect for mouth-watering tandoori drumsticks, fried chicken, or rich tangdi masalas.',
    isHalal: true,
    bestSeller: true
  },
  {
    id: 'p6',
    name: 'Spicy Marinated Chicken Wings',
    category: 'wings-drumsticks',
    weight: '6 Pieces (approx 400g)',
    price: 179,
    originalPrice: 229,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
    description: 'Fresh chicken wings cleaned and dressed. Perfect for baking, deep-frying, or slow grilling. Toss them in hot buffalo sauce for the ultimate treat.',
    isHalal: true,
    bestSeller: false
  },
  {
    id: 'p7',
    name: 'Premium Whole Chicken (with Skin)',
    category: 'whole-chicken',
    weight: '1kg - 1.2kg',
    price: 299,
    originalPrice: 380,
    image: 'https://images.unsplash.com/photo-1606728035253-49e81231d50c?w=600&auto=format&fit=crop&q=80',
    description: 'Full whole chicken with skin, perfect for festive family roasting, smoking, or rotisserie. Gutted, thoroughly cleaned, and hygiene-packed.',
    isHalal: true,
    bestSeller: false
  },
  {
    id: 'p8',
    name: 'Chicken Seekh Kebab (Ready to Cook)',
    category: 'kebabs-mince',
    weight: '6 Pieces (approx 350g)',
    price: 249,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80',
    description: 'Minced chicken mixed with authentic spices, fresh herbs, coriander, and green chillies. Just pan-fry or grill for 5 minutes and serve hot.',
    isHalal: true,
    bestSeller: true
  }
];

export const BANNERS = [
  {
    id: 'b1',
    title: 'Super Fresh Halal Chicken Delivered in 30 Mins!',
    subtitle: 'From farm to kitchen - Clean, fresh, and hygienically packed.',
    discountText: 'GET EXTRA ₹100 OFF',
    code: 'CHEEZO100',
    bgGradient: 'from-[#3F1D0B] to-[#5C2D16]',
    image: 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'b2',
    title: 'Sunday Biryani Special Feast!',
    subtitle: 'Get curated Biryani Cuts + Free Biryani Masala Combo.',
    discountText: '15% OFF ON Bestsellers',
    code: 'BIRYANI15',
    bgGradient: 'from-[#2E1407] to-[#4A2311]',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80'
  }
];

export const COUPONS: Coupon[] = [
  {
    code: 'CHEEZO100',
    discountType: 'fixed',
    value: 100,
    minPurchase: 499,
    description: 'Save Flat ₹100 on orders above ₹499'
  },
  {
    code: 'CHEEZO50',
    discountType: 'fixed',
    value: 50,
    minPurchase: 299,
    description: 'Save Flat ₹50 on orders above ₹299'
  },
  {
    code: 'FREE60',
    discountType: 'percentage',
    value: 15,
    minPurchase: 350,
    description: 'Get 15% OFF on orders above ₹350 (Max ₹100)'
  },
  {
    code: 'HALALFRESH',
    discountType: 'percentage',
    value: 10,
    minPurchase: 199,
    description: 'Get 10% OFF on your order (Max ₹40)'
  }
];

export const REVIEWS = [
  {
    id: 'r1',
    name: 'Aisha Rahman',
    rating: 5,
    comment: 'Extremely fresh and odor-free! The packaging is outstanding, vacuum sealed and cold-packed. Cheezo is my absolute go-to now.',
    date: '2 days ago'
  },
  {
    id: 'r2',
    name: 'Zayan Khan',
    rating: 5,
    comment: 'The chicken drumsticks were so juicy. Delivered in 25 mins flat. Best halal meat shop online in town.',
    date: '1 week ago'
  }
];

export const DEFAULTS = {
  deliveryFee: 39,
  freeDeliveryThreshold: 399,
  contactWhatsApp: '918766717483' // permanent business WhatsApp number
};

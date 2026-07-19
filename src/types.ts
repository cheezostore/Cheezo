export interface Product {
  id: string;
  name: string;
  name_hi?: string;
  category: string;
  weight: string;
  price: number; // Selling Price
  originalPrice: number; // MRP
  image: string;
  images?: string[]; // Multiple images support
  description: string;
  description_hi?: string;
  isHalal: boolean;
  bestSeller?: boolean;
  featured?: boolean;
  recommended?: boolean;
  stockQuantity?: number;
  inStock?: boolean;
  discountPercent?: number;
  hidden?: boolean;
  allowedAreas?: string[];
}

export interface Category {
  id: string;
  name: string;
  name_hi?: string;
  icon: string; // Lucide icon name
  image: string;
  hidden?: boolean;
  sortOrder?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
  description: string;
  description_hi?: string;
  enabled?: boolean;
}

export interface OrderDetails {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  landmark?: string;
  orderType?: 'Home Delivery' | 'Take Away' | 'Scheduled Delivery';
  deliveryDate?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  paymentMethod: string;
  items: CartItem[];
  couponCode?: string;
  discountAmount: number;
  deliveryCharge: number;
  grandTotal: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface PopupSettings {
  enabled: boolean;
  title: string;
  title_hi?: string;
  description: string;
  description_hi?: string;
  image: string;
  buttonText: string;
  buttonText_hi?: string;
  buttonLink: string;
  delay: number;
}

export interface BannerItem {
  id: string;
  title: string;
  title_hi?: string;
  subtitle: string;
  subtitle_hi?: string;
  discountText: string;
  discountText_hi?: string;
  code: string;
  bgGradient: string;
  image: string;
  enabled: boolean;
  type: 'slider' | 'homepage' | 'festival' | 'offer';
  buttonText?: string;
  buttonText_hi?: string;
  buttonLink?: string;
  sortOrder?: number;
}

export interface DeliverySettings {
  minimumOrder: number;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  deliveryRadius: number;
  deliveryTime: string;
  deliverySlots: string[];
  contactWhatsApp?: string;
  brandLogo?: string;
  appIcon?: string;
}

export interface DeliveryArea {
  id: string;
  name: string;
  name_hi: string;
  enabled: boolean;
  deliveryCharge: number;
  acceptingOrders: boolean;
  noticeMessage?: string;
  noticeMessage_hi?: string;
  minimumOrder?: number;
  freeDeliveryAbove?: number;
  deliveryRadius?: number;
  estimatedTime?: string;
}


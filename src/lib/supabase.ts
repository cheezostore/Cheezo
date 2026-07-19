import { createClient } from '@supabase/supabase-js';
import { Product, Category, Coupon, OrderDetails, PopupSettings, BannerItem, DeliverySettings, DeliveryArea } from '../types';

// Read Supabase environment variables
// @ts-ignore
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
// @ts-ignore
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Create Supabase client (only if credentials exist, otherwise null)
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Complete setup SQL query for copying/pasting into Supabase SQL Editor
export const SETUP_SQL_QUERY = `-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  icon TEXT,
  image TEXT,
  hidden BOOLEAN DEFAULT FALSE,
  sort_order INT
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  category TEXT NOT NULL,
  weight TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC NOT NULL,
  image TEXT,
  images TEXT[],
  description TEXT,
  description_hi TEXT,
  is_halal BOOLEAN DEFAULT TRUE,
  best_seller BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  recommended BOOLEAN DEFAULT FALSE,
  stock_quantity INT DEFAULT 10,
  in_stock BOOLEAN DEFAULT TRUE,
  discount_percent INT,
  hidden BOOLEAN DEFAULT FALSE,
  allowed_areas TEXT[]
);

-- 3. Create Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  min_purchase NUMERIC NOT NULL,
  max_discount NUMERIC,
  expiry_date TEXT,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  description TEXT,
  description_hi TEXT,
  enabled BOOLEAN DEFAULT TRUE
);

-- 4. Create Banners Table
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_hi TEXT,
  subtitle TEXT,
  subtitle_hi TEXT,
  discount_text TEXT,
  discount_text_hi TEXT,
  code TEXT,
  bg_gradient TEXT,
  image TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  type TEXT NOT NULL,
  button_text TEXT,
  button_text_hi TEXT,
  button_link TEXT,
  sort_order INT
);

-- 5. Create Delivery Areas Table
CREATE TABLE IF NOT EXISTS delivery_areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  delivery_charge NUMERIC NOT NULL,
  accepting_orders BOOLEAN DEFAULT TRUE,
  notice_message TEXT,
  notice_message_hi TEXT,
  minimum_order NUMERIC,
  free_delivery_above NUMERIC,
  delivery_radius NUMERIC,
  estimated_time TEXT
);

-- 6. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  landmark TEXT,
  order_type TEXT,
  delivery_date TEXT,
  delivery_time TEXT,
  special_instructions TEXT,
  payment_method TEXT NOT NULL,
  items JSONB NOT NULL,
  coupon_code TEXT,
  discount_amount NUMERIC NOT NULL,
  delivery_charge NUMERIC NOT NULL,
  grand_total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create App Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Enable Realtime for Postgres replication (Crucial for instant live sync!)
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table coupons;
alter publication supabase_realtime add table banners;
alter publication supabase_realtime add table delivery_areas;
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table app_settings;

-- Disable Row Level Security (RLS) on all tables so client operations work seamlessly
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_areas DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;
`;

// Helper: map Supabase DB row to Product type
export function mapProductFromDB(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    name_hi: row.name_hi,
    category: row.category,
    weight: row.weight,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    image: row.image,
    images: row.images || [],
    description: row.description || '',
    description_hi: row.description_hi,
    isHalal: row.is_halal,
    bestSeller: row.best_seller,
    featured: row.featured,
    recommended: row.recommended,
    stockQuantity: row.stock_quantity,
    inStock: row.in_stock,
    discountPercent: row.discount_percent,
    hidden: row.hidden,
    allowedAreas: row.allowed_areas || []
  };
}

// Helper: map Product to Supabase DB row
export function mapProductToDB(prod: Product) {
  return {
    id: prod.id,
    name: prod.name,
    name_hi: prod.name_hi,
    category: prod.category,
    weight: prod.weight,
    price: prod.price,
    original_price: prod.originalPrice,
    image: prod.image,
    images: prod.images || [prod.image],
    description: prod.description,
    description_hi: prod.description_hi,
    is_halal: prod.isHalal,
    best_seller: prod.bestSeller || false,
    featured: prod.featured || false,
    recommended: prod.recommended || false,
    stock_quantity: prod.stockQuantity ?? 10,
    in_stock: prod.inStock ?? true,
    discount_percent: prod.discountPercent ?? 0,
    hidden: prod.hidden || false,
    allowed_areas: prod.allowedAreas || []
  };
}

// Helper: map Category from DB
export function mapCategoryFromDB(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    name_hi: row.name_hi,
    icon: row.icon || 'Grid',
    image: row.image || '',
    hidden: row.hidden,
    sortOrder: row.sort_order
  };
}

// Helper: map Category to DB
export function mapCategoryToDB(cat: Category) {
  return {
    id: cat.id,
    name: cat.name,
    name_hi: cat.name_hi,
    icon: cat.icon || 'Grid',
    image: cat.image || '',
    hidden: cat.hidden || false,
    sort_order: cat.sortOrder || 0
  };
}

// Helper: map Coupon from DB
export function mapCouponFromDB(row: any): Coupon {
  return {
    code: row.code,
    discountType: row.discount_type as 'percentage' | 'fixed',
    value: Number(row.value),
    minPurchase: Number(row.min_purchase),
    maxDiscount: row.max_discount ? Number(row.max_discount) : undefined,
    expiryDate: row.expiry_date,
    usageLimit: row.usage_limit,
    usageCount: row.usage_count,
    description: row.description || '',
    description_hi: row.description_hi,
    enabled: row.enabled
  };
}

// Helper: map Coupon to DB
export function mapCouponToDB(coupon: Coupon) {
  return {
    code: coupon.code,
    discount_type: coupon.discountType,
    value: coupon.value,
    min_purchase: coupon.minPurchase,
    max_discount: coupon.maxDiscount,
    expiry_date: coupon.expiryDate,
    usage_limit: coupon.usageLimit,
    usage_count: coupon.usageCount || 0,
    description: coupon.description,
    description_hi: coupon.description_hi,
    enabled: coupon.enabled !== false
  };
}

// Helper: map Banner from DB
export function mapBannerFromDB(row: any): BannerItem {
  return {
    id: row.id,
    title: row.title,
    title_hi: row.title_hi,
    subtitle: row.subtitle || '',
    subtitle_hi: row.subtitle_hi,
    discountText: row.discount_text || '',
    discountText_hi: row.discount_text_hi,
    code: row.code || '',
    bgGradient: row.bg_gradient || 'from-red-600 to-amber-500',
    image: row.image || '',
    enabled: row.enabled,
    type: row.type as 'slider' | 'homepage' | 'festival' | 'offer',
    buttonText: row.button_text,
    buttonText_hi: row.button_text_hi,
    buttonLink: row.button_link,
    sortOrder: row.sort_order
  };
}

// Helper: map Banner to DB
export function mapBannerToDB(banner: BannerItem) {
  return {
    id: banner.id,
    title: banner.title,
    title_hi: banner.title_hi,
    subtitle: banner.subtitle,
    subtitle_hi: banner.subtitle_hi,
    discount_text: banner.discountText,
    discount_text_hi: banner.discountText_hi,
    code: banner.code,
    bg_gradient: banner.bgGradient,
    image: banner.image,
    enabled: banner.enabled !== false,
    type: banner.type,
    button_text: banner.buttonText,
    button_text_hi: banner.buttonText_hi,
    button_link: banner.buttonLink,
    sort_order: banner.sortOrder || 0
  };
}

// Helper: map DeliveryArea from DB
export function mapDeliveryAreaFromDB(row: any): DeliveryArea {
  return {
    id: row.id,
    name: row.name,
    name_hi: row.name_hi || '',
    enabled: row.enabled,
    deliveryCharge: Number(row.delivery_charge),
    acceptingOrders: row.accepting_orders,
    noticeMessage: row.notice_message,
    noticeMessage_hi: row.notice_message_hi,
    minimumOrder: row.minimum_order ? Number(row.minimum_order) : undefined,
    freeDeliveryAbove: row.free_delivery_above ? Number(row.free_delivery_above) : undefined,
    deliveryRadius: row.delivery_radius ? Number(row.delivery_radius) : undefined,
    estimatedTime: row.estimated_time
  };
}

// Helper: map DeliveryArea to DB
export function mapDeliveryAreaToDB(area: DeliveryArea) {
  return {
    id: area.id,
    name: area.name,
    name_hi: area.name_hi,
    enabled: area.enabled !== false,
    delivery_charge: area.deliveryCharge,
    accepting_orders: area.acceptingOrders !== false,
    notice_message: area.noticeMessage,
    notice_message_hi: area.noticeMessage_hi,
    minimum_order: area.minimumOrder,
    free_delivery_above: area.freeDeliveryAbove,
    delivery_radius: area.deliveryRadius,
    estimated_time: area.estimatedTime
  };
}

// Helper: map Order from DB
export function mapOrderFromDB(row: any): OrderDetails {
  let parsedItems = [];
  try {
    parsedItems = typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []);
  } catch (e) {
    console.warn("Failed to parse order items json:", e);
    parsedItems = [];
  }
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    landmark: row.landmark,
    orderType: row.order_type as 'Home Delivery' | 'Take Away' | 'Scheduled Delivery',
    deliveryDate: row.delivery_date,
    deliveryTime: row.delivery_time,
    specialInstructions: row.special_instructions,
    paymentMethod: row.payment_method,
    items: parsedItems,
    couponCode: row.coupon_code,
    discountAmount: Number(row.discount_amount),
    deliveryCharge: Number(row.delivery_charge),
    grandTotal: Number(row.grand_total),
    status: row.status as 'pending' | 'completed' | 'cancelled',
    createdAt: row.created_at
  };
}

// Helper: map Order to DB
export function mapOrderToDB(order: OrderDetails) {
  return {
    id: order.id,
    customer_name: order.customerName,
    phone: order.phone,
    address: order.address,
    landmark: order.landmark,
    order_type: order.orderType,
    delivery_date: order.deliveryDate,
    delivery_time: order.deliveryTime,
    special_instructions: order.specialInstructions,
    payment_method: order.paymentMethod,
    items: order.items,
    coupon_code: order.couponCode,
    discount_amount: order.discountAmount,
    delivery_charge: order.deliveryCharge,
    grand_total: order.grandTotal,
    status: order.status || 'pending',
    created_at: order.createdAt
  };
}

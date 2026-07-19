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
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          get 'x-admin-key'() {
            return localStorage.getItem('cheezo_admin_password') || '325250';
          }
        }
      }
    })
  : null;

// Complete setup SQL query for copying/pasting into Supabase SQL Editor
export const SETUP_SQL_QUERY = `-- Production Safe Migration & Secure RLS Setup Script for CHEEZO
-- Designed to run safely without dropping any tables or deleting existing data.

-- 1. Create Tables safely if they do not exist
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT,
  icon TEXT,
  image TEXT,
  hidden BOOLEAN DEFAULT FALSE,
  sort_order INT
);

CREATE TABLE IF NOT EXISTS public.products (
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

CREATE TABLE IF NOT EXISTS public.coupons (
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

CREATE TABLE IF NOT EXISTS public.banners (
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

CREATE TABLE IF NOT EXISTS public.delivery_areas (
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

CREATE TABLE IF NOT EXISTS public.orders (
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

CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- 2. Add any potentially missing columns to support old schemas (Safe Incremental Updates)
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS id TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name_hi TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order INT;

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name_hi TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description_hi TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_halal BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS best_seller BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS recommended BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 10;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percent INT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS allowed_areas TEXT[];

ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS discount_type TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS value NUMERIC;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS min_purchase NUMERIC;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS max_discount NUMERIC;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS expiry_date TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS usage_limit INT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS usage_count INT DEFAULT 0;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS description_hi TEXT;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT TRUE;

ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS id TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS title_hi TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS subtitle_hi TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS discount_text TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS discount_text_hi TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS bg_gradient TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS button_text TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS button_text_hi TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS button_link TEXT;
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS sort_order INT;

ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS id TEXT;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS name_hi TEXT;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS accepting_orders BOOLEAN DEFAULT TRUE;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS notice_message TEXT;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS notice_message_hi TEXT;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS minimum_order NUMERIC;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS free_delivery_above NUMERIC;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS delivery_radius NUMERIC;
ALTER TABLE public.delivery_areas ADD COLUMN IF NOT EXISTS estimated_time TEXT;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS landmark TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_type TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_date TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_time TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS special_instructions TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS grand_total NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS value JSONB;

-- 3. Create performance-boosting Indexes idempotently (Safe for existing schemas)
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_hidden_in_stock ON public.products(hidden, in_stock);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON public.orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_hidden_sort ON public.categories(hidden, sort_order);
CREATE INDEX IF NOT EXISTS idx_coupons_enabled_expiry ON public.coupons(enabled, expiry_date);

-- 4. Enable Realtime Replication incrementally without recreating publication
DO $$
DECLARE
  v_table text;
  v_tables text[] := ARRAY['categories', 'products', 'coupons', 'banners', 'delivery_areas', 'orders', 'app_settings'];
BEGIN
  -- Create publication if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  -- Add tables safely one-by-one only if not already in the publication
  FOREACH v_table IN ARRAY v_tables
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_rel pr
      JOIN pg_class c ON c.oid = pr.prrelid
      JOIN pg_publication p ON p.oid = pr.prpubid
      WHERE p.pubname = 'supabase_realtime' AND c.relname = v_table
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', v_table);
    END IF;
  END LOOP;
END $$;

-- 5. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 6. Create Secure Admin Helper Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER AS $$
DECLARE
  passed_key TEXT;
  stored_pwd TEXT;
BEGIN
  passed_key := current_setting('request.headers', true)::json->>'x-admin-key';
  IF passed_key IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Retrieve the stored password from app_settings table safely
  SELECT (value->>'password') INTO stored_pwd 
  FROM public.app_settings 
  WHERE key = 'admin_password';
  
  -- Fallback to the default password '325250' if not customized yet
  IF stored_pwd IS NULL THEN
    stored_pwd := '325250';
  END IF;
  
  RETURN passed_key = stored_pwd;
END;
$$ LANGUAGE plpgsql;

-- 7. Define Clean and Safe Policies for All Tables (Dropping existing policies to avoid conflicts)

-- Categories policies
DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin CRUD categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow admin CRUD categories" ON public.categories FOR ALL TO anon, authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Products policies
DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Allow admin CRUD products" ON public.products;
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin CRUD products" ON public.products FOR ALL TO anon, authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Coupons policies
DROP POLICY IF EXISTS "Allow public read coupons" ON public.coupons;
DROP POLICY IF EXISTS "Allow admin CRUD coupons" ON public.coupons;
CREATE POLICY "Allow public read coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Allow admin CRUD coupons" ON public.coupons FOR ALL TO anon, authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Banners policies
DROP POLICY IF EXISTS "Allow public read banners" ON public.banners;
DROP POLICY IF EXISTS "Allow admin CRUD banners" ON public.banners;
CREATE POLICY "Allow public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Allow admin CRUD banners" ON public.banners FOR ALL TO anon, authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Delivery Areas policies
DROP POLICY IF EXISTS "Allow public read delivery_areas" ON public.delivery_areas;
DROP POLICY IF EXISTS "Allow admin CRUD delivery_areas" ON public.delivery_areas;
CREATE POLICY "Allow public read delivery_areas" ON public.delivery_areas FOR SELECT USING (true);
CREATE POLICY "Allow admin CRUD delivery_areas" ON public.delivery_areas FOR ALL TO anon, authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Orders policies
DROP POLICY IF EXISTS "Allow customer insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admin CRUD orders" ON public.orders;
CREATE POLICY "Allow customer insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin CRUD orders" ON public.orders FOR ALL TO anon, authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- App Settings policies
DROP POLICY IF EXISTS "Allow public read app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow admin CRUD app_settings" ON public.app_settings;
-- Restrict public read to exclude the sensitive admin password
CREATE POLICY "Allow public read app_settings" ON public.app_settings FOR SELECT USING (key != 'admin_password');
CREATE POLICY "Allow admin CRUD app_settings" ON public.app_settings FOR ALL TO anon, authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
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
    bgGradient: row.bg_gradient || 'from-[#3F1D0B] to-[#5C2D16]',
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

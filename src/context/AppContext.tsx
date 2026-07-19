import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Coupon, OrderDetails, PopupSettings, BannerItem, DeliverySettings, DeliveryArea } from '../types';
import { PRODUCTS, CATEGORIES, COUPONS, BANNERS } from '../data';
import {
  supabase,
  isSupabaseConfigured,
  mapProductFromDB,
  mapProductToDB,
  mapCategoryFromDB,
  mapCategoryToDB,
  mapCouponFromDB,
  mapCouponToDB,
  mapBannerFromDB,
  mapBannerToDB,
  mapDeliveryAreaFromDB,
  mapDeliveryAreaToDB,
  mapOrderFromDB,
  mapOrderToDB
} from '../lib/supabase';

interface AppContextType {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  orders: OrderDetails[];
  popupSettings: PopupSettings;
  banners: BannerItem[];
  deliverySettings: DeliverySettings;
  isAdminLoggedIn: boolean;
  isSupabaseConnected: boolean;
  supabaseError: string | null;
  isLoading: boolean;
  
  // Auth actions
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPassword: string) => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  toggleProductHidden: (id: string) => void;
  toggleProductStock: (id: string) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryHidden: (id: string) => void;
  sortCategories: (sortedList: Category[]) => void;
  
  // Coupon actions
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  toggleCouponEnabled: (code: string) => void;
  
  // Popup actions
  updatePopupSettings: (settings: PopupSettings) => void;
  
  // Banner actions
  updateBanners: (banners: BannerItem[]) => void;
  addBanner: (banner: Omit<BannerItem, 'id'>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerEnabled: (id: string) => void;
  
  // Delivery settings actions
  updateDeliverySettings: (settings: DeliverySettings) => void;
  
  // Delivery areas
  deliveryAreas: DeliveryArea[];
  selectedAreaId: string | null;
  setSelectedAreaId: (id: string | null) => void;
  selectedArea: DeliveryArea | null;
  addDeliveryArea: (area: Omit<DeliveryArea, 'id'>) => void;
  updateDeliveryArea: (area: DeliveryArea) => void;
  deleteDeliveryArea: (id: string) => void;
  
  // Order actions
  placeOrder: (orderDetails: Omit<OrderDetails, 'id' | 'createdAt' | 'status'>) => Promise<OrderDetails>;
  updateOrderStatus: (orderId: string, status: OrderDetails['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeParseJSON = (val: any, fallback: any) => {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val || fallback;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  // --- Admin Authentication State ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('cheezo_admin_logged_in') === 'true';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('cheezo_admin_password') || '325250';
  });

  const loginAdmin = (password: string) => {
    if (password === adminPassword) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('cheezo_admin_logged_in', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('cheezo_admin_logged_in');
  };

  const changeAdminPassword = async (newPassword: string) => {
    setAdminPassword(newPassword);
    localStorage.setItem('cheezo_admin_password', newPassword);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('app_settings').upsert({
          key: 'admin_password',
          value: { password: newPassword }
        });
      } catch (err) {
        console.error("Failed to update admin password in Supabase:", err);
      }
    }
  };

  // --- Core States ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [popupSettings, setPopupSettings] = useState<PopupSettings>({
    enabled: true,
    title: 'Get Flat ₹100 Off!',
    description: 'Enjoy premium fresh halal chicken delivered directly from farm to your kitchen!',
    image: 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=600&auto=format&fit=crop&q=80',
    buttonText: 'CLAIM NOW & APPLY CODE',
    buttonLink: 'CHEEZO100',
    delay: 1500,
  });
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    minimumOrder: 199,
    deliveryCharge: 39,
    freeDeliveryThreshold: 399,
    deliveryRadius: 15,
    deliveryTime: '30-45 mins',
    contactWhatsApp: '918766717483',
    brandLogo: '/src/assets/images/cheezo_brand_logo_1784325310903.jpg',
    appIcon: '/src/assets/images/cheezo_app_icon_1784325331060.jpg',
    deliverySlots: [
      '07:00 AM - 10:00 AM',
      '10:00 AM - 01:00 PM',
      '01:00 PM - 04:00 PM',
      '04:00 PM - 07:00 PM',
      '07:00 PM - 10:00 PM',
    ],
  });
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  const [selectedAreaId, setSelectedAreaIdState] = useState<string | null>(() => {
    return localStorage.getItem('cheezo_selected_area_id');
  });

  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  const setSelectedAreaId = (id: string | null) => {
    setSelectedAreaIdState(id);
    if (id) {
      localStorage.setItem('cheezo_selected_area_id', id);
    } else {
      localStorage.removeItem('cheezo_selected_area_id');
    }
  };

  const selectedArea = deliveryAreas.find(a => a.id === selectedAreaId) || null;

  // --- Seeding & Hydration (LocalStorage Fallback) ---
  const hydrateFromLocalStorage = () => {
    // 1. Hydrate Products
    const storedProducts = localStorage.getItem('cheezo_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      const seededProducts: Product[] = PRODUCTS.map((p, idx) => ({
        ...p,
        images: [p.image],
        stockQuantity: idx % 3 === 0 ? 0 : 35 + (idx * 5),
        inStock: idx % 3 !== 0,
        featured: idx % 2 === 0,
        recommended: idx % 4 === 0,
        discountPercent: Math.round((1 - p.price / p.originalPrice) * 100),
        hidden: false,
      }));
      setProducts(seededProducts);
      localStorage.setItem('cheezo_products', JSON.stringify(seededProducts));
    }

    // 2. Hydrate Categories
    const storedCategories = localStorage.getItem('cheezo_categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      const seededCategories: Category[] = CATEGORIES.map((c, idx) => ({
        ...c,
        hidden: false,
        sortOrder: idx,
      }));
      setCategories(seededCategories);
      localStorage.setItem('cheezo_categories', JSON.stringify(seededCategories));
    }

    // 3. Hydrate Coupons
    const storedCoupons = localStorage.getItem('cheezo_coupons');
    if (storedCoupons) {
      setCoupons(JSON.parse(storedCoupons));
    } else {
      const seededCoupons: Coupon[] = COUPONS.map(c => ({
        ...c,
        enabled: true,
        maxDiscount: c.discountType === 'percentage' ? 100 : undefined,
        usageLimit: 150,
        usageCount: Math.floor(Math.random() * 45),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }));
      setCoupons(seededCoupons);
      localStorage.setItem('cheezo_coupons', JSON.stringify(seededCoupons));
    }

    // 4. Hydrate Orders
    const storedOrders = localStorage.getItem('cheezo_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      const now = new Date();
      const seededOrders: OrderDetails[] = [
        {
          id: 'CHZ-9842',
          customerName: 'Aarav Sharma',
          phone: '9876543210',
          address: 'Flat 402, Block A, Green Meadows Apartments',
          landmark: 'Near Central Park',
          paymentMethod: 'UPI / Online Payment',
          status: 'completed',
          createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              product: {
                id: 'p1',
                name: 'Fresh Chicken Curry Cut (Large)',
                category: 'curry-cut',
                weight: '500g',
                price: 159,
                originalPrice: 199,
                image: 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=600&auto=format&fit=crop&q=80',
                description: '',
                isHalal: true,
                stockQuantity: 30,
                inStock: true,
              },
              quantity: 2,
            },
            {
              product: {
                id: 'p3',
                name: 'Premium Chicken Breast - Boneless',
                category: 'boneless',
                weight: '500g',
                price: 229,
                originalPrice: 289,
                image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
                description: '',
                isHalal: true,
                stockQuantity: 20,
                inStock: true,
              },
              quantity: 1,
            },
          ],
          couponCode: 'CHEEZO50',
          discountAmount: 50,
          deliveryCharge: 0,
          grandTotal: 497,
        }
      ];
      setOrders(seededOrders);
      localStorage.setItem('cheezo_orders', JSON.stringify(seededOrders));
    }

    // 5. Hydrate Popup Settings
    const storedPopup = localStorage.getItem('cheezo_popup_settings');
    if (storedPopup) {
      setPopupSettings(JSON.parse(storedPopup));
    }

    // 6. Hydrate Banners
    const storedBanners = localStorage.getItem('cheezo_banner_settings');
    if (storedBanners) {
      setBanners(JSON.parse(storedBanners));
    } else {
      const seededBanners: BannerItem[] = [
        ...BANNERS.map((b, idx) => ({
          ...b,
          enabled: true,
          type: 'slider' as const,
        })),
        {
          id: 'homepage-banner-1',
          title: 'Monsoon Sizzler Weekend',
          subtitle: 'Crispy Wings & Seekh Kebabs at unbeatable pricing',
          discountText: 'UP TO 30% OFF',
          code: 'SIZZLE30',
          bgGradient: 'from-amber-600 to-red-600',
          image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
          enabled: true,
          type: 'homepage' as const,
        },
      ];
      setBanners(seededBanners);
      localStorage.setItem('cheezo_banner_settings', JSON.stringify(seededBanners));
    }

    // 7. Hydrate Delivery Settings
    const storedDelivery = localStorage.getItem('cheezo_delivery_settings');
    if (storedDelivery) {
      try {
        const parsed = JSON.parse(storedDelivery);
        if (!parsed.brandLogo) {
          parsed.brandLogo = '/src/assets/images/cheezo_brand_logo_1784325310903.jpg';
        }
        if (!parsed.appIcon) {
          parsed.appIcon = '/src/assets/images/cheezo_app_icon_1784325331060.jpg';
        }
        setDeliverySettings(parsed);
      } catch (e) {
        console.error("Error parsing stored delivery settings:", e);
      }
    }

    // 8. Hydrate Delivery Areas
    const storedAreas = localStorage.getItem('cheezo_delivery_areas');
    if (storedAreas) {
      setDeliveryAreas(JSON.parse(storedAreas));
    } else {
      const DEFAULT_AREAS: DeliveryArea[] = [
        {
          id: 'nalasopara-west',
          name: 'Nalasopara West',
          name_hi: 'नालासोपारा वेस्ट',
          enabled: true,
          deliveryCharge: 39,
          acceptingOrders: true,
          noticeMessage: 'Serving fresh cuts daily in Nalasopara West!',
          noticeMessage_hi: 'नालासोपारा वेस्ट में दैनिक ताज़ा कट्स परोस रहे हैं!',
          minimumOrder: 199,
          freeDeliveryAbove: 399,
          deliveryRadius: 5,
          estimatedTime: '30-45 mins',
        }
      ];
      setDeliveryAreas(DEFAULT_AREAS);
      localStorage.setItem('cheezo_delivery_areas', JSON.stringify(DEFAULT_AREAS));
    }
  };

  // --- Seeding & Hydration (Supabase & Realtime Sync) ---
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      hydrateFromLocalStorage();
      return;
    }

    const loadDataAndSubscribe = async () => {
      try {
        setSupabaseError(null);
        setIsLoading(true);

        // 1. Load Categories
        const { data: catData, error: catError } = await supabase.from('categories').select('*');
        if (catError) throw catError;
        
        let loadedCategories: Category[] = [];
        if (catData && catData.length > 0) {
          loadedCategories = catData.map(mapCategoryFromDB);
          setCategories(loadedCategories);
        } else {
          // Seed categories
          const seededCategories: Category[] = CATEGORIES.map((c, idx) => ({
            ...c,
            hidden: false,
            sortOrder: idx,
          }));
          const dbCats = seededCategories.map(mapCategoryToDB);
          const { error: seedCatError } = await supabase.from('categories').insert(dbCats);
          if (!seedCatError) {
            setCategories(seededCategories);
            loadedCategories = seededCategories;
          } else {
            console.error("Error seeding categories:", seedCatError);
          }
        }

        // 2. Load Products
        const { data: prodData, error: prodError } = await supabase.from('products').select('*');
        if (prodError) throw prodError;

        if (prodData && prodData.length > 0) {
          setProducts(prodData.map(mapProductFromDB));
        } else {
          // Seed products
          const seededProducts: Product[] = PRODUCTS.map((p, idx) => ({
            ...p,
            images: [p.image],
            stockQuantity: idx % 3 === 0 ? 0 : 35 + (idx * 5),
            inStock: idx % 3 !== 0,
            featured: idx % 2 === 0,
            recommended: idx % 4 === 0,
            discountPercent: Math.round((1 - p.price / p.originalPrice) * 100),
            hidden: false,
          }));
          const dbProds = seededProducts.map(mapProductToDB);
          const { error: seedProdError } = await supabase.from('products').insert(dbProds);
          if (!seedProdError) {
            setProducts(seededProducts);
          } else {
            console.error("Error seeding products:", seedProdError);
          }
        }

        // 3. Load Coupons
        const { data: coupData, error: coupError } = await supabase.from('coupons').select('*');
        if (coupError) throw coupError;

        if (coupData && coupData.length > 0) {
          setCoupons(coupData.map(mapCouponFromDB));
        } else {
          const seededCoupons: Coupon[] = COUPONS.map(c => ({
            ...c,
            enabled: true,
            maxDiscount: c.discountType === 'percentage' ? 100 : undefined,
            usageLimit: 150,
            usageCount: Math.floor(Math.random() * 45),
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          }));
          const dbCoupons = seededCoupons.map(mapCouponToDB);
          const { error: seedCoupError } = await supabase.from('coupons').insert(dbCoupons);
          if (!seedCoupError) {
            setCoupons(seededCoupons);
          } else {
            console.error("Error seeding coupons:", seedCoupError);
          }
        }

        // 4. Load Banners
        const { data: banData, error: banError } = await supabase.from('banners').select('*');
        if (banError) throw banError;

        if (banData && banData.length > 0) {
          setBanners(banData.map(mapBannerFromDB));
        } else {
          const seededBanners: BannerItem[] = [
            ...BANNERS.map((b, idx) => ({
              ...b,
              enabled: true,
              type: 'slider' as const,
            })),
            {
              id: 'homepage-banner-1',
              title: 'Monsoon Sizzler Weekend',
              subtitle: 'Crispy Wings & Seekh Kebabs at unbeatable pricing',
              discountText: 'UP TO 30% OFF',
              code: 'SIZZLE30',
              bgGradient: 'from-amber-600 to-red-600',
              image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
              enabled: true,
              type: 'homepage' as const,
            },
            {
              id: 'festival-banner-1',
              title: 'Eid & Sunday Family Grand Roasts',
              subtitle: 'Pre-book whole premium chickens cleaned & dressed',
              discountText: 'FREE MASALA BAG',
              code: 'ROASTEID',
              bgGradient: 'from-red-600 to-emerald-700',
              image: 'https://images.unsplash.com/photo-1606728035253-49e81231d50c?w=600&auto=format&fit=crop&q=80',
              enabled: true,
              type: 'festival' as const,
            },
            {
              id: 'offer-banner-1',
              title: 'Instant Flash Chicken breast combo offer',
              subtitle: 'Double pack boneless supreme fillets',
              discountText: 'FLAT ₹80 OFF',
              code: 'BREAST80',
              bgGradient: 'from-zinc-900 via-red-950 to-zinc-900',
              image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
              enabled: true,
              type: 'offer' as const,
            },
          ];
          const dbBanners = seededBanners.map(mapBannerToDB);
          const { error: seedBanError } = await supabase.from('banners').insert(dbBanners);
          if (!seedBanError) {
            setBanners(seededBanners);
          } else {
            console.error("Error seeding banners:", seedBanError);
          }
        }

        // 5. Load Delivery Areas
        const { data: areaData, error: areaError } = await supabase.from('delivery_areas').select('*');
        if (areaError) throw areaError;

        if (areaData && areaData.length > 0) {
          setDeliveryAreas(areaData.map(mapDeliveryAreaFromDB));
        } else {
          const DEFAULT_AREAS: DeliveryArea[] = [
            {
              id: 'nalasopara-west',
              name: 'Nalasopara West',
              name_hi: 'नालासोपारा वेस्ट',
              enabled: true,
              deliveryCharge: 39,
              acceptingOrders: true,
              noticeMessage: 'Serving fresh cuts daily in Nalasopara West!',
              noticeMessage_hi: 'नालासोपारा वेस्ट में दैनिक ताज़ा कट्स परोस रहे हैं!',
              minimumOrder: 199,
              freeDeliveryAbove: 399,
              deliveryRadius: 5,
              estimatedTime: '30-45 mins',
            },
            {
              id: 'virar-west',
              name: 'Virar West',
              name_hi: 'विरार वेस्ट',
              enabled: true,
              deliveryCharge: 49,
              acceptingOrders: true,
              noticeMessage: 'Fast delivery straight to your kitchen in Virar West!',
              noticeMessage_hi: 'विरार वेस्ट में सीधे आपकी रसोई में तेज़ डिलीवरी!',
              minimumOrder: 249,
              freeDeliveryAbove: 499,
              deliveryRadius: 8,
              estimatedTime: '45-60 mins',
            },
            {
              id: 'vasai-west',
              name: 'Vasai West',
              name_hi: 'वसई वेस्ट',
              enabled: true,
              deliveryCharge: 29,
              acceptingOrders: true,
              noticeMessage: 'Premium quality cuts at Vasai West!',
              noticeMessage_hi: 'वसई वेस्ट में प्रीमियम गुणवत्ता कट्स!',
              minimumOrder: 149,
              freeDeliveryAbove: 299,
              deliveryRadius: 4,
              estimatedTime: '25-35 mins',
            }
          ];
          const dbAreas = DEFAULT_AREAS.map(mapDeliveryAreaToDB);
          const { error: seedAreaError } = await supabase.from('delivery_areas').insert(dbAreas);
          if (!seedAreaError) {
            setDeliveryAreas(DEFAULT_AREAS);
          } else {
            console.error("Error seeding delivery areas:", seedAreaError);
          }
        }

        // 6. Load Orders
        const { data: orderData, error: orderError } = await supabase.from('orders').select('*');
        if (orderError) throw orderError;

        if (orderData && orderData.length > 0) {
          setOrders(orderData.map(mapOrderFromDB));
        } else {
          const seededOrders: OrderDetails[] = [
            {
              id: 'CHZ-9842',
              customerName: 'Aarav Sharma',
              phone: '9876543210',
              address: 'Flat 402, Block A, Green Meadows Apartments',
              landmark: 'Near Central Park',
              paymentMethod: 'UPI / Online Payment',
              status: 'completed',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              items: [
                {
                  product: {
                    id: 'p1',
                    name: 'Fresh Chicken Curry Cut (Large)',
                    category: 'curry-cut',
                    weight: '500g',
                    price: 159,
                    originalPrice: 199,
                    image: 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=600&auto=format&fit=crop&q=80',
                    description: '',
                    isHalal: true,
                    stockQuantity: 30,
                    inStock: true,
                  },
                  quantity: 2,
                }
              ],
              couponCode: 'CHEEZO50',
              discountAmount: 50,
              deliveryCharge: 0,
              grandTotal: 497,
            }
          ];
          const dbOrders = seededOrders.map(mapOrderToDB);
          const { error: seedOrderError } = await supabase.from('orders').insert(dbOrders);
          if (!seedOrderError) {
            setOrders(seededOrders);
          } else {
            console.error("Error seeding orders:", seedOrderError);
          }
        }

        // 7. Load App Settings (Popup and Delivery)
        const { data: settingsData, error: settingsError } = await supabase.from('app_settings').select('*');
        if (settingsError) throw settingsError;

        if (settingsData && settingsData.length > 0) {
          const popupRow = settingsData.find(s => s.key === 'popup_settings');
          if (popupRow) setPopupSettings(safeParseJSON(popupRow.value, popupSettings));
          else {
            await supabase.from('app_settings').insert({ key: 'popup_settings', value: popupSettings });
          }

          const deliveryRow = settingsData.find(s => s.key === 'delivery_settings');
          if (deliveryRow) {
            const parsed = safeParseJSON(deliveryRow.value, deliverySettings);
            if (!parsed.brandLogo) {
              parsed.brandLogo = '/src/assets/images/cheezo_brand_logo_1784325310903.jpg';
            }
            if (!parsed.appIcon) {
              parsed.appIcon = '/src/assets/images/cheezo_app_icon_1784325331060.jpg';
            }
            setDeliverySettings(parsed);
          } else {
            await supabase.from('app_settings').insert({ key: 'delivery_settings', value: deliverySettings });
          }
        } else {
          // Insert defaults
          await supabase.from('app_settings').insert([
            { key: 'popup_settings', value: popupSettings },
            { key: 'delivery_settings', value: deliverySettings }
          ]);
        }

        setIsSupabaseConnected(true);
      } catch (err: any) {
        console.error("Supabase hydration status: error connecting to Supabase.", err?.message || err);
        setSupabaseError(err?.message || 'Error connecting to Supabase. Check if SQL tables have been set up in your Supabase project.');
        setIsSupabaseConnected(false);
        // Do NOT fall back to local storage if configured with Supabase! Set empty states to avoid lingering local data.
        setProducts([]);
        setCategories([]);
        setCoupons([]);
        setOrders([]);
        setBanners([]);
        setDeliveryAreas([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDataAndSubscribe();

    // Setup Realtime subscriptions for instant reflect on changes!
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data.map(mapCategoryFromDB));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
        const { data } = await supabase.from('products').select('*');
        if (data) setProducts(data.map(mapProductFromDB));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'coupons' }, async () => {
        const { data } = await supabase.from('coupons').select('*');
        if (data) setCoupons(data.map(mapCouponFromDB));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, async () => {
        const { data } = await supabase.from('banners').select('*');
        if (data) setBanners(data.map(mapBannerFromDB));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_areas' }, async () => {
        const { data } = await supabase.from('delivery_areas').select('*');
        if (data) setDeliveryAreas(data.map(mapDeliveryAreaFromDB));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
        const { data } = await supabase.from('orders').select('*');
        if (data) setOrders(data.map(mapOrderFromDB));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, async () => {
        const { data } = await supabase.from('app_settings').select('*');
        if (data) {
          const popupRow = data.find(s => s.key === 'popup_settings');
          if (popupRow) setPopupSettings(safeParseJSON(popupRow.value, popupSettings));
          const deliveryRow = data.find(s => s.key === 'delivery_settings');
          if (deliveryRow) setDeliverySettings(safeParseJSON(deliveryRow.value, deliverySettings));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- Synchronization Helper ---
  const saveState = (key: string, data: any, setter: Function) => {
    setter(data);
    // Disable local storage persistence if Supabase is configured to avoid mixed data states
    if (!isSupabaseConfigured) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // --- Product actions implementation ---
  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    const fresh: Product = {
      ...newProd,
      id: `p-${Date.now()}`,
      images: newProd.images?.length ? newProd.images : [newProd.image],
      discountPercent: newProd.originalPrice > 0 
        ? Math.round((1 - newProd.price / newProd.originalPrice) * 100) 
        : 0,
    };
    const updated = [fresh, ...products];
    saveState('cheezo_products', updated, setProducts);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').insert(mapProductToDB(fresh));
        if (error) console.error("Supabase insert error:", error);
      } catch (err) {
        console.error("Supabase insert exception:", err);
      }
    }
  };

  const updateProduct = async (updatedProd: Product) => {
    const updatedVal = {
      ...updatedProd,
      discountPercent: updatedProd.originalPrice > 0 
        ? Math.round((1 - updatedProd.price / updatedProd.originalPrice) * 100) 
        : 0,
      images: updatedProd.images?.length ? updatedProd.images : [updatedProd.image],
    };
    const updated = products.map(p => p.id === updatedProd.id ? updatedVal : p);
    saveState('cheezo_products', updated, setProducts);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update(mapProductToDB(updatedVal))
          .eq('id', updatedProd.id);
        if (error) console.error("Supabase update error:", error);
      } catch (err) {
        console.error("Supabase update exception:", err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter(p => p.id !== id);
    saveState('cheezo_products', updated, setProducts);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) console.error("Supabase delete error:", error);
      } catch (err) {
        console.error("Supabase delete exception:", err);
      }
    }
  };

  const duplicateProduct = async (id: string) => {
    const origin = products.find(p => p.id === id);
    if (!origin) return;
    const dup: Product = {
      ...origin,
      id: `p-dup-${Date.now()}`,
      name: `${origin.name} (Copy)`,
    };
    const updated = [dup, ...products];
    saveState('cheezo_products', updated, setProducts);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').insert(mapProductToDB(dup));
        if (error) console.error("Supabase duplicate error:", error);
      } catch (err) {
        console.error("Supabase duplicate exception:", err);
      }
    }
  };

  const toggleProductHidden = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const updatedVal = { ...target, hidden: !target.hidden };
    const updated = products.map(p => p.id === id ? updatedVal : p);
    saveState('cheezo_products', updated, setProducts);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ hidden: updatedVal.hidden })
          .eq('id', id);
        if (error) console.error("Supabase toggle product error:", error);
      } catch (err) {
        console.error("Supabase toggle product exception:", err);
      }
    }
  };

  const toggleProductStock = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const nextInStock = !target.inStock;
    const updatedVal = {
      ...target,
      inStock: nextInStock,
      stockQuantity: nextInStock ? (target.stockQuantity || 20) : 0,
    };
    const updated = products.map(p => p.id === id ? updatedVal : p);
    saveState('cheezo_products', updated, setProducts);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            in_stock: updatedVal.inStock,
            stock_quantity: updatedVal.stockQuantity
          })
          .eq('id', id);
        if (error) console.error("Supabase toggle product stock error:", error);
      } catch (err) {
        console.error("Supabase toggle product stock exception:", err);
      }
    }
  };

  // --- Category actions implementation ---
  const addCategory = async (newCat: Omit<Category, 'id'>) => {
    const fresh: Category = {
      ...newCat,
      id: newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      hidden: false,
      sortOrder: categories.length,
    };
    const updated = [...categories, fresh];
    saveState('cheezo_categories', updated, setCategories);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('categories').insert(mapCategoryToDB(fresh));
        if (error) console.error("Supabase insert category error:", error);
      } catch (err) {
        console.error("Supabase insert category exception:", err);
      }
    }
  };

  const updateCategory = async (updatedCat: Category) => {
    const updated = categories.map(c => c.id === updatedCat.id ? updatedCat : c);
    saveState('cheezo_categories', updated, setCategories);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('categories')
          .update(mapCategoryToDB(updatedCat))
          .eq('id', updatedCat.id);
        if (error) console.error("Supabase update category error:", error);
      } catch (err) {
        console.error("Supabase update category exception:", err);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    saveState('cheezo_categories', updated, setCategories);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) console.error("Supabase delete category error:", error);
      } catch (err) {
        console.error("Supabase delete category exception:", err);
      }
    }
  };

  const toggleCategoryHidden = async (id: string) => {
    const target = categories.find(c => c.id === id);
    if (!target) return;
    const updatedVal = { ...target, hidden: !target.hidden };
    const updated = categories.map(c => c.id === id ? updatedVal : c);
    saveState('cheezo_categories', updated, setCategories);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('categories')
          .update({ hidden: updatedVal.hidden })
          .eq('id', id);
        if (error) console.error("Supabase toggle category hidden error:", error);
      } catch (err) {
        console.error("Supabase toggle category hidden exception:", err);
      }
    }
  };

  const sortCategories = async (sortedList: Category[]) => {
    const withOrders = sortedList.map((c, index) => ({ ...c, sortOrder: index }));
    saveState('cheezo_categories', withOrders, setCategories);

    if (isSupabaseConfigured && supabase) {
      try {
        const dbRows = withOrders.map(mapCategoryToDB);
        const { error } = await supabase.from('categories').upsert(dbRows);
        if (error) console.error("Supabase sort categories error:", error);
      } catch (err) {
        console.error("Supabase sort categories exception:", err);
      }
    }
  };

  // --- Coupon actions implementation ---
  const addCoupon = async (newC: Coupon) => {
    const updated = [newC, ...coupons];
    saveState('cheezo_coupons', updated, setCoupons);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('coupons').insert(mapCouponToDB(newC));
        if (error) console.error("Supabase insert coupon error:", error);
      } catch (err) {
        console.error("Supabase insert coupon exception:", err);
      }
    }
  };

  const updateCoupon = async (updatedC: Coupon) => {
    const updated = coupons.map(c => c.code === updatedC.code ? updatedC : c);
    saveState('cheezo_coupons', updated, setCoupons);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('coupons')
          .update(mapCouponToDB(updatedC))
          .eq('code', updatedC.code);
        if (error) console.error("Supabase update coupon error:", error);
      } catch (err) {
        console.error("Supabase update coupon exception:", err);
      }
    }
  };

  const deleteCoupon = async (code: string) => {
    const updated = coupons.filter(c => c.code !== code);
    saveState('cheezo_coupons', updated, setCoupons);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('coupons').delete().eq('code', code);
        if (error) console.error("Supabase delete coupon error:", error);
      } catch (err) {
        console.error("Supabase delete coupon exception:", err);
      }
    }
  };

  const toggleCouponEnabled = async (code: string) => {
    const target = coupons.find(c => c.code === code);
    if (!target) return;
    const updatedVal = { ...target, enabled: !target.enabled };
    const updated = coupons.map(c => c.code === code ? updatedVal : c);
    saveState('cheezo_coupons', updated, setCoupons);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('coupons')
          .update({ enabled: updatedVal.enabled })
          .eq('code', code);
        if (error) console.error("Supabase toggle coupon error:", error);
      } catch (err) {
        console.error("Supabase toggle coupon exception:", err);
      }
    }
  };

  // --- Popup actions implementation ---
  const updatePopupSettings = async (settings: PopupSettings) => {
    saveState('cheezo_popup_settings', settings, setPopupSettings);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('app_settings')
          .upsert({ key: 'popup_settings', value: settings });
        if (error) console.error("Supabase update popup settings error:", error);
      } catch (err) {
        console.error("Supabase update popup settings exception:", err);
      }
    }
  };

  // --- Banner actions implementation ---
  const updateBanners = async (updatedBanners: BannerItem[]) => {
    saveState('cheezo_banner_settings', updatedBanners, setBanners);

    if (isSupabaseConfigured && supabase) {
      try {
        const dbRows = updatedBanners.map(mapBannerToDB);
        const { error } = await supabase.from('banners').upsert(dbRows);
        if (error) console.error("Supabase sort banners error:", error);
      } catch (err) {
        console.error("Supabase sort banners exception:", err);
      }
    }
  };

  const addBanner = async (newB: Omit<BannerItem, 'id'>) => {
    const fresh: BannerItem = {
      ...newB,
      id: `b-banner-${Date.now()}`,
    };
    const updated = [...banners, fresh];
    saveState('cheezo_banner_settings', updated, setBanners);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('banners').insert(mapBannerToDB(fresh));
        if (error) console.error("Supabase insert banner error:", error);
      } catch (err) {
        console.error("Supabase insert banner exception:", err);
      }
    }
  };

  const deleteBanner = async (id: string) => {
    const updated = banners.filter(b => b.id !== id);
    saveState('cheezo_banner_settings', updated, setBanners);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) console.error("Supabase delete banner error:", error);
      } catch (err) {
        console.error("Supabase delete banner exception:", err);
      }
    }
  };

  const toggleBannerEnabled = async (id: string) => {
    const target = banners.find(b => b.id === id);
    if (!target) return;
    const updatedVal = { ...target, enabled: !target.enabled };
    const updated = banners.map(b => b.id === id ? updatedVal : b);
    saveState('cheezo_banner_settings', updated, setBanners);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('banners')
          .update({ enabled: updatedVal.enabled })
          .eq('id', id);
        if (error) console.error("Supabase toggle banner error:", error);
      } catch (err) {
        console.error("Supabase toggle banner exception:", err);
      }
    }
  };

  // --- Delivery settings actions implementation ---
  const updateDeliverySettings = async (settings: DeliverySettings) => {
    saveState('cheezo_delivery_settings', settings, setDeliverySettings);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('app_settings')
          .upsert({ key: 'delivery_settings', value: settings });
        if (error) console.error("Supabase update delivery settings error:", error);
      } catch (err) {
        console.error("Supabase update delivery settings exception:", err);
      }
    }
  };

  const addDeliveryArea = async (areaInput: Omit<DeliveryArea, 'id'>) => {
    const fresh: DeliveryArea = {
      ...areaInput,
      id: `area-${Date.now()}`,
    };
    const updated = [...deliveryAreas, fresh];
    saveState('cheezo_delivery_areas', updated, setDeliveryAreas);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('delivery_areas').insert(mapDeliveryAreaToDB(fresh));
        if (error) console.error("Supabase insert area error:", error);
      } catch (err) {
        console.error("Supabase insert area exception:", err);
      }
    }
  };

  const updateDeliveryArea = async (updatedArea: DeliveryArea) => {
    const updated = deliveryAreas.map(a => a.id === updatedArea.id ? updatedArea : a);
    saveState('cheezo_delivery_areas', updated, setDeliveryAreas);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('delivery_areas')
          .update(mapDeliveryAreaToDB(updatedArea))
          .eq('id', updatedArea.id);
        if (error) console.error("Supabase update area error:", error);
      } catch (err) {
        console.error("Supabase update area exception:", err);
      }
    }
  };

  const deleteDeliveryArea = async (id: string) => {
    const updated = deliveryAreas.filter(a => a.id !== id);
    saveState('cheezo_delivery_areas', updated, setDeliveryAreas);
    if (selectedAreaId === id) {
      setSelectedAreaId(null);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('delivery_areas').delete().eq('id', id);
        if (error) console.error("Supabase delete area error:", error);
      } catch (err) {
        console.error("Supabase delete area exception:", err);
      }
    }
  };

  // --- Order actions implementation ---
  const placeOrder = async (orderInput: Omit<OrderDetails, 'id' | 'createdAt' | 'status'>): Promise<OrderDetails> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderDetails = {
      ...orderInput,
      id: `CHZ-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Insert order into Supabase FIRST (await the operation to verify success)
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('orders').insert(mapOrderToDB(newOrder));
        if (error) {
          console.error("Supabase insert order error:", error);
          throw new Error(error.message);
        }
      } catch (err: any) {
        console.error("Supabase insert order exception:", err);
        throw err;
      }
    }

    // Only update local state if save to database succeeded (or if Supabase is not configured)
    const updated = [newOrder, ...orders];
    saveState('cheezo_orders', updated, setOrders);

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderDetails['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    saveState('cheezo_orders', updated, setOrders);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);
        if (error) console.error("Supabase update order status error:", error);
      } catch (err) {
        console.error("Supabase update order status exception:", err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        coupons,
        orders,
        popupSettings,
        banners,
        deliverySettings,
        isAdminLoggedIn,
        isSupabaseConnected,
        supabaseError,
        isLoading,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductHidden,
        toggleProductStock,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryHidden,
        sortCategories,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponEnabled,
        updatePopupSettings,
        updateBanners,
        addBanner,
        deleteBanner,
        toggleBannerEnabled,
        updateDeliverySettings,
        deliveryAreas,
        selectedAreaId,
        setSelectedAreaId,
        selectedArea,
        addDeliveryArea,
        updateDeliveryArea,
        deleteDeliveryArea,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

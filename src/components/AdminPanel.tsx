import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category, Coupon, OrderDetails, BannerItem, DeliverySettings } from '../types';
import {
  Settings,
  Layers,
  ShoppingBag,
  Tag,
  AlertCircle,
  Trash2,
  Edit,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  LogOut,
  Key,
  FileText,
  LayoutGrid,
  Truck,
  Sparkles,
  Search,
  PlusCircle,
  TrendingUp,
  Bell,
  HelpCircle,
  MapPin,
  Database
} from 'lucide-react';
import CheezoLogo from './CheezoLogo';
import { SETUP_SQL_QUERY } from '../lib/supabase';

export default function AdminPanel({ onClose }: { onClose?: () => void }) {
  const {
    products,
    categories,
    coupons,
    orders,
    popupSettings,
    banners,
    deliverySettings,
    isAdminLoggedIn,
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
    updateOrderStatus,
    deliveryAreas,
    addDeliveryArea,
    updateDeliveryArea,
    deleteDeliveryArea,
    isSupabaseConnected,
    supabaseError
  } = useApp();

  // Navigation states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'coupons' | 'popups' | 'banners' | 'delivery' | 'areas' | 'settings' | 'supabase'>('dashboard');

  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  
  // Forgot password placeholder
  const [showForgotPlaceholder, setShowForgotPlaceholder] = useState(false);

  // Password change states
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // --- Modals and Form states ---
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Category Edit State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  // Coupon Edit State
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isNewCoupon, setIsNewCoupon] = useState(false);

  // Banner states
  const [bannerTypeFilter, setBannerTypeFilter] = useState<'all' | 'slider' | 'homepage' | 'festival' | 'offer'>('all');
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isNewBanner, setIsNewBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  // Order List states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  // Fresh product form values
  const [prodForm, setProdForm] = useState({
    name: '',
    name_hi: '',
    category: '',
    weight: '500g',
    price: 0,
    originalPrice: 0,
    image: '',
    imagesInput: '', // Comma separated extra images
    description: '',
    description_hi: '',
    isHalal: true,
    bestSeller: false,
    featured: false,
    recommended: false,
    stockQuantity: 50,
    inStock: true
  });

  // Fresh Category Form
  const [catForm, setCatForm] = useState({
    name: '',
    name_hi: '',
    icon: 'Grid',
    image: '',
    sortOrder: 0
  });

  // Fresh Coupon Form
  const [couponForm, setCouponForm] = useState<Coupon>({
    code: '',
    discountType: 'fixed',
    value: 0,
    minPurchase: 0,
    maxDiscount: undefined,
    expiryDate: '',
    usageLimit: 100,
    usageCount: 0,
    description: '',
    description_hi: '',
    enabled: true
  });

  // Fresh Banner Form
  const [bannerForm, setBannerForm] = useState({
    title: '',
    title_hi: '',
    subtitle: '',
    subtitle_hi: '',
    discountText: '',
    discountText_hi: '',
    code: '',
    bgGradient: 'from-red-600 to-amber-500',
    image: '',
    enabled: true,
    type: 'slider' as BannerItem['type'],
    buttonText: '',
    buttonText_hi: '',
    buttonLink: '',
    sortOrder: 0
  });

  // Popup form
  const [popupForm, setPopupForm] = useState({ ...popupSettings });

  // Delivery settings form
  const [deliveryForm, setDeliveryForm] = useState({ ...deliverySettings });
  const [newSlotInput, setNewSlotInput] = useState('');

  // Sync form states with live context settings
  useEffect(() => {
    setDeliveryForm({ ...deliverySettings });
  }, [deliverySettings]);

  useEffect(() => {
    setPopupForm({ ...popupSettings });
  }, [popupSettings]);

  // Delivery Area form states
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isNewArea, setIsNewArea] = useState(true);
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [areaForm, setAreaForm] = useState({
    name: '',
    name_hi: '',
    enabled: true,
    deliveryCharge: 39,
    acceptingOrders: true,
    noticeMessage: '',
    noticeMessage_hi: ''
  });

  const handleOpenAreaModal = (area?: any) => {
    if (area) {
      setEditingAreaId(area.id);
      setAreaForm({
        name: area.name,
        name_hi: area.name_hi || '',
        enabled: area.enabled !== false,
        deliveryCharge: area.deliveryCharge,
        acceptingOrders: area.acceptingOrders !== false,
        noticeMessage: area.noticeMessage || '',
        noticeMessage_hi: area.noticeMessage_hi || ''
      });
      setIsNewArea(false);
    } else {
      setEditingAreaId(null);
      setAreaForm({
        name: '',
        name_hi: '',
        enabled: true,
        deliveryCharge: 39,
        acceptingOrders: true,
        noticeMessage: '',
        noticeMessage_hi: ''
      });
      setIsNewArea(true);
    }
    setIsAreaModalOpen(true);
  };

  const handleAreaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewArea) {
      addDeliveryArea({
        name: areaForm.name,
        name_hi: areaForm.name_hi,
        enabled: areaForm.enabled,
        deliveryCharge: areaForm.deliveryCharge,
        acceptingOrders: areaForm.acceptingOrders,
        noticeMessage: areaForm.noticeMessage,
        noticeMessage_hi: areaForm.noticeMessage_hi
      });
    } else if (editingAreaId) {
      updateDeliveryArea({
        id: editingAreaId,
        name: areaForm.name,
        name_hi: areaForm.name_hi,
        enabled: areaForm.enabled,
        deliveryCharge: areaForm.deliveryCharge,
        acceptingOrders: areaForm.acceptingOrders,
        noticeMessage: areaForm.noticeMessage,
        noticeMessage_hi: areaForm.noticeMessage_hi
      });
    }
    setIsAreaModalOpen(false);
  };

  // --- Auth Handler ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() !== 'admin') {
      setLoginError('Invalid Username or Password.');
      return;
    }
    const success = loginAdmin(password);
    if (success) {
      setLoginError('');
    } else {
      setLoginError('Invalid Username or Password.');
    }
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('New passwords do not match');
      return;
    }
    if (newPasswordInput.length < 6) {
      setPasswordChangeError('Password must be at least 6 characters long');
      return;
    }
    const success = loginAdmin(currentPasswordInput);
    if (!success) {
      setPasswordChangeError('Current password is incorrect');
      return;
    }
    changeAdminPassword(newPasswordInput);
    setPasswordChangeSuccess(true);
    setPasswordChangeError('');
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => setPasswordChangeSuccess(false), 4000);
  };

  // --- Calculations for Analytics cards ---
  const totalProductsCount = products.length;
  const totalCategoriesCount = categories.length;
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const completedOrdersCount = orders.filter(o => o.status === 'completed').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'cancelled').length;

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  // Today's Sales
  const today = new Date().toDateString();
  const todaySales = orders
    .filter(o => o.status === 'completed' && new Date(o.createdAt).toDateString() === today)
    .reduce((sum, o) => sum + o.grandTotal, 0);

  // Weekly Sales (last 7 days)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklySales = orders
    .filter(o => o.status === 'completed' && new Date(o.createdAt).getTime() >= oneWeekAgo)
    .reduce((sum, o) => sum + o.grandTotal, 0);

  // Monthly Sales (last 30 days)
  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const monthlySales = orders
    .filter(o => o.status === 'completed' && new Date(o.createdAt).getTime() >= oneMonthAgo)
    .reduce((sum, o) => sum + o.grandTotal, 0);

  // Unique customers
  const uniquePhones = new Set(orders.map(o => o.phone.trim()));
  const totalCustomers = uniquePhones.size || Math.max(1, orders.length - 1);

  // --- Product Form Actions ---
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProdForm({
        name: prod.name,
        name_hi: prod.name_hi || '',
        category: prod.category,
        weight: prod.weight,
        price: prod.price,
        originalPrice: prod.originalPrice,
        image: prod.image,
        imagesInput: prod.images ? prod.images.join(', ') : prod.image,
        description: prod.description,
        description_hi: prod.description_hi || '',
        isHalal: prod.isHalal,
        bestSeller: !!prod.bestSeller,
        featured: !!prod.featured,
        recommended: !!prod.recommended,
        stockQuantity: prod.stockQuantity ?? 50,
        inStock: prod.inStock ?? true
      });
      setIsNewProduct(false);
    } else {
      setEditingProduct(null);
      setProdForm({
        name: '',
        name_hi: '',
        category: categories[1]?.id || 'curry-cut',
        weight: '500g',
        price: 150,
        originalPrice: 199,
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
        imagesInput: '',
        description: 'Tender and juicy, fresh halal meat packed hygienically for premium food preparation.',
        description_hi: '',
        isHalal: true,
        bestSeller: false,
        featured: false,
        recommended: false,
        stockQuantity: 40,
        inStock: true
      });
      setIsNewProduct(true);
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImages = prodForm.imagesInput
      ? prodForm.imagesInput.split(',').map(img => img.trim()).filter(Boolean)
      : [prodForm.image];

    const prodData = {
      name: prodForm.name,
      name_hi: prodForm.name_hi,
      category: prodForm.category,
      weight: prodForm.weight,
      price: Number(prodForm.price),
      originalPrice: Number(prodForm.originalPrice),
      image: prodForm.image || cleanImages[0] || 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=600&auto=format&fit=crop&q=80',
      images: cleanImages,
      description: prodForm.description,
      description_hi: prodForm.description_hi,
      isHalal: prodForm.isHalal,
      bestSeller: prodForm.bestSeller,
      featured: prodForm.featured,
      recommended: prodForm.recommended,
      stockQuantity: Number(prodForm.stockQuantity),
      inStock: Number(prodForm.stockQuantity) > 0 && prodForm.inStock
    };

    if (isNewProduct) {
      addProduct(prodData);
    } else if (editingProduct) {
      updateProduct({
        ...prodData,
        id: editingProduct.id,
        hidden: editingProduct.hidden
      });
    }
    setIsProductModalOpen(false);
  };

  // --- Category Form Actions ---
  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatForm({
        name: cat.name,
        name_hi: cat.name_hi || '',
        icon: cat.icon || 'Grid',
        image: cat.image,
        sortOrder: cat.sortOrder || 0
      });
      setIsNewCategory(false);
    } else {
      setEditingCategory(null);
      setCatForm({
        name: '',
        name_hi: '',
        icon: 'Grid',
        image: 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=150&auto=format&fit=crop&q=80',
        sortOrder: categories.length
      });
      setIsNewCategory(true);
    }
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catData = {
      name: catForm.name,
      name_hi: catForm.name_hi,
      icon: catForm.icon,
      image: catForm.image || 'https://images.unsplash.com/photo-1587593817642-8b9a751c1a20?w=150&auto=format&fit=crop&q=80',
      sortOrder: Number(catForm.sortOrder)
    };

    if (isNewCategory) {
      addCategory(catData);
    } else if (editingCategory) {
      updateCategory({
        ...catData,
        id: editingCategory.id,
        hidden: editingCategory.hidden
      });
    }
    setIsCategoryModalOpen(false);
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newList = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    
    // Swap
    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;
    
    sortCategories(newList);
  };

  // --- Coupon Form Actions ---
  const handleOpenCouponModal = (c?: Coupon) => {
    if (c) {
      setEditingCoupon(c);
      setCouponForm({
        ...c,
        description_hi: c.description_hi || ''
      });
      setIsNewCoupon(false);
    } else {
      setEditingCoupon(null);
      setCouponForm({
        code: '',
        discountType: 'fixed',
        value: 50,
        minPurchase: 299,
        maxDiscount: undefined,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 100,
        usageCount: 0,
        description: 'Save ₹50 on order above ₹299',
        description_hi: '',
        enabled: true
      });
      setIsNewCoupon(true);
    }
    setIsCouponModalOpen(true);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewCoupon) {
      addCoupon(couponForm);
    } else {
      updateCoupon(couponForm);
    }
    setIsCouponModalOpen(false);
  };

  // --- Banner Form Actions ---
  const handleOpenBannerModal = (b?: BannerItem) => {
    if (b) {
      setEditingBanner(b);
      setBannerForm({
        title: b.title,
        title_hi: b.title_hi || '',
        subtitle: b.subtitle,
        subtitle_hi: b.subtitle_hi || '',
        discountText: b.discountText,
        discountText_hi: b.discountText_hi || '',
        code: b.code,
        bgGradient: b.bgGradient || 'from-red-600 to-amber-500',
        image: b.image,
        enabled: b.enabled,
        type: b.type,
        buttonText: b.buttonText || '',
        buttonText_hi: b.buttonText_hi || '',
        buttonLink: b.buttonLink || '',
        sortOrder: b.sortOrder ?? 0
      });
      setIsNewBanner(false);
    } else {
      setEditingBanner(null);
      setBannerForm({
        title: '',
        title_hi: '',
        subtitle: '',
        subtitle_hi: '',
        discountText: '',
        discountText_hi: '',
        code: '',
        bgGradient: 'from-zinc-900 via-red-950 to-zinc-900',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80',
        enabled: true,
        type: 'slider',
        buttonText: '',
        buttonText_hi: '',
        buttonLink: '',
        sortOrder: banners.filter(b => b.type === 'slider').length
      });
      setIsNewBanner(true);
    }
    setIsBannerModalOpen(true);
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bData = {
      title: bannerForm.title,
      title_hi: bannerForm.title_hi,
      subtitle: bannerForm.subtitle,
      subtitle_hi: bannerForm.subtitle_hi,
      discountText: bannerForm.discountText,
      discountText_hi: bannerForm.discountText_hi,
      code: bannerForm.code,
      bgGradient: bannerForm.bgGradient,
      image: bannerForm.image,
      enabled: bannerForm.enabled,
      type: bannerForm.type,
      buttonText: bannerForm.buttonText || undefined,
      buttonText_hi: bannerForm.buttonText_hi || undefined,
      buttonLink: bannerForm.buttonLink || undefined,
      sortOrder: bannerForm.sortOrder
    };

    if (isNewBanner) {
      addBanner(bData);
    } else if (editingBanner) {
      updateBanners(banners.map(b => b.id === editingBanner.id ? { ...bData, id: editingBanner.id } : b));
    }
    setIsBannerModalOpen(false);
  };

  // --- Popup Manager Submit ---
  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePopupSettings(popupForm);
    alert('Offer Popup Settings Updated successfully!');
  };

  // --- Delivery Settings Actions ---
  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliverySettings(deliveryForm);
    alert('Delivery configuration saved successfully!');
  };

  const handleAddSlot = () => {
    if (!newSlotInput.trim()) return;
    setDeliveryForm({
      ...deliveryForm,
      deliverySlots: [...deliveryForm.deliverySlots, newSlotInput.trim()]
    });
    setNewSlotInput('');
  };

  const handleRemoveSlot = (index: number) => {
    setDeliveryForm({
      ...deliveryForm,
      deliverySlots: deliveryForm.deliverySlots.filter((_, i) => i !== index)
    });
  };

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.description.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtering orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.phone.includes(orderSearch) ||
                          o.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- UNLOGGED LOGIN SCREEN ---
  if (!isAdminLoggedIn) {
    return (
      <div 
        className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans"
        id="admin-login-view"
      >
        <div className="absolute top-6 left-6 flex items-center">
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-white flex items-center gap-1 text-xs font-bold border border-zinc-800 rounded-xl px-4 py-2 hover:bg-zinc-900 cursor-pointer"
          >
            ← BACK TO STOREFRONT
          </button>
        </div>

        <div className="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center">
            <CheezoLogo variant="full" size="md" showTagline={true} />
            <div className="mt-6">
              <span className="text-[10px] bg-red-600/20 text-red-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-red-500/30">
                Secure Portal
              </span>
              <h2 className="mt-3 text-2xl font-display font-black text-white tracking-tight">
                Staff Authentication
              </h2>
              <p className="mt-1.5 text-xs text-zinc-400">
                Log in with your official administrator credentials.
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-left text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="Enter administrator username"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-left text-xs font-black text-zinc-400 uppercase tracking-wider">
                  Secret Key / Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPlaceholder(!showForgotPlaceholder)}
                  className="text-xs text-red-500 hover:text-red-400 font-bold hover:underline cursor-pointer"
                >
                  Forgot Secret?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-red-600 transition-colors pr-10"
                  placeholder="••••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-3 text-red-400 text-xs text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {showForgotPlaceholder && (
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 text-amber-300 text-xs text-left">
                <strong>Password Note:</strong> For development and preview purposes, the default administrator credentials are:
                <div className="font-mono bg-zinc-950 p-2 rounded-lg mt-2 text-white">
                  Username: <span className="text-amber-400">admin</span><br />
                  Password: <span className="text-emerald-400">325250</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center text-xs text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-800 text-red-600 focus:ring-0 mr-2 w-4 h-4"
                />
                Remember this browser session
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ACCESS ADMINISTRATOR INTERFACE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-zinc-500">
            Authorized personnel only. Activities are audited under standard cryptographic logs.
          </p>
        </div>
      </div>
    );
  }

  // --- LOGGED-IN ADMIN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col md:flex-row" id="admin-workspace">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="scale-75 origin-left">
            <CheezoLogo variant="dark" size="sm" showTagline={false} />
          </div>
          <span className="text-[9px] bg-red-600/20 text-red-500 font-black px-2 py-0.5 rounded-md border border-red-600/30 tracking-wider">
            ADMIN
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutGrid },
            { id: 'products', label: 'Product Manager', icon: ShoppingBag },
            { id: 'categories', label: 'Category Manager', icon: Layers },
            { id: 'coupons', label: 'Coupon & Offers', icon: Tag },
            { id: 'popups', label: 'Popup Campaigner', icon: Sparkles },
            { id: 'banners', label: 'Banner & Sliders', icon: FileText },
            { id: 'delivery', label: 'Delivery Settings', icon: Truck },
            { id: 'areas', label: 'Delivery Areas', icon: MapPin },
            { id: 'supabase', label: 'Supabase Sync', icon: Database },
            { id: 'settings', label: 'Security & Access', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer text-left ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/10' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Exit Storefront link & Logout */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {onClose && (
            <button
              onClick={onClose}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>← GO TO STOREFRONT</span>
            </button>
          )}

          <button
            onClick={() => {
              logoutAdmin();
              if (onClose) onClose();
            }}
            className="w-full bg-red-950/30 hover:bg-red-950/50 text-red-400 hover:text-red-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-red-900/30"
          >
            <LogOut className="w-4 h-4" />
            <span>DISCONNECT PORTAL</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 text-left">
        
        {/* Top bar */}
        <header className="bg-zinc-900/50 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-display font-black text-white tracking-tight uppercase">
              {activeTab} Management Panel
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {isSupabaseConnected ? (
              <div className="flex items-center gap-2 bg-emerald-950/50 border border-emerald-900/30 rounded-xl px-3 py-1.5 text-[10px] text-emerald-400 font-bold">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>SUPABASE ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-amber-950/50 border border-amber-900/30 rounded-xl px-3 py-1.5 text-[10px] text-amber-400 font-bold">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                <span>LOCAL SANDBOX</span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 rounded-xl px-3 py-1.5 text-[10px] text-zinc-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>LOGGED IN AS ADMIN</span>
            </div>
            
            {onClose && (
              <button 
                onClick={onClose} 
                className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Return to Store"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>

        {/* View Details */}
        <div className="p-6 space-y-6">
          
          {/* ====================================================================== */}
          {/* TAB: OVERVIEW DASHBOARD */}
          {/* ====================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6" id="overview-tab">
              {/* Metric stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Revenue stats */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-4 right-4 p-2 bg-emerald-950 text-emerald-400 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">Total Revenue</span>
                  <span className="text-2xl font-display font-black text-white block mt-2">₹{totalRevenue.toLocaleString()}</span>
                  <div className="text-[10px] text-emerald-400 font-bold mt-1">From Completed Orders</div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-4 right-4 p-2 bg-amber-950 text-amber-400 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">Monthly Sales</span>
                  <span className="text-2xl font-display font-black text-white block mt-2">₹{monthlySales.toLocaleString()}</span>
                  <div className="text-[10px] text-zinc-400 mt-1">Last 30 Days</div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-4 right-4 p-2 bg-red-950 text-red-400 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">Today's Sales</span>
                  <span className="text-2xl font-display font-black text-white block mt-2">₹{todaySales.toLocaleString()}</span>
                  <div className="text-[10px] text-zinc-400 mt-1">Instant Orders Live</div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-4 right-4 p-2 bg-zinc-850 text-zinc-400 rounded-xl">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider block">Total Customers</span>
                  <span className="text-2xl font-display font-black text-white block mt-2">{totalCustomers}</span>
                  <div className="text-[10px] text-zinc-400 mt-1">Unique Verified Radiuses</div>
                </div>

              </div>

              {/* Order statuses stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] text-zinc-500 font-bold block">Total Orders</span>
                  <span className="text-xl font-display font-black text-white block mt-1">{totalOrdersCount}</span>
                </div>
                
                <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] text-amber-500 font-bold block">Pending Orders</span>
                  <span className="text-xl font-display font-black text-amber-400 block mt-1">{pendingOrdersCount}</span>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] text-emerald-500 font-bold block">Completed Orders</span>
                  <span className="text-xl font-display font-black text-emerald-400 block mt-1">{completedOrdersCount}</span>
                </div>

                <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3.5 text-center">
                  <span className="text-[10px] text-red-500 font-bold block">Cancelled Orders</span>
                  <span className="text-xl font-display font-black text-red-400 block mt-1">{cancelledOrdersCount}</span>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 text-center col-span-2 md:col-span-1">
                  <span className="text-[10px] text-zinc-500 font-bold block">Products / Cats</span>
                  <span className="text-md font-display font-black text-white block mt-1">
                    {totalProductsCount} Prod / {totalCategoriesCount} Cat
                  </span>
                </div>

              </div>

              {/* RECENT ORDERS TABLE */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-black text-md text-white">Live Transactions & Orders</h3>
                    <p className="text-xs text-zinc-400">Review status, update completion parameters and copy details.</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                      <input
                        type="text"
                        placeholder="Search customer, phone..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none w-full"
                      />
                    </div>

                    <select
                      value={orderStatusFilter}
                      onChange={(e: any) => setOrderStatusFilter(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="p-12 text-center text-zinc-500 text-xs font-bold">
                    No orders matching search or filters found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-zinc-950 text-zinc-400 font-bold border-b border-zinc-800 text-left">
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Customer Details</th>
                          <th className="p-4">Items / Description</th>
                          <th className="p-4">Amount Paid</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Order Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {filteredOrders.map((order) => {
                          const dateObj = new Date(order.createdAt);
                          const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                          return (
                            <tr key={order.id} className="hover:bg-zinc-800/20">
                              <td className="p-4 font-mono font-black text-red-500">{order.id}</td>
                              <td className="p-4">
                                <div className="font-extrabold text-white">{order.customerName}</div>
                                <div className="text-zinc-400 font-mono mt-0.5">{order.phone}</div>
                                <div className="text-[10px] text-zinc-500 max-w-[180px] mt-0.5" title={order.address}>
                                  {order.address}
                                </div>
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                    order.orderType === 'Take Away' 
                                      ? 'bg-amber-950 text-amber-400 border border-amber-800/30' 
                                      : order.orderType === 'Scheduled Delivery' 
                                      ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/30' 
                                      : 'bg-red-950 text-red-400 border border-red-800/30'
                                  }`}>
                                    {order.orderType || 'Home Delivery'}
                                  </span>
                                  {order.orderType === 'Scheduled Delivery' && (
                                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[9px] font-bold">
                                      📅 {order.deliveryDate} @ {order.deliveryTime}
                                    </span>
                                  )}
                                </div>
                                {order.specialInstructions && (
                                  <div className="mt-1.5 bg-zinc-950/80 text-amber-400 border border-amber-900/20 rounded p-1 text-[10px] italic">
                                    💡 Notes: {order.specialInstructions}
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                <div className="space-y-0.5">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="text-zinc-300">
                                      {item.quantity}x {item.product.name} ({item.product.weight})
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 font-extrabold text-white">₹{order.grandTotal}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                  order.status === 'completed'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/30'
                                    : order.status === 'cancelled'
                                    ? 'bg-red-950 text-red-400 border border-red-800/30'
                                    : 'bg-amber-950 text-amber-400 border border-amber-800/30 animate-pulse'
                                }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4 text-zinc-400 font-mono text-[11px]">{formattedDate}</td>
                              <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                                {order.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'completed')}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-2.5 py-1 rounded-lg text-[10px] transition-colors cursor-pointer"
                                    >
                                      COMPLETE
                                    </button>
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                      className="bg-red-950 text-red-400 hover:bg-red-900 border border-red-800/30 font-bold px-2.5 py-1 rounded-lg text-[10px] transition-colors cursor-pointer"
                                    >
                                      CANCEL
                                    </button>
                                  </>
                                )}
                                {order.status !== 'pending' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'pending')}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold px-2.5 py-1 rounded-lg text-[10px] transition-colors cursor-pointer"
                                  >
                                    RESET TO PENDING
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB: PRODUCT MANAGEMENT */}
          {/* ====================================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6" id="products-tab">
              
              {/* Product control head */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <div className="text-left">
                  <h3 className="font-display font-black text-md text-white">Interactive Products Catalog</h3>
                  <p className="text-xs text-zinc-400">Total products loaded: {products.length}. Modify pricing, inventory thresholds and metadata.</p>
                </div>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD NEW PRODUCT</span>
                </button>
              </div>

              {/* Filters row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by product name or description..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none cursor-pointer w-full sm:w-48 text-left"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-zinc-950 text-zinc-400 font-bold border-b border-zinc-800 text-left">
                        <th className="p-4">Visual</th>
                        <th className="p-4">Product Name / Category</th>
                        <th className="p-4 font-mono">Weight</th>
                        <th className="p-4">MRP / Selling Price</th>
                        <th className="p-4">Stock Quantity</th>
                        <th className="p-4">Status & Badges</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {filteredProducts.map((prod) => {
                        const discountPct = prod.originalPrice > 0 
                          ? Math.round((1 - prod.price / prod.originalPrice) * 100) 
                          : 0;

                        return (
                          <tr key={prod.id} className={`hover:bg-zinc-800/20 ${prod.hidden ? 'opacity-50' : ''}`}>
                            <td className="p-4">
                              <img 
                                src={prod.image} 
                                alt={prod.name} 
                                className="w-10 h-10 object-cover rounded-lg border border-zinc-800" 
                              />
                            </td>
                            <td className="p-4">
                              <div className="font-extrabold text-white">{prod.name}</div>
                              <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-semibold">
                                {prod.category} {prod.isHalal && <span className="text-emerald-500">Halal✓</span>}
                              </div>
                            </td>
                            <td className="p-4 font-mono font-medium text-zinc-300">{prod.weight}</td>
                            <td className="p-4">
                              <div className="text-zinc-500 line-through text-[11px]">₹{prod.originalPrice}</div>
                              <div className="text-white font-extrabold">₹{prod.price}</div>
                              {discountPct > 0 && (
                                <span className="text-[9px] bg-red-950 text-red-400 font-black px-1.5 py-0.5 rounded-md">
                                  -{discountPct}% OFF
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="font-mono font-bold text-white">{prod.stockQuantity} Pcs</div>
                              <button
                                onClick={() => toggleProductStock(prod.id)}
                                className={`text-[10px] font-black uppercase tracking-wide mt-1 block hover:underline cursor-pointer ${
                                  prod.inStock ? 'text-emerald-400' : 'text-red-400'
                                }`}
                              >
                                {prod.inStock ? 'IN STOCK✓' : 'OUT OF STOCK✗'}
                              </button>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {prod.bestSeller && (
                                  <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                                    Bestseller
                                  </span>
                                )}
                                {prod.featured && (
                                  <span className="text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                                    Featured
                                  </span>
                                )}
                                {prod.recommended && (
                                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                                    Recommended
                                  </span>
                                )}
                                {prod.hidden && (
                                  <span className="text-[9px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded-full font-bold">
                                    Hidden
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenProductModal(prod)}
                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-1.5 rounded-lg inline-flex items-center justify-center cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => duplicateProduct(prod.id)}
                                className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 p-1.5 rounded-lg inline-flex items-center justify-center cursor-pointer"
                                title="Duplicate Product"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => toggleProductHidden(prod.id)}
                                className={`p-1.5 rounded-lg inline-flex items-center justify-center cursor-pointer ${
                                  prod.hidden ? 'bg-red-950/40 text-red-400' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                                title={prod.hidden ? 'Publish Product' : 'Hide Product'}
                              >
                                {prod.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                    deleteProduct(prod.id);
                                  }
                                }}
                                className="bg-red-950 hover:bg-red-900 text-red-400 p-1.5 rounded-lg inline-flex items-center justify-center cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB: CATEGORY MANAGEMENT */}
          {/* ====================================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6" id="categories-tab">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <div className="text-left">
                  <h3 className="font-display font-black text-md text-white">Category Directory Manager</h3>
                  <p className="text-xs text-zinc-400">Total active categories: {categories.length}. Sort hierarchy, upload images, and control store navigation.</p>
                </div>
                <button
                  onClick={() => handleOpenCategoryModal()}
                  className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD CATEGORY</span>
                </button>
              </div>

              {/* Category Grid list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, idx) => (
                  <div 
                    key={cat.id} 
                    className={`bg-zinc-900 border rounded-2xl p-4 flex items-center justify-between gap-4 relative overflow-hidden ${
                      cat.hidden ? 'border-zinc-800 opacity-60' : 'border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-500 font-mono uppercase tracking-wider">
                          ID: {cat.id}
                        </div>
                        <h4 className="text-sm font-black text-white">{cat.name}</h4>
                        <div className="text-[10px] text-zinc-400 mt-1">
                          Icon identifier: <span className="font-mono text-amber-400">{cat.icon || 'Grid'}</span>
                        </div>
                        {cat.hidden && (
                          <span className="text-[9px] bg-red-950 text-red-400 px-2 py-0.5 rounded-md mt-1.5 inline-block font-extrabold uppercase">
                            HIDDEN
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* Sorting Controls */}
                      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-850">
                        <button
                          onClick={() => handleMoveCategory(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:text-white text-zinc-500 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveCategory(idx, 'down')}
                          disabled={idx === categories.length - 1}
                          className="p-1 hover:text-white text-zinc-500 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Editing Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenCategoryModal(cat)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-1.5 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => toggleCategoryHidden(cat.id)}
                          className={`p-1.5 rounded-lg cursor-pointer ${
                            cat.hidden ? 'bg-red-950/40 text-red-400' : 'bg-zinc-800 text-zinc-400'
                          }`}
                          title="Toggle Hidden"
                        >
                          {cat.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${cat.name} category? All products in it may lose their category link.`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="bg-red-950 hover:bg-red-900 text-red-400 p-1.5 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB: COUPON MANAGEMENT */}
          {/* ====================================================================== */}
          {activeTab === 'coupons' && (
            <div className="space-y-6" id="coupons-tab">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <div className="text-left">
                  <h3 className="font-display font-black text-md text-white">Promo & Coupon Manager</h3>
                  <p className="text-xs text-zinc-400">Total coupons active: {coupons.length}. Issue flat discounts, percentage bounds or minimum purchase rules.</p>
                </div>
                <button
                  onClick={() => handleOpenCouponModal()}
                  className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>CREATE COUPON</span>
                </button>
              </div>

              {/* Coupons list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <div 
                    key={coupon.code} 
                    className={`bg-zinc-900 border rounded-2xl p-5 text-left relative overflow-hidden flex flex-col justify-between ${
                      coupon.enabled ? 'border-zinc-800' : 'border-red-900/40 opacity-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[10px] bg-red-600/20 text-red-500 font-black px-2 py-0.5 rounded-md border border-red-600/30 font-mono tracking-wider">
                          {coupon.code}
                        </span>
                        <h4 className="text-sm font-black text-white mt-2">
                          {coupon.discountType === 'fixed' ? 'Flat ₹' : ''}{coupon.value}{coupon.discountType === 'percentage' ? '% Off' : ' Off'}
                        </h4>
                        <p className="text-xs text-zinc-300 mt-1">{coupon.description}</p>
                      </div>

                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          coupon.enabled 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/30' 
                            : 'bg-red-950 text-red-400 border border-red-800/30'
                        }`}>
                          {coupon.enabled ? 'ACTIVE✓' : 'DISABLED✗'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-zinc-800/60 my-4 pt-3 grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                      <div>Min Purchase: <strong className="text-white">₹{coupon.minPurchase}</strong></div>
                      {coupon.maxDiscount ? (
                        <div>Max Discount: <strong className="text-white">₹{coupon.maxDiscount}</strong></div>
                      ) : (
                        <div>Max Discount: <strong className="text-zinc-500">No Limit</strong></div>
                      )}
                      <div>Used Counter: <strong className="text-white">{coupon.usageCount ?? 0} / {coupon.usageLimit ?? 'No limit'}</strong></div>
                      {coupon.expiryDate ? (
                        <div>Expiry: <strong className="text-amber-400 font-mono">{coupon.expiryDate}</strong></div>
                      ) : (
                        <div>Expiry: <strong className="text-zinc-500">No expiry</strong></div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 border-t border-zinc-800/60 pt-3">
                      <button
                        onClick={() => handleOpenCouponModal(coupon)}
                        className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        EDIT PARAMETERS
                      </button>
                      <button
                        onClick={() => toggleCouponEnabled(coupon.code)}
                        className={`font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          coupon.enabled 
                            ? 'bg-amber-950 text-amber-400 hover:bg-amber-900' 
                            : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                        }`}
                      >
                        {coupon.enabled ? 'DISABLE' : 'ENABLE'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete coupon ${coupon.code}?`)) deleteCoupon(coupon.code);
                        }}
                        className="bg-red-950 hover:bg-red-900 text-red-400 p-1.5 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB: POPUP MANAGER */}
          {/* ====================================================================== */}
          {activeTab === 'popups' && (
            <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-left space-y-6" id="popups-tab">
              <div>
                <h3 className="font-display font-black text-md text-white">Promo Popup Campaign Manager</h3>
                <p className="text-xs text-zinc-400">Configure welcome discount overlay dialogs, delays, target codes, and visual hooks.</p>
              </div>

              <form onSubmit={handlePopupSubmit} className="space-y-4">
                
                <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-850 rounded-2xl">
                  <div>
                    <h4 className="text-xs font-extrabold text-white">Enable Welcome Popup</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Turns the popup on/off on the customer homepage.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPopupForm({ ...popupForm, enabled: !popupForm.enabled })}
                    className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                      popupForm.enabled ? 'bg-emerald-600' : 'bg-zinc-800'
                    }`}
                  >
                    <span className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                      popupForm.enabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Campaign Title (EN)</label>
                    <input
                      type="text"
                      required
                      value={popupForm.title}
                      onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Campaign Title (HI)</label>
                    <input
                      type="text"
                      value={popupForm.title_hi || ''}
                      onChange={(e) => setPopupForm({ ...popupForm, title_hi: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                      placeholder="उदा. पाइए फ्लैट ₹100 की छूट!"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Popup Delay (ms)</label>
                    <input
                      type="number"
                      required
                      value={popupForm.delay}
                      onChange={(e) => setPopupForm({ ...popupForm, delay: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Creative Image URL</label>
                  <input
                    type="text"
                    required
                    value={popupForm.image}
                    onChange={(e) => setPopupForm({ ...popupForm, image: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Campaign Description Text (EN)</label>
                    <textarea
                      required
                      rows={2}
                      value={popupForm.description}
                      onChange={(e) => setPopupForm({ ...popupForm, description: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Campaign Description Text (HI)</label>
                    <textarea
                      rows={2}
                      value={popupForm.description_hi || ''}
                      onChange={(e) => setPopupForm({ ...popupForm, description_hi: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                      placeholder="उदा. सीधे फॉर्म से आपकी रसोई तक डिलीवर किए जाने वाले प्रीमियम ताज़ा चिकन का आनंद लें!"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Button Callout (EN)</label>
                    <input
                      type="text"
                      required
                      value={popupForm.buttonText}
                      onChange={(e) => setPopupForm({ ...popupForm, buttonText: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Button Callout (HI)</label>
                    <input
                      type="text"
                      value={popupForm.buttonText_hi || ''}
                      onChange={(e) => setPopupForm({ ...popupForm, buttonText_hi: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                      placeholder="उदा. अभी दावा करें और कोड लागू करें"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Coupon Target Code</label>
                    <input
                      type="text"
                      required
                      value={popupForm.buttonLink}
                      onChange={(e) => setPopupForm({ ...popupForm, buttonLink: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-mono text-amber-400 uppercase"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  SAVE POPUP CAMPAIGN CONFIG
                </button>

              </form>
            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB: BANNER MANAGER */}
          {/* ====================================================================== */}
          {activeTab === 'banners' && (
            <div className="space-y-6" id="banners-tab">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <div className="text-left">
                  <h3 className="font-display font-black text-md text-white">Storefront Banners & Promos</h3>
                  <p className="text-xs text-zinc-400">Configure slide decks, festival announcements, and homepage cards.</p>
                </div>
                <button
                  onClick={() => handleOpenBannerModal()}
                  className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD BANNER CARD</span>
                </button>
              </div>

              {/* Type filtering */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Banners' },
                  { id: 'slider', label: 'Slider Hero Decks' },
                  { id: 'homepage', label: 'Homepage Banners' },
                  { id: 'festival', label: 'Festival Alerts' },
                  { id: 'offer', label: 'Instant Offer blocks' },
                ].map(bOpt => (
                  <button
                    key={bOpt.id}
                    onClick={() => setBannerTypeFilter(bOpt.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      bannerTypeFilter === bOpt.id 
                        ? 'bg-red-600 text-white' 
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-850'
                    }`}
                  >
                    {bOpt.label}
                  </button>
                ))}
              </div>

              {/* Banners display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners
                  .filter(b => bannerTypeFilter === 'all' || b.type === bannerTypeFilter)
                  .map((bItem) => (
                    <div 
                      key={bItem.id} 
                      className={`bg-zinc-900 border rounded-2xl overflow-hidden flex flex-col justify-between ${
                        bItem.enabled ? 'border-zinc-800' : 'border-red-950/40 opacity-50'
                      }`}
                    >
                      <div className="p-4 bg-zinc-950 flex items-center justify-between border-b border-zinc-850">
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 font-black px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
                          Type: {bItem.type}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold ${bItem.enabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {bItem.enabled ? 'ACTIVE✓' : 'DISABLED✗'}
                          </span>
                          <button
                            onClick={() => toggleBannerEnabled(bItem.id)}
                            className={`w-10 h-6 rounded-full transition-all cursor-pointer relative ${
                              bItem.enabled ? 'bg-emerald-600' : 'bg-zinc-800'
                            }`}
                          >
                            <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                              bItem.enabled ? 'left-5' : 'left-1'
                            }`} />
                          </button>
                        </div>
                      </div>

                      {/* Store Mockup visual preview */}
                      <div className="p-4 flex-1">
                        <div className={`rounded-xl p-4 text-white text-left flex items-center justify-between gap-4 bg-gradient-to-r ${bItem.bgGradient || 'from-red-600 to-amber-500'}`}>
                          <div className="space-y-1">
                            <span className="text-[9px] bg-white/20 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-widest block w-fit">
                              {bItem.discountText || 'OFFER'}
                            </span>
                            <h4 className="text-sm font-black tracking-tight">{bItem.title || 'Welcome Offer'}</h4>
                            <p className="text-[10px] text-white/80 max-w-[200px] truncate">{bItem.subtitle || 'Fresh halal meat delivered instantly'}</p>
                            {bItem.code && (
                              <div className="text-[9px] font-mono font-bold text-amber-300">Code: {bItem.code}</div>
                            )}
                          </div>
                          
                          <div className="w-16 h-16 rounded-lg bg-white/10 overflow-hidden shrink-0">
                            <img src={bItem.image} alt="Promo" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 border-t border-zinc-850 bg-zinc-900/60 flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenBannerModal(bItem)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-[11px] px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                        >
                          EDIT BANNER
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete banner?')) deleteBanner(bItem.id);
                          }}
                          className="bg-red-950 hover:bg-red-900 text-red-400 p-1.5 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB: DELIVERY SETTINGS */}
          {/* ====================================================================== */}
          {activeTab === 'delivery' && (
            <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-left space-y-6" id="delivery-tab">
              <div>
                <h3 className="font-display font-black text-md text-white">Delivery Parameters Configuration</h3>
                <p className="text-xs text-zinc-400">Configure logistics, delivery fees, slot times, and checkout limits.</p>
              </div>

              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Minimum Order Value (₹)</label>
                    <input
                      type="number"
                      required
                      value={deliveryForm.minimumOrder}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, minimumOrder: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Flat Delivery Fee (₹)</label>
                    <input
                      type="number"
                      required
                      value={deliveryForm.deliveryCharge}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryCharge: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Free Delivery Above Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={deliveryForm.freeDeliveryThreshold}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Maximum Radius (km)</label>
                    <input
                      type="number"
                      required
                      value={deliveryForm.deliveryRadius}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryRadius: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Standard Delivery ETA Prompt</label>
                  <input
                    type="text"
                    required
                    value={deliveryForm.deliveryTime}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryTime: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Business WhatsApp Order Number</label>
                  <input
                    type="text"
                    required
                    value={deliveryForm.contactWhatsApp || ''}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, contactWhatsApp: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    placeholder="e.g. 918766717483"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1.5 block text-left">Specify the phone number with country code (e.g. 918766717483 for India). No spaces, pluses, or dashes.</span>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Official Brand Logo URL / Path</label>
                  <input
                    type="text"
                    required
                    value={deliveryForm.brandLogo || ''}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, brandLogo: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    placeholder="e.g. /src/assets/images/cheezo_brand_logo_1784325310903.jpg"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1.5 block text-left">The primary brand logo. You can enter an uploaded path, public URL, or base64. Defaults to the official premium CHEEZO logo.</span>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">App Icon URL / Path</label>
                  <input
                    type="text"
                    required
                    value={deliveryForm.appIcon || ''}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, appIcon: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    placeholder="e.g. /src/assets/images/cheezo_app_icon_1784325331060.jpg"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1.5 block text-left">The square app icon representing CHEEZO. Used on loading, splash, and navigation.</span>
                </div>

                {/* Delivery Slots */}
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Enabled Delivery Slots</label>
                  <div className="space-y-2 mb-3">
                    {deliveryForm.deliverySlots.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-850">
                        <span className="text-xs text-zinc-300 font-mono">{slot}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(index)}
                          className="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 08:00 PM - 11:00 PM"
                      value={newSlotInput}
                      onChange={(e) => setNewSlotInput(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSlot}
                      className="bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                    >
                      ADD SLOT
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  SAVE SYSTEM LOGISTICS
                </button>

              </form>
            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB: DELIVERY AREAS MANAGEMENT */}
          {/* ====================================================================== */}
          {activeTab === 'areas' && (
            <div className="space-y-6" id="areas-tab">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <div className="text-left">
                  <h3 className="font-display font-black text-md text-white">Delivery Areas Configurator</h3>
                  <p className="text-xs text-zinc-400">Configure separate delivery charges, toggle region status, or write notice banners.</p>
                </div>
                <button
                  onClick={() => handleOpenAreaModal()}
                  className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD DELIVERY AREA</span>
                </button>
              </div>

              {/* Areas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {deliveryAreas && deliveryAreas.map((area) => (
                  <div 
                    key={area.id} 
                    className={`bg-zinc-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all ${
                      area.enabled !== false ? 'border-zinc-800' : 'border-zinc-800/40 opacity-50 bg-zinc-950/40'
                    }`}
                  >
                    <div className="p-5 text-left space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                            <span>{area.name}</span>
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-bold block mt-0.5">हिन्दी: {area.name_hi || 'अनिर्धारित'}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            area.enabled !== false 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/30' 
                              : 'bg-zinc-900 text-zinc-500 border border-zinc-850'
                          }`}>
                            {area.enabled !== false ? 'Enabled' : 'Disabled'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            area.acceptingOrders !== false 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/30' 
                              : 'bg-amber-950 text-amber-500 border border-amber-800/30 animate-pulse'
                          }`}>
                            {area.acceptingOrders !== false ? 'Accepting Orders' : 'Orders Paused'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-zinc-950/60 p-3.5 rounded-xl space-y-1.5 border border-zinc-850 text-xs">
                        <div className="flex justify-between text-zinc-400">
                          <span>Delivery Fee:</span>
                          <span className="font-extrabold text-white">₹{area.deliveryCharge}</span>
                        </div>
                        {area.noticeMessage && (
                          <div className="border-t border-zinc-800/60 pt-2 mt-2">
                            <span className="text-[10px] text-amber-500 font-extrabold block">Notice Banner (EN):</span>
                            <p className="text-[10px] text-zinc-300 italic truncate mt-0.5">{area.noticeMessage}</p>
                            {area.noticeMessage_hi && (
                              <>
                                <span className="text-[10px] text-amber-600 font-extrabold block mt-1">Notice Banner (HI):</span>
                                <p className="text-[10px] text-zinc-400 italic truncate mt-0.5">{area.noticeMessage_hi}</p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-950 border-t border-zinc-850/60 flex items-center justify-between gap-2.5">
                      <button
                        onClick={() => handleOpenAreaModal(area)}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-extrabold text-[11px] py-2 rounded-xl transition-all cursor-pointer"
                      >
                        EDIT AREA
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${area.name} area? Customers will no longer be able to select it.`)) {
                            deleteDeliveryArea(area.id);
                          }
                        }}
                        className="bg-red-950 hover:bg-red-900 text-red-400 p-2 rounded-xl transition-all cursor-pointer border border-red-900/20"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB: SUPABASE SYNC */}
          {/* ====================================================================== */}
          {activeTab === 'supabase' && (
            <div className="space-y-6 max-w-4xl mx-auto text-left" id="supabase-tab">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="font-display font-black text-md text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    Supabase Database Synchronization Setup
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Connect your premium fresh halal chicken delivery store to Supabase for real-time customer and administrator sync.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Card */}
                  <div className={`p-5 rounded-2xl border ${
                    isSupabaseConnected 
                      ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300' 
                      : 'bg-amber-950/20 border-amber-900/30 text-amber-300'
                  }`}>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider mb-2">Connection Status</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-3 h-3 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} />
                      <strong className="text-white text-sm">
                        {isSupabaseConnected ? 'Real-time Supabase Connected ✓' : 'Local Storage Sandbox Mode'}
                      </strong>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-80">
                      {isSupabaseConnected 
                        ? 'All changes made in this dashboard are instantly synchronized with the customer website via Supabase Postgres replication.' 
                        : 'Credentials not configured. The application is running in fully functional Offline Sandbox mode using localStorage.'}
                    </p>
                  </div>

                  {/* Requirements Card */}
                  <div className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl">
                    <h4 className="font-extrabold text-xs text-white uppercase tracking-wider mb-2">Environment Config</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                      To activate the cloud database, specify these secrets in your project Settings or .env file:
                    </p>
                    <div className="space-y-1.5 font-mono text-[10px] bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-zinc-300 select-all">
                      <div>VITE_SUPABASE_URL="your-supabase-url"</div>
                      <div>VITE_SUPABASE_ANON_KEY="your-anon-key"</div>
                    </div>
                  </div>
                </div>

                {/* Database Setup SQL Box */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-white">Database Schema Setup (Required once)</h4>
                      <p className="text-[10px] text-zinc-500">Copy this schema SQL, paste it in your Supabase SQL Editor, and run it with one click.</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(SETUP_SQL_QUERY);
                        alert('SQL setup query copied to clipboard!');
                      }}
                      className="bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy SQL
                    </button>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden">
                    <div className="bg-zinc-900 px-4 py-2 text-[10px] font-mono text-zinc-500 border-b border-zinc-850 flex items-center justify-between">
                      <span>CHEEZO_SCHEMA_SETUP.SQL</span>
                      <span className="text-emerald-500 font-bold">Includes Realtime Replication Setup</span>
                    </div>
                    <pre className="p-4 text-[10px] font-mono text-zinc-300 max-h-60 overflow-y-auto overflow-x-auto text-left leading-normal whitespace-pre">
                      {SETUP_SQL_QUERY}
                    </pre>
                  </div>
                </div>

                {supabaseError && (
                  <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 text-red-400 text-xs flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                    <div>
                      <strong className="text-white block mb-1">Database Setup Pending</strong>
                      <span className="leading-relaxed opacity-90 block">{supabaseError}</span>
                      <span className="leading-relaxed opacity-75 block mt-2 text-[11px]">
                        Please make sure you have executed the schema setup SQL script above in your Supabase project SQL Editor to provision the tables and enable Postgres Realtime replication.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB: CHANGE PASSWORD / SECURITY */}
          {/* ====================================================================== */}
          {activeTab === 'settings' && (
            <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-left space-y-6" id="settings-tab">
              <div>
                <h3 className="font-display font-black text-md text-white flex items-center gap-1.5">
                  <Key className="w-5 h-5 text-red-500" />
                  <span>Update Administrator Secrets</span>
                </h3>
                <p className="text-xs text-zinc-400">Change your cryptographically hashed secret passcode for secure staff gateway operations.</p>
              </div>

              {passwordChangeSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-4 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Administrative passphrase modified successfully!</span>
                </div>
              )}

              {passwordChangeError && (
                <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-4 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{passwordChangeError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Current Secret Key</label>
                  <input
                    type="password"
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">New Secret Key</label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">Confirm New Secret Key</label>
                  <input
                    type="password"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    placeholder="Re-enter new password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  SAVE NEW PASSPHRASE
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* ====================================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ====================================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs text-zinc-100 font-sans">
          <div className="relative bg-zinc-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-zinc-800 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <h3 className="font-display font-black text-sm text-white uppercase">
                {isNewProduct ? 'Add Fresh Product Item' : `Edit Product Info: ${editingProduct?.name}`}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable body */}
            <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Product Name (English)</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="e.g. Fresh Chicken Keema Extra Lean"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Product Name (Hindi - हिन्दी)</label>
                  <input
                    type="text"
                    value={prodForm.name_hi || ''}
                    onChange={(e) => setProdForm({ ...prodForm, name_hi: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="उदा. फ्रेश चिकन कीमा"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Weight Description</label>
                  <input
                    type="text"
                    required
                    value={prodForm.weight}
                    onChange={(e) => setProdForm({ ...prodForm, weight: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="e.g. 500g or 4 Pieces (approx 450g)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodForm.originalPrice}
                    onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stockQuantity}
                    onChange={(e) => setProdForm({ ...prodForm, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Primary Image URL</label>
                <input
                  type="text"
                  required
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Multiple Images (Comma Separated URLs)</label>
                <input
                  type="text"
                  value={prodForm.imagesInput}
                  onChange={(e) => setProdForm({ ...prodForm, imagesInput: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  placeholder="Paste extra image URL 1, URL 2..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Description (English)</label>
                <textarea
                  required
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  placeholder="Clean boneless trims for protein preparations..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Description (Hindi - हिन्दी)</label>
                <textarea
                  rows={2}
                  value={prodForm.description_hi || ''}
                  onChange={(e) => setProdForm({ ...prodForm, description_hi: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  placeholder="उदा. प्रोटीन तैयारियों के लिए साफ बिना हड्डी के टुकड़े..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
                <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isHalal}
                    onChange={(e) => setProdForm({ ...prodForm, isHalal: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-red-600 mr-2 w-4 h-4 focus:ring-0"
                  />
                  Halal Certified ✓
                </label>

                <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.bestSeller}
                    onChange={(e) => setProdForm({ ...prodForm, bestSeller: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-red-600 mr-2 w-4 h-4 focus:ring-0"
                  />
                  Bestseller Badge
                </label>

                <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.featured}
                    onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-red-600 mr-2 w-4 h-4 focus:ring-0"
                  />
                  Featured Product
                </label>

                <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.recommended}
                    onChange={(e) => setProdForm({ ...prodForm, recommended: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-red-600 mr-2 w-4 h-4 focus:ring-0"
                  />
                  Recommended Product
                </label>

                <label className="flex items-center text-xs text-zinc-300 cursor-pointer col-span-2 border-t border-zinc-800/60 pt-2 mt-2">
                  <input
                    type="checkbox"
                    checked={prodForm.inStock}
                    onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-red-600 mr-2 w-4 h-4 focus:ring-0"
                  />
                  Available In Stock (Enable Purchase)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  {isNewProduct ? 'CREATE PRODUCT' : 'SAVE CHANGES'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ====================================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs text-zinc-100 font-sans">
          <div className="relative bg-zinc-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-800 flex flex-col">
            
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <h3 className="font-display font-black text-sm text-white uppercase">
                {isNewCategory ? 'Add Category Group' : `Edit Category: ${editingCategory?.name}`}
              </h3>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Category Name (English)</label>
                  <input
                    type="text"
                    required
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="e.g. Marinaded Specialities"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Category Name (Hindi - हिन्दी)</label>
                  <input
                    type="text"
                    value={catForm.name_hi || ''}
                    onChange={(e) => setCatForm({ ...catForm, name_hi: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="उदा. मैरिनेटेड विशेषताएं"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Lucide Icon ID</label>
                  <input
                    type="text"
                    required
                    value={catForm.icon}
                    onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                    placeholder="e.g. Grid, Scissors, Flame"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Priority Sort Order</label>
                  <input
                    type="number"
                    required
                    value={catForm.sortOrder}
                    onChange={(e) => setCatForm({ ...catForm, sortOrder: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Cover Image URL</label>
                <input
                  type="text"
                  required
                  value={catForm.image}
                  onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  {isNewCategory ? 'ADD CATEGORY' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: ADD / EDIT COUPON */}
      {/* ====================================================================== */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs text-zinc-100 font-sans">
          <div className="relative bg-zinc-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-800 flex flex-col">
            
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <h3 className="font-display font-black text-sm text-white uppercase">
                {isNewCoupon ? 'Create New Promo Coupon' : `Edit Coupon: ${editingCoupon?.code}`}
              </h3>
              <button 
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCouponSubmit} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Coupon Promo Code</label>
                <input
                  type="text"
                  required
                  disabled={!isNewCoupon}
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 uppercase font-mono tracking-wider disabled:opacity-50"
                  placeholder="e.g. FESTIVAL20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e: any) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="fixed">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Min Order Purchase (₹)</label>
                  <input
                    type="number"
                    required
                    value={couponForm.minPurchase}
                    onChange={(e) => setCouponForm({ ...couponForm, minPurchase: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={couponForm.maxDiscount || ''}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="Optional limit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Usage Limit Count</label>
                  <input
                    type="number"
                    required
                    value={couponForm.usageLimit || 100}
                    onChange={(e) => setCouponForm({ ...couponForm, usageLimit: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Expiry Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={couponForm.expiryDate || ''}
                    onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Description Display (English)</label>
                  <input
                    type="text"
                    required
                    value={couponForm.description}
                    onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="e.g. Save 10% on orders above ₹250"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Description Display (Hindi - हिन्दी)</label>
                  <input
                    type="text"
                    value={couponForm.description_hi || ''}
                    onChange={(e) => setCouponForm({ ...couponForm, description_hi: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="उदा. ₹250 से ऊपर के ऑर्डर पर 10% बचाएं"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  {isNewCoupon ? 'CREATE PROMO' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: ADD / EDIT BANNER */}
      {/* ====================================================================== */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs text-zinc-100 font-sans">
          <div className="relative bg-zinc-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-800 flex flex-col">
            
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <h3 className="font-display font-black text-sm text-white uppercase">
                {isNewBanner ? 'Add Banner Asset' : 'Edit Banner Asset Info'}
              </h3>
              <button 
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="p-6 space-y-4 text-left">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Banner Type</label>
                  <select
                    value={bannerForm.type}
                    onChange={(e: any) => setBannerForm({ ...bannerForm, type: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="slider">Hero Slider</option>
                    <option value="homepage">Homepage Banner</option>
                    <option value="festival">Festival Banner</option>
                    <option value="offer">Offer Banner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Tailwind Gradient</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.bgGradient}
                    onChange={(e) => setBannerForm({ ...bannerForm, bgGradient: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                    placeholder="from-amber-600 to-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Banner Headline / Title (English)</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="e.g. Juicy Chicken Drumsticks Combo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Banner Headline / Title (Hindi - हिन्दी)</label>
                  <input
                    type="text"
                    value={bannerForm.title_hi || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, title_hi: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="उदा. रसीला चिकन ड्रमस्टिक्स कॉम्बो"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Sub-headline / Description (English)</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="Fresh skinless drumsticks ready for frying"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Sub-headline / Description (Hindi - हिन्दी)</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle_hi || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle_hi: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="उदा. तलने के लिए तैयार ताजा बिना त्वचा के ड्रमस्टिक्स"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Discount Badge (EN)</label>
                  <input
                    type="text"
                    value={bannerForm.discountText}
                    onChange={(e) => setBannerForm({ ...bannerForm, discountText: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="e.g. GET FLAT ₹80 OFF"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Discount Badge (HI)</label>
                  <input
                    type="text"
                    value={bannerForm.discountText_hi || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, discountText_hi: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="उदा. फ्लैट ₹80 की छूट"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Coupon Target Code</label>
                  <input
                    type="text"
                    value={bannerForm.code}
                    onChange={(e) => setBannerForm({ ...bannerForm, code: e.target.value.toUpperCase() })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                    placeholder="e.g. CHEEZO80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Promo Image URL</label>
                <input
                  type="text"
                  required
                  value={bannerForm.image}
                  onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Button Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Button Text (English)</label>
                  <input
                    type="text"
                    value={bannerForm.buttonText}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="e.g. SHOP NOW"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Button Text (Hindi - हिन्दी)</label>
                  <input
                    type="text"
                    value={bannerForm.buttonText_hi}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonText_hi: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="उदा. अभी खरीदें"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Button Link / Target Anchor</label>
                  <input
                    type="text"
                    value={bannerForm.buttonLink}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonLink: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                    placeholder="e.g. #curry-cut or url"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Slider / Sort Order</label>
                  <input
                    type="number"
                    value={bannerForm.sortOrder}
                    onChange={(e) => setBannerForm({ ...bannerForm, sortOrder: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="0, 1, 2..."
                  />
                </div>
              </div>

              {/* Banner ON/OFF Toggle */}
              <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-850 rounded-2xl">
                <div>
                  <h4 className="text-xs font-extrabold text-white">Banner ON / OFF</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Show or hide this banner from customer screens.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBannerForm({ ...bannerForm, enabled: !bannerForm.enabled })}
                  className={`w-14 h-8 rounded-full transition-all cursor-pointer relative ${
                    bannerForm.enabled ? 'bg-emerald-600' : 'bg-zinc-800'
                  }`}
                >
                  <span className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                    bannerForm.enabled ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  {isNewBanner ? 'ADD BANNER' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: ADD / EDIT DELIVERY AREA */}
      {/* ====================================================================== */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs text-zinc-100 font-sans">
          <div className="relative bg-zinc-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-800 flex flex-col">
            
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
              <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
                {isNewArea ? 'Add Delivery Location' : `Edit Location Settings`}
              </h3>
              <button 
                onClick={() => setIsAreaModalOpen(false)}
                className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAreaSubmit} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Area Name (EN)</label>
                  <input
                    type="text"
                    required
                    value={areaForm.name}
                    onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="e.g. Virar West"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Area Name (HI)</label>
                  <input
                    type="text"
                    required
                    value={areaForm.name_hi}
                    onChange={(e) => setAreaForm({ ...areaForm, name_hi: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="उदा. विरार वेस्ट"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Delivery Charge (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={areaForm.deliveryCharge}
                  onChange={(e) => setAreaForm({ ...areaForm, deliveryCharge: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Status Toggles */}
              <div className="space-y-3.5 bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-white">Enable Delivery Area</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Let customers select this area from the storefront.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAreaForm({ ...areaForm, enabled: !areaForm.enabled })}
                    className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${
                      areaForm.enabled ? 'bg-emerald-600' : 'bg-zinc-800'
                    }`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                      areaForm.enabled ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/60 pt-3">
                  <div>
                    <h4 className="text-xs font-extrabold text-white">Accepting Orders</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Toggle to temporarily block or pause checkouts in this area.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAreaForm({ ...areaForm, acceptingOrders: !areaForm.acceptingOrders })}
                    className={`w-12 h-7 rounded-full transition-all cursor-pointer relative ${
                      areaForm.acceptingOrders ? 'bg-emerald-600' : 'bg-zinc-800'
                    }`}
                  >
                    <span className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                      areaForm.acceptingOrders ? 'left-6' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Notice Banners */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Temporary Notice (EN) - Optional</label>
                  <input
                    type="text"
                    value={areaForm.noticeMessage}
                    onChange={(e) => setAreaForm({ ...areaForm, noticeMessage: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="e.g. Back in 2 hours due to heavy rain"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-zinc-400 uppercase tracking-wider mb-1.5">Temporary Notice (HI) - Optional</label>
                  <input
                    type="text"
                    value={areaForm.noticeMessage_hi}
                    onChange={(e) => setAreaForm({ ...areaForm, noticeMessage_hi: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    placeholder="उदा. भारी बारिश के कारण २ घंटे में वापस आएंगे"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAreaModalOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  {isNewArea ? 'ADD AREA' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

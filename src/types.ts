export type Plan = 'free' | 'professional' | 'business';
export const PLAN_LIMITS: Record<Plan, { maxSites: number; price: number; label: string }> = {
  free: { maxSites: 1, price: 0, label: 'مجاني' },
  professional: { maxSites: 5, price: 49, label: 'احترافي' },
  business: { maxSites: Infinity, price: 99, label: 'أعمال' },
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  lastLogin?: string;
  plan: Plan;
  wallet: number;
  notifications?: AppNotification[];
  darkMode?: boolean;
}

export interface SiteTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  category: 'business' | 'ecommerce' | 'portfolio' | 'blog' | 'restaurant' | 'landing' | 'service' | 'realestate';
  thumbnail: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  layout: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
  sections: TemplateSection[];
  previewImages: string[];
}

export interface TemplateSection {
  id: string;
  type: 'hero' | 'features' | 'about' | 'products' | 'gallery' | 'contact' | 'testimonials' | 'pricing' | 'footer' | 'services' | 'team' | 'stats' | 'faq';
  title: string;
  content: string;
  enabled: boolean;
}

export interface Review {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  image: string;
  images?: string[];
  category: string;
  inStock: boolean;
  quantity?: number;
  sku?: string;
  featured?: boolean;
  reviews?: Review[];
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface OrderStatusLog {
  status: Order['status'];
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  siteId: string;
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  subtotal: number;
  discount: number;
  discountCode?: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  statusLog?: OrderStatusLog[];
  shippingMethod?: string;
  shippingCost?: number;
  notes?: string;
}

export interface SiteVisit {
  id: string;
  siteId: string;
  timestamp: string;
  page: string;
  device: 'desktop' | 'mobile' | 'tablet';
}

export interface SiteSettings {
  showHeader: boolean;
  showFooter: boolean;
  showContactForm: boolean;
  enableDarkMode: boolean;
  enableCart: boolean;
  enableOrders: boolean;
  enableReviews?: boolean;
  enableWishlist?: boolean;
  currency: string;
  seoTitle: string;
  seoDescription: string;
  logo?: string;
  favicon?: string;
  headerImage?: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    whatsapp: string;
    whatsappCustomer?: string;
    instapay?: string;
    tiktok: string;
    youtube: string;
  };
  enableInstaPay?: boolean;
  contactEmail: string;
  contactPhone: string;
  address: string;
  workingHours?: string;
  googleMapsUrl?: string;
  announcements?: string;
  customCss?: string;
  verified?: boolean;
  maintenanceMode?: boolean;
  shippingMethods?: ShippingMethod[];
  tax?: TaxSettings;
  seoPages?: SeoPage[];
}

export interface CustomerInfo {
  email: string;
  name: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  notes?: string;
}

export interface ClientSite {
  id: string;
  userId: string;
  templateId: string;
  siteName: string;
  siteSlug: string;
  description: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  sections: TemplateSection[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  visits: SiteVisit[];
  settings: SiteSettings;
  products: Product[];
  discountCodes: DiscountCode[];
  orders: Order[];
  contactMessages: ContactMessage[];
  categories: string[];
  wishlist?: WishlistItem[];
}

export interface DailyAnalytics {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'subscription' | 'withdrawal';
  amount: number;
  note: string;
  createdAt: string;
  confirmed: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  nameAr: string;
  cost: number;
  estimatedDays: string;
  enabled: boolean;
}

export interface TaxSettings {
  enabled: boolean;
  rate: number;
  name: string;
  nameAr: string;
}

export interface SeoPage {
  pageId: string;
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

export type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'create-site' | 'edit-site' | 'site-settings' | 'analytics' | 'admin' | 'view-site' | 'admin-login' | 'products' | 'orders' | 'discounts' | 'profile' | 'customers' | 'wishlist';

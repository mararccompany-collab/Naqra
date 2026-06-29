export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  lastLogin?: string;
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
    tiktok: string;
    youtube: string;
  };
  contactEmail: string;
  contactPhone: string;
  address: string;
  workingHours?: string;
  googleMapsUrl?: string;
  announcements?: string;
  customCss?: string;
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

export type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'create-site' | 'edit-site' | 'site-settings' | 'analytics' | 'admin' | 'view-site' | 'admin-login' | 'products' | 'orders' | 'discounts';

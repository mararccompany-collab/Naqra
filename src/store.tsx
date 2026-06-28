import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ClientSite, SiteTemplate, DailyAnalytics, Page, SiteVisit, Product, DiscountCode, Order, CartItem } from './types';
import { v4 as uuidv4 } from 'uuid';
import { loadSitesFromFirebase, saveSiteToFirebase, deleteSiteFromFirebase, saveUserToFirebase, loadUsersFromFirebase, subscribeToSites } from './utils/firebase';

interface AppState {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isLoading: boolean;
  users: User[];
  sites: ClientSite[];
  templates: SiteTemplate[];
  editingSite: ClientSite | null;
  setEditingSite: (s: ClientSite | null) => void;
  viewingSiteSlug: string | null;
  setViewingSiteSlug: (s: string | null) => void;
  cart: CartItem[];
  setCart: (items: CartItem[]) => void;
  registerUser: (name: string, email: string, password: string) => boolean;
  loginUser: (email: string, password: string) => boolean;
  loginAdmin: (password: string) => boolean;
  logout: () => void;
  createSite: (site: Omit<ClientSite, 'id' | 'createdAt' | 'updatedAt'>) => ClientSite;
  updateSite: (site: ClientSite) => void;
  deleteSite: (siteId: string) => void;
  getUserSites: () => ClientSite[];
  getSiteAnalytics: (siteId: string) => DailyAnalytics[];
  getAllAnalytics: () => DailyAnalytics[];
  recordVisit: (siteId: string, page: string) => void;
  deleteUser: (userId: string) => void;
  addProduct: (siteId: string, product: Product) => void;
  updateProduct: (siteId: string, product: Product) => void;
  deleteProduct: (siteId: string, productId: string) => void;
  addDiscountCode: (siteId: string, code: DiscountCode) => void;
  deleteDiscountCode: (siteId: string, codeId: string) => void;
  validateDiscountCode: (siteId: string, code: string) => DiscountCode | null;
  createOrder: (siteId: string, order: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (siteId: string, orderId: string, status: Order['status']) => void;
  getSiteBySlug: (slug: string) => ClientSite | undefined;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

const defaultTemplates: SiteTemplate[] = [
  {
    id: 't1',
    name: 'Business Pro',
    nameAr: 'شركات احترافي',
    description: 'قالب احترافي للشركات والأعمال مع تصميم عصري',
    category: 'business',
    thumbnail: '🏢',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    accentColor: '#f59e0b',
    layout: 'modern',
    previewImages: [],
    sections: [
      { id: 's1', type: 'hero', title: 'نحن نبني المستقبل', content: 'شركة رائدة في تقديم حلول الأعمال المبتكرة', enabled: true },
      { id: 's2', type: 'services', title: 'خدماتنا', content: 'نقدم مجموعة شاملة من الخدمات', enabled: true },
      { id: 's3', type: 'about', title: 'من نحن', content: 'خبرة تمتد لأكثر من 10 سنوات', enabled: true },
      { id: 's4', type: 'stats', title: 'إنجازاتنا', content: 'أرقام تتحدث عن نجاحنا', enabled: true },
      { id: 's5', type: 'testimonials', title: 'عملاؤنا يتحدثون', content: 'آراء من شركائنا في النجاح', enabled: true },
      { id: 's6', type: 'contact', title: 'تواصل معنا', content: 'نسعد بخدمتكم', enabled: true },
      { id: 's7', type: 'footer', title: '', content: 'جميع الحقوق محفوظة', enabled: true },
    ],
  },
  {
    id: 't2',
    name: 'E-Commerce Premium',
    nameAr: 'متجر إلكتروني فاخر',
    description: 'قالب متجر متكامل مع سلة مشتريات وإدارة منتجات',
    category: 'ecommerce',
    thumbnail: '🛒',
    primaryColor: '#7c3aed',
    secondaryColor: '#a78bfa',
    accentColor: '#f43f5e',
    layout: 'modern',
    previewImages: [],
    sections: [
      { id: 's1', type: 'hero', title: 'تسوق بأفضل الأسعار', content: 'اكتشف تشكيلة واسعة من المنتجات المميزة', enabled: true },
      { id: 's2', type: 'products', title: 'منتجاتنا المميزة', content: 'أحدث المنتجات بأفضل جودة', enabled: true },
      { id: 's3', type: 'features', title: 'لماذا تتسوق معنا', content: 'شحن سريع - ضمان الجودة - استرجاع سهل', enabled: true },
      { id: 's4', type: 'testimonials', title: 'آراء العملاء', content: 'تقييمات حقيقية من عملائنا', enabled: true },
      { id: 's5', type: 'contact', title: 'خدمة العملاء', content: 'نحن هنا لمساعدتك 24/7', enabled: true },
      { id: 's6', type: 'footer', title: '', content: 'جميع الحقوق محفوظة', enabled: true },
    ],
  },
  {
    id: 't3',
    name: 'Portfolio Minimal',
    nameAr: 'معرض أعمال بسيط',
    description: 'قالب أنيق ومينيمال لعرض الأعمال الإبداعية',
    category: 'portfolio',
    thumbnail: '🎨',
    primaryColor: '#0f172a',
    secondaryColor: '#334155',
    accentColor: '#06b6d4',
    layout: 'minimal',
    previewImages: [],
    sections: [
      { id: 's1', type: 'hero', title: 'مصمم | مطور | مبدع', content: 'أحول الأفكار إلى تجارب رقمية مذهلة', enabled: true },
      { id: 's2', type: 'gallery', title: 'أعمالي', content: 'مجموعة مختارة من مشاريعي', enabled: true },
      { id: 's3', type: 'about', title: 'عني', content: 'شغوف بالتصميم والتطوير', enabled: true },
      { id: 's4', type: 'services', title: 'خدماتي', content: 'ما يمكنني تقديمه لك', enabled: true },
      { id: 's5', type: 'contact', title: 'لنعمل معاً', content: 'أرسل لي رسالة', enabled: true },
      { id: 's6', type: 'footer', title: '', content: '', enabled: true },
    ],
  },
  {
    id: 't4',
    name: 'Blog Modern',
    nameAr: 'مدونة عصرية',
    description: 'قالب مدونة أنيق لمشاركة المحتوى والمقالات',
    category: 'blog',
    thumbnail: '📝',
    primaryColor: '#059669',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
    layout: 'classic',
    previewImages: [],
    sections: [
      { id: 's1', type: 'hero', title: 'مدونة التقنية والإبداع', content: 'أفكار ومقالات في عالم التقنية', enabled: true },
      { id: 's2', type: 'features', title: 'أحدث المقالات', content: 'تصفح آخر ما كتبت', enabled: true },
      { id: 's3', type: 'about', title: 'عن المدونة', content: 'مساحة لمشاركة الأفكار', enabled: true },
      { id: 's4', type: 'contact', title: 'اشترك في النشرة', content: 'ابق على اطلاع', enabled: true },
      { id: 's5', type: 'footer', title: '', content: '', enabled: true },
    ],
  },
  {
    id: 't5',
    name: 'Restaurant Deluxe',
    nameAr: 'مطعم فاخر',
    description: 'قالب فاخر للمطاعم والكافيهات مع قائمة طعام',
    category: 'restaurant',
    thumbnail: '🍽️',
    primaryColor: '#b91c1c',
    secondaryColor: '#dc2626',
    accentColor: '#fbbf24',
    layout: 'elegant',
    previewImages: [],
    sections: [
      { id: 's1', type: 'hero', title: 'تجربة طعام استثنائية', content: 'أشهى المأكولات في أجواء فاخرة', enabled: true },
      { id: 's2', type: 'products', title: 'قائمة الطعام', content: 'تشكيلة من ألذ الأطباق', enabled: true },
      { id: 's3', type: 'gallery', title: 'صور من مطعمنا', content: 'أجواء دافئة ومميزة', enabled: true },
      { id: 's4', type: 'about', title: 'قصتنا', content: 'رحلة شغف بدأت منذ 2010', enabled: true },
      { id: 's5', type: 'testimonials', title: 'ماذا يقول ضيوفنا', content: 'آراء زوارنا الكرام', enabled: true },
      { id: 's6', type: 'contact', title: 'احجز طاولتك', content: 'نسعد بضيافتكم', enabled: true },
      { id: 's7', type: 'footer', title: '', content: '', enabled: true },
    ],
  },
  {
    id: 't6',
    name: 'Landing Bold',
    nameAr: 'صفحة هبوط جريئة',
    description: 'قالب صفحة هبوط مع تصميم جريء لجذب العملاء',
    category: 'landing',
    thumbnail: '🚀',
    primaryColor: '#4f46e5',
    secondaryColor: '#818cf8',
    accentColor: '#f43f5e',
    layout: 'bold',
    previewImages: [],
    sections: [
      { id: 's1', type: 'hero', title: 'أطلق مشروعك للقمة', content: 'الحل الأمثل لتحقيق أهدافك', enabled: true },
      { id: 's2', type: 'features', title: 'المميزات', content: 'كل ما تحتاجه في مكان واحد', enabled: true },
      { id: 's3', type: 'stats', title: 'أرقامنا', content: 'نتائج تتحدث عن نفسها', enabled: true },
      { id: 's4', type: 'pricing', title: 'الباقات', content: 'اختر الباقة المناسبة لك', enabled: true },
      { id: 's5', type: 'faq', title: 'أسئلة شائعة', content: 'إجابات على استفساراتك', enabled: true },
      { id: 's6', type: 'contact', title: 'ابدأ الآن', content: 'سجل واحصل على تجربة مجانية', enabled: true },
      { id: 's7', type: 'footer', title: '', content: '', enabled: true },
    ],
  },
  {
    id: 't7',
    name: 'Services Pro',
    nameAr: 'خدمات احترافية',
    description: 'قالب لشركات الخدمات والاستشارات',
    category: 'service',
    thumbnail: '⚡',
    primaryColor: '#0891b2',
    secondaryColor: '#22d3ee',
    accentColor: '#f59e0b',
    layout: 'modern',
    previewImages: [],
    sections: [
      { id: 's1', type: 'hero', title: 'خدمات احترافية موثوقة', content: 'نقدم حلولاً مبتكرة لأعمالك', enabled: true },
      { id: 's2', type: 'services', title: 'خدماتنا', content: 'حلول متكاملة لجميع احتياجاتك', enabled: true },
      { id: 's3', type: 'team', title: 'فريقنا', content: 'خبراء متخصصون في مجالاتهم', enabled: true },
      { id: 's4', type: 'pricing', title: 'الأسعار', content: 'باقات تناسب جميع الميزانيات', enabled: true },
      { id: 's5', type: 'testimonials', title: 'شهادات العملاء', content: 'ثقة عملائنا شرف لنا', enabled: true },
      { id: 's6', type: 'contact', title: 'تواصل معنا', content: 'نحن هنا لخدمتك', enabled: true },
      { id: 's7', type: 'footer', title: '', content: '', enabled: true },
    ],
  },
  {
    id: 't8',
    name: 'Real Estate',
    nameAr: 'عقارات',
    description: 'قالب لشركات العقارات والتسويق العقاري',
    category: 'realestate',
    thumbnail: '🏠',
    primaryColor: '#1d4ed8',
    secondaryColor: '#60a5fa',
    accentColor: '#22c55e',
    layout: 'elegant',
    previewImages: [],
    sections: [
      { id: 's1', type: 'hero', title: 'اعثر على منزل أحلامك', content: 'أفضل العقارات في انتظارك', enabled: true },
      { id: 's2', type: 'products', title: 'عقاراتنا', content: 'تشكيلة متنوعة من العقارات', enabled: true },
      { id: 's3', type: 'features', title: 'لماذا نحن', content: 'خبرة وثقة في سوق العقارات', enabled: true },
      { id: 's4', type: 'about', title: 'من نحن', content: 'شركة عقارات رائدة', enabled: true },
      { id: 's5', type: 'contact', title: 'تواصل معنا', content: 'دعنا نساعدك', enabled: true },
      { id: 's6', type: 'footer', title: '', content: '', enabled: true },
    ],
  },
];



export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('naqra_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [sites, setSites] = useState<ClientSite[]>(() => {
    const saved = localStorage.getItem('naqra_sites');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingSite, setEditingSite] = useState<ClientSite | null>(null);
  const [viewingSiteSlug, setViewingSiteSlug] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // بث مباشر من Firebase + تحميل أولي
  useEffect(() => {
    setIsLoading(true);

    // تحميل المستخدمين (مرة واحدة)
    loadUsersFromFirebase().then(firebaseUsers => {
      if (firebaseUsers.length > 0) {
        setUsers(firebaseUsers);
        localStorage.setItem('naqra_users', JSON.stringify(firebaseUsers));
      }
    });

    // اشتراك مباشر للمواقع — يتلقى التحديثات فوراً من أي متصفح
    const unsubSites = subscribeToSites(
      (firebaseSites) => {
        if (firebaseSites.length > 0) {
          setSites(firebaseSites);
          localStorage.setItem('naqra_sites', JSON.stringify(firebaseSites));
        }
        setIsLoading(false);
      },
      (err) => {
        console.warn('فشل الاتصال بـ Firebase، استخدام localStorage:', err);
        setIsLoading(false);
      }
    );

    return () => {
      unsubSites();
    };
  }, []);

  // دالة لمزامنة المواقع مع Firebase بعد كل تغيير
  const syncSitesToFirebase = (updatedSites: ClientSite[]) => {
    updatedSites.forEach(site => saveSiteToFirebase(site));
  };

  // دالة لمزامنة المستخدمين مع Firebase
  const syncUsersToFirebase = (updatedUsers: User[]) => {
    updatedUsers.forEach(user => saveUserToFirebase(user));
  };

  // Check URL hash on load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#/site/')) {
      const slug = hash.replace('#/site/', '');
      setViewingSiteSlug(slug);
      setCurrentPage('view-site');
    }
  }, []);

  // Update URL hash when viewing site
  useEffect(() => {
    if (currentPage === 'view-site' && viewingSiteSlug) {
      window.location.hash = `/site/${viewingSiteSlug}`;
    } else if (currentPage !== 'view-site') {
      if (window.location.hash.startsWith('#/site/')) {
        window.location.hash = '';
      }
    }
  }, [currentPage, viewingSiteSlug]);

  useEffect(() => {
    localStorage.setItem('naqra_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('naqra_sites', JSON.stringify(sites));
  }, [sites]);

  const registerUser = (name: string, email: string, password: string): boolean => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = { id: uuidv4(), name, email, password, createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('dashboard');
    syncUsersToFirebase([...users, newUser]);
    return true;
  };

  const loginUser = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      setUsers(updatedUsers);
      setCurrentUser(updatedUser);
      setCurrentPage('dashboard');
      syncUsersToFirebase(updatedUsers);
      return true;
    }
    return false;
  };

  const loginAdmin = (password: string): boolean => {
    if (password === '01147497465') {
      setIsAdmin(true);
      setCurrentPage('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentPage('landing');
  };

  const syncSingleSite = (updatedSite: ClientSite) => {
    saveSiteToFirebase(updatedSite);
  };

  const createSite = (siteData: Omit<ClientSite, 'id' | 'createdAt' | 'updatedAt'>): ClientSite => {
    const newSite: ClientSite = { ...siteData, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setSites(prev => {
      const updated = [...prev, newSite];
      return updated;
    });
    saveSiteToFirebase(newSite);
    return newSite;
  };

  const updateSite = (updatedSite: ClientSite) => {
    const synced = { ...updatedSite, updatedAt: new Date().toISOString() };
    setSites(prev => prev.map(s => s.id === synced.id ? synced : s));
    saveSiteToFirebase(synced);
  };

  const deleteSite = (siteId: string) => {
    setSites(prev => prev.filter(s => s.id !== siteId));
    deleteSiteFromFirebase(siteId);
  };

  const getUserSites = (): ClientSite[] => {
    if (!currentUser) return [];
    return sites.filter(s => s.userId === currentUser.id);
  };

  const getSiteBySlug = (slug: string): ClientSite | undefined => {
    return sites.find(s => s.siteSlug === slug);
  };

  const recordVisit = (siteId: string, page: string) => {
    const visit: SiteVisit = {
      id: uuidv4(),
      siteId,
      timestamp: new Date().toISOString(),
      page,
      device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
    };
    setSites(prev => prev.map(s => s.id === siteId ? { ...s, visits: [...(s.visits || []), visit] } : s));
  };

  const getSiteAnalytics = (siteId: string): DailyAnalytics[] => {
    const site = sites.find(s => s.id === siteId);
    const data: DailyAnalytics[] = [];
    const visitsByDate: Record<string, SiteVisit[]> = {};
    
    if (site?.visits) {
      site.visits.forEach(visit => {
        const date = visit.timestamp.split('T')[0];
        if (!visitsByDate[date]) visitsByDate[date] = [];
        visitsByDate[date].push(visit);
      });
    }

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayVisits = visitsByDate[dateStr] || [];
      const devices = { desktop: 0, mobile: 0, tablet: 0 };
      dayVisits.forEach(v => devices[v.device]++);

      data.push({
        date: dateStr,
        visitors: dayVisits.length,
        pageViews: dayVisits.length,
        uniqueVisitors: dayVisits.length,
        avgSessionDuration: dayVisits.length > 0 ? Math.floor(Math.random() * 180) + 60 : 0,
        bounceRate: dayVisits.length > 0 ? Math.floor(Math.random() * 30) + 20 : 0,
        devices,
      });
    }
    return data;
  };

  const getAllAnalytics = (): DailyAnalytics[] => {
    const allVisits: SiteVisit[] = [];
    sites.forEach(site => { if (site.visits) allVisits.push(...site.visits); });
    
    const visitsByDate: Record<string, SiteVisit[]> = {};
    allVisits.forEach(visit => {
      const date = visit.timestamp.split('T')[0];
      if (!visitsByDate[date]) visitsByDate[date] = [];
      visitsByDate[date].push(visit);
    });

    const data: DailyAnalytics[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayVisits = visitsByDate[dateStr] || [];
      const devices = { desktop: 0, mobile: 0, tablet: 0 };
      dayVisits.forEach(v => devices[v.device]++);

      data.push({
        date: dateStr, visitors: dayVisits.length, pageViews: dayVisits.length,
        uniqueVisitors: dayVisits.length,
        avgSessionDuration: dayVisits.length > 0 ? Math.floor(Math.random() * 180) + 60 : 0,
        bounceRate: dayVisits.length > 0 ? Math.floor(Math.random() * 30) + 20 : 0,
        devices,
      });
    }
    return data;
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    const updatedSites = sites.filter(s => s.userId !== userId);
    setUsers(updatedUsers);
    setSites(updatedSites);
    updatedSites.forEach(site => deleteSiteFromFirebase(site.id));
    syncUsersToFirebase(updatedUsers);
  };

  const syncSiteById = (siteId: string, transformSite: (site: ClientSite) => ClientSite) => {
    const updatedSites = sites.map(s => s.id === siteId ? transformSite(s) : s);
    setSites(updatedSites);
    const modified = updatedSites.find(s => s.id === siteId);
    if (modified) saveSiteToFirebase(modified);
  };

  const addProduct = (siteId: string, product: Product) => {
    syncSiteById(siteId, site => ({ ...site, products: [...(site.products || []), product] }));
  };

  const updateProduct = (siteId: string, product: Product) => {
    syncSiteById(siteId, site => ({ ...site, products: site.products.map(p => p.id === product.id ? product : p) }));
  };

  const deleteProduct = (siteId: string, productId: string) => {
    syncSiteById(siteId, site => ({ ...site, products: site.products.filter(p => p.id !== productId) }));
  };

  const addDiscountCode = (siteId: string, code: DiscountCode) => {
    syncSiteById(siteId, site => ({ ...site, discountCodes: [...(site.discountCodes || []), code] }));
  };

  const deleteDiscountCode = (siteId: string, codeId: string) => {
    syncSiteById(siteId, site => ({ ...site, discountCodes: (site.discountCodes || []).filter(c => c.id !== codeId) }));
  };

  const validateDiscountCode = (siteId: string, code: string): DiscountCode | null => {
    const site = sites.find(s => s.id === siteId);
    if (!site) return null;
    const discount = (site.discountCodes || []).find(c => c.code.toLowerCase() === code.toLowerCase() && c.active);
    if (!discount) return null;
    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) return null;
    if (discount.maxUses && discount.usedCount >= discount.maxUses) return null;
    return discount;
  };

  const createOrder = (siteId: string, orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const order: Order = { ...orderData, id: uuidv4(), createdAt: new Date().toISOString() };
    syncSiteById(siteId, site => ({ ...site, orders: [...(site.orders || []), order] }));
    return order;
  };

  const updateOrderStatus = (siteId: string, orderId: string, status: Order['status']) => {
    syncSiteById(siteId, site => ({ ...site, orders: (site.orders || []).map(o => o.id === orderId ? { ...o, status } : o) }));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      currentUser, setCurrentUser,
      isAdmin, setIsAdmin,
      isLoading,
      users, sites,
      templates: defaultTemplates,
      editingSite, setEditingSite,
      viewingSiteSlug, setViewingSiteSlug,
      cart, setCart,
      registerUser, loginUser, loginAdmin, logout,
      createSite, updateSite, deleteSite,
      getUserSites, getSiteAnalytics, getAllAnalytics,
      recordVisit, deleteUser, getSiteBySlug,
      addProduct, updateProduct, deleteProduct,
      addDiscountCode, deleteDiscountCode, validateDiscountCode,
      createOrder, updateOrderStatus,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
    }}>
      {children}
    </AppContext.Provider>
  );
};

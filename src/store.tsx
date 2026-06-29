import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, ClientSite, SiteTemplate, DailyAnalytics, Page, SiteVisit, Product, DiscountCode, Order, CartItem, ContactMessage, Plan, PLAN_LIMITS, Transaction } from './types';
import { v4 as uuidv4 } from 'uuid';
import { fbSave, fbDelete, fbListen, fbTest } from './firebase';

interface AppState {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  users: User[];
  sites: ClientSite[];
  templates: SiteTemplate[];
  editingSite: ClientSite | null;
  setEditingSite: (s: ClientSite | null) => void;
  viewingSiteSlug: string | null;
  setViewingSiteSlug: (s: string | null) => void;
  cart: CartItem[];
  firebaseReady: boolean;
  registerUser: (n: string, e: string, p: string) => boolean;
  loginUser: (e: string, p: string) => boolean;
  loginAdmin: (p: string) => boolean;
  logout: () => void;
  updateUserProfile: (name: string, email: string) => boolean;
  updateUserPassword: (currentPassword: string, newPassword: string) => boolean;
  createSite: (s: Omit<ClientSite, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
  updateSite: (s: ClientSite) => void;
  deleteSite: (id: string) => void;
  duplicateSite: (id: string) => ClientSite | null;
  getUserSites: () => ClientSite[];
  getSiteAnalytics: (id: string) => DailyAnalytics[];
  getAllAnalytics: () => DailyAnalytics[];
  recordVisit: (siteId: string, page: string) => void;
  deleteUser: (id: string) => void;
  canCreateMoreSites: () => boolean;
  updateUserWallet: (userId: string, amount: number) => void;
  setUserPlan: (userId: string, plan: Plan) => void;
  addTransaction: (userId: string, type: 'deposit' | 'subscription' | 'withdrawal', amount: number, note: string) => void;
  getTransactions: (userId: string) => Transaction[];
  getAllTransactions: () => Transaction[];
  confirmTransaction: (txId: string) => void;
  deleteTransaction: (txId: string) => void;
  addProduct: (siteId: string, p: Product) => void;
  updateProduct: (siteId: string, p: Product) => void;
  deleteProduct: (siteId: string, pid: string) => void;
  addDiscountCode: (siteId: string, c: DiscountCode) => void;
  deleteDiscountCode: (siteId: string, cid: string) => void;
  validateDiscountCode: (siteId: string, code: string) => DiscountCode | null;
  createOrder: (siteId: string, o: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrderStatus: (siteId: string, oid: string, s: Order['status']) => void;
  submitContactMessage: (siteId: string, name: string, email: string, message: string) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (pid: string) => void;
  updateCartQuantity: (pid: string, q: number) => void;
  clearCart: () => void;
  getSiteUrl: (slug: string) => string;
}

const Ctx = createContext<AppState | null>(null);
export const useApp = () => { const c = useContext(Ctx); if (!c) throw new Error('No ctx'); return c; };

// Templates
const T: SiteTemplate[] = [
  {id:'t1',name:'Business',nameAr:'شركات احترافي',description:'قالب للشركات',category:'business',thumbnail:'🏢',primaryColor:'#1e40af',secondaryColor:'#3b82f6',accentColor:'#f59e0b',layout:'modern',previewImages:[],sections:[{id:'s1',type:'hero',title:'نحن نبني المستقبل',content:'شركة رائدة في تقديم الحلول',enabled:true},{id:'s2',type:'services',title:'خدماتنا',content:'مجموعة شاملة',enabled:true},{id:'s3',type:'about',title:'من نحن',content:'خبرة 10+ سنوات',enabled:true},{id:'s4',type:'testimonials',title:'عملاؤنا',content:'آراء شركائنا',enabled:true},{id:'s5',type:'contact',title:'تواصل معنا',content:'نسعد بخدمتكم',enabled:true},{id:'s6',type:'footer',title:'',content:'جميع الحقوق محفوظة',enabled:true}]},
  {id:'t2',name:'E-Commerce',nameAr:'متجر إلكتروني',description:'قالب متجر',category:'ecommerce',thumbnail:'🛒',primaryColor:'#7c3aed',secondaryColor:'#a78bfa',accentColor:'#f43f5e',layout:'modern',previewImages:[],sections:[{id:'s1',type:'hero',title:'تسوق بأفضل الأسعار',content:'تشكيلة واسعة',enabled:true},{id:'s2',type:'products',title:'منتجاتنا',content:'أحدث المنتجات',enabled:true},{id:'s3',type:'features',title:'لماذا نحن',content:'شحن سريع - ضمان',enabled:true},{id:'s4',type:'testimonials',title:'آراء العملاء',content:'تقييمات حقيقية',enabled:true},{id:'s5',type:'contact',title:'خدمة العملاء',content:'نحن هنا لمساعدتك',enabled:true},{id:'s6',type:'footer',title:'',content:'',enabled:true}]},
  {id:'t3',name:'Portfolio',nameAr:'معرض أعمال',description:'لعرض الأعمال',category:'portfolio',thumbnail:'🎨',primaryColor:'#0f172a',secondaryColor:'#334155',accentColor:'#06b6d4',layout:'minimal',previewImages:[],sections:[{id:'s1',type:'hero',title:'مصمم | مطور | مبدع',content:'تجارب رقمية',enabled:true},{id:'s2',type:'gallery',title:'أعمالي',content:'مشاريعي',enabled:true},{id:'s3',type:'about',title:'عني',content:'شغوف بالتصميم',enabled:true},{id:'s4',type:'contact',title:'لنعمل معاً',content:'أرسل رسالة',enabled:true},{id:'s5',type:'footer',title:'',content:'',enabled:true}]},
  {id:'t4',name:'Blog',nameAr:'مدونة',description:'قالب مدونة',category:'blog',thumbnail:'📝',primaryColor:'#059669',secondaryColor:'#10b981',accentColor:'#f59e0b',layout:'classic',previewImages:[],sections:[{id:'s1',type:'hero',title:'مدونة التقنية',content:'أفكار ومقالات',enabled:true},{id:'s2',type:'features',title:'المقالات',content:'آخر ما كتبت',enabled:true},{id:'s3',type:'about',title:'عن المدونة',content:'مشاركة الأفكار',enabled:true},{id:'s4',type:'contact',title:'تواصل',content:'ابق على اطلاع',enabled:true},{id:'s5',type:'footer',title:'',content:'',enabled:true}]},
  {id:'t5',name:'Restaurant',nameAr:'مطعم فاخر',description:'للمطاعم',category:'restaurant',thumbnail:'🍽️',primaryColor:'#b91c1c',secondaryColor:'#dc2626',accentColor:'#fbbf24',layout:'elegant',previewImages:[],sections:[{id:'s1',type:'hero',title:'تجربة طعام استثنائية',content:'أشهى المأكولات',enabled:true},{id:'s2',type:'products',title:'قائمة الطعام',content:'أطباق مميزة',enabled:true},{id:'s3',type:'gallery',title:'صور المطعم',content:'أجواء دافئة',enabled:true},{id:'s4',type:'about',title:'قصتنا',content:'رحلة شغف',enabled:true},{id:'s5',type:'contact',title:'احجز طاولتك',content:'نسعد بضيافتكم',enabled:true},{id:'s6',type:'footer',title:'',content:'',enabled:true}]},
  {id:'t6',name:'Landing',nameAr:'صفحة هبوط',description:'صفحة تسويقية',category:'landing',thumbnail:'🚀',primaryColor:'#4f46e5',secondaryColor:'#818cf8',accentColor:'#f43f5e',layout:'bold',previewImages:[],sections:[{id:'s1',type:'hero',title:'أطلق مشروعك',content:'الحل الأمثل',enabled:true},{id:'s2',type:'features',title:'المميزات',content:'كل ما تحتاجه',enabled:true},{id:'s3',type:'pricing',title:'الباقات',content:'اختر المناسب',enabled:true},{id:'s4',type:'testimonials',title:'شهادات',content:'ثقة عملائنا',enabled:true},{id:'s5',type:'contact',title:'ابدأ الآن',content:'تجربة مجانية',enabled:true},{id:'s6',type:'footer',title:'',content:'',enabled:true}]},
  {id:'t7',name:'Services',nameAr:'خدمات',description:'للخدمات',category:'service',thumbnail:'⚡',primaryColor:'#0891b2',secondaryColor:'#22d3ee',accentColor:'#f59e0b',layout:'modern',previewImages:[],sections:[{id:'s1',type:'hero',title:'خدمات موثوقة',content:'حلول مبتكرة',enabled:true},{id:'s2',type:'services',title:'خدماتنا',content:'حلول متكاملة',enabled:true},{id:'s3',type:'pricing',title:'الأسعار',content:'باقات للجميع',enabled:true},{id:'s4',type:'testimonials',title:'العملاء',content:'ثقة عملائنا',enabled:true},{id:'s5',type:'contact',title:'تواصل',content:'لخدمتك',enabled:true},{id:'s6',type:'footer',title:'',content:'',enabled:true}]},
  {id:'t8',name:'RealEstate',nameAr:'عقارات',description:'للعقارات',category:'realestate',thumbnail:'🏠',primaryColor:'#1d4ed8',secondaryColor:'#60a5fa',accentColor:'#22c55e',layout:'elegant',previewImages:[],sections:[{id:'s1',type:'hero',title:'منزل أحلامك',content:'أفضل العقارات',enabled:true},{id:'s2',type:'products',title:'عقاراتنا',content:'تشكيلة متنوعة',enabled:true},{id:'s3',type:'features',title:'لماذا نحن',content:'خبرة وثقة',enabled:true},{id:'s4',type:'about',title:'من نحن',content:'شركة رائدة',enabled:true},{id:'s5',type:'contact',title:'تواصل',content:'دعنا نساعدك',enabled:true},{id:'s6',type:'footer',title:'',content:'',enabled:true}]},
];

// ===== DETECT SITE SLUG FROM URL =====
// Works with: ?site=slug, #/site/slug, hash, and parent window
function detectSlug(): string | null {
  try {
    // Method 1: Query parameter ?site=slug (MOST RELIABLE - works in iframes)
    const params = new URLSearchParams(window.location.search);
    const qSite = params.get('site');
    if (qSite) return qSite;

    // Method 2: Hash #/site/slug
    const hash = window.location.hash;
    if (hash.startsWith('#/site/')) {
      const s = hash.replace('#/site/', '');
      if (s) return s;
    }

    // Method 3: Try parent window URL (iframe case)
    try {
      if (window.parent !== window) {
        const parentHash = window.parent.location.hash;
        if (parentHash.startsWith('#/site/')) {
          const s = parentHash.replace('#/site/', '');
          if (s) return s;
        }
        const parentParams = new URLSearchParams(window.parent.location.search);
        const pSite = parentParams.get('site');
        if (pSite) return pSite;
      }
    } catch (e) {
      // Cross-origin iframe - can't access parent
    }

    // Method 4: Check if slug is stored in sessionStorage (for iframe navigation)
    const stored = sessionStorage.getItem('naqra_viewing_site');
    if (stored) return stored;

  } catch (e) {}
  return null;
}

const INITIAL_SLUG = detectSlug();
console.log('🔍 Detected slug:', INITIAL_SLUG, 'hash:', window.location.hash, 'search:', window.location.search, 'href:', window.location.href);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>(INITIAL_SLUG ? 'view-site' : 'landing');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('naqra_current_user');
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        if (!parsed.plan) parsed.plan = 'free';
        if (typeof parsed.wallet !== 'number') parsed.wallet = 0;
        return parsed;
      }
    } catch {}
    return null;
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('naqra_users') || '[]');
      return raw.map((u: any) => ({ ...u, plan: u.plan || 'free', wallet: typeof u.wallet === 'number' ? u.wallet : 0 }));
    } catch { return []; }
  });
  const [sites, setSites] = useState<ClientSite[]>(() => { try { return JSON.parse(localStorage.getItem('naqra_sites') || '[]'); } catch { return []; } });
  const [transactions, setTransactions] = useState<Transaction[]>(() => { try { return JSON.parse(localStorage.getItem('naqra_transactions') || '[]'); } catch { return []; } });
  const [editingSite, setEditingSiteRaw] = useState<ClientSite | null>(null);
  const [viewingSiteSlug, setViewingSiteSlug] = useState<string | null>(INITIAL_SLUG);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [firebaseReady, setFirebaseReady] = useState(false);

  const setEditingSite = useCallback((s: ClientSite | null) => setEditingSiteRaw(s), []);
  useEffect(() => { if (editingSite) { const f = sites.find(s => s.id === editingSite.id); if (f && JSON.stringify(f) !== JSON.stringify(editingSite)) setEditingSiteRaw(f); } }, [sites]);

  // Sync currentUser with latest users data (wallet, plan updates from admin)
  const syncCurrentUser = useCallback(() => {
    if (!currentUser) return;
    const updated = users.find(u => u.id === currentUser.id);
    if (!updated) return;
    const needsSync = updated.wallet !== currentUser.wallet || updated.plan !== currentUser.plan || updated.name !== currentUser.name || updated.email !== currentUser.email;
    if (needsSync) setCurrentUser(updated);
  }, [currentUser, users]);

  // Sync on users array changes (from Firebase or localStorage)
  useEffect(() => { syncCurrentUser(); }, [users]); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll every 3 seconds for wallet/plan changes (cross-tab / Firebase fallback)
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(syncCurrentUser, 3000);
    return () => clearInterval(interval);
  }, [currentUser, syncCurrentUser]);

  // Save slug to sessionStorage so iframe can find it
  useEffect(() => {
    if (viewingSiteSlug) sessionStorage.setItem('naqra_viewing_site', viewingSiteSlug);
    else sessionStorage.removeItem('naqra_viewing_site');
  }, [viewingSiteSlug]);

  // localStorage
  useEffect(() => { localStorage.setItem('naqra_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('naqra_sites', JSON.stringify(sites)); }, [sites]);
  useEffect(() => { localStorage.setItem('naqra_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { if (currentUser) localStorage.setItem('naqra_current_user', JSON.stringify(currentUser)); else localStorage.removeItem('naqra_current_user'); }, [currentUser]);

  // Firebase
  useEffect(() => {
    let alive = true;
    const init = async () => {
      const ok = await fbTest();
      if (!ok || !alive) { setFirebaseReady(true); return; }
      const lu: User[] = JSON.parse(localStorage.getItem('naqra_users') || '[]');
      const ls: ClientSite[] = JSON.parse(localStorage.getItem('naqra_sites') || '[]');
      fbListen('users', (d) => { if (!alive) return; if (d.length > 0) setUsers(d as User[]); else if (lu.length > 0) lu.forEach(u => fbSave('users', u.id, u)); setFirebaseReady(true); }, () => setFirebaseReady(true));
      fbListen('sites', (d) => { if (!alive) return; if (d.length > 0) setSites(d as ClientSite[]); else if (ls.length > 0) ls.forEach(s => fbSave('sites', s.id, s)); setFirebaseReady(true); }, () => setFirebaseReady(true));
    };
    init();
    const t = setTimeout(() => { if (alive) setFirebaseReady(true); }, 8000);
    return () => { alive = false; clearTimeout(t); };
  }, []);

  // Hash/URL change listener
  useEffect(() => {
    const handle = () => {
      const slug = detectSlug();
      if (slug) { setViewingSiteSlug(slug); setCurrentPage('view-site'); }
    };
    window.addEventListener('hashchange', handle);
    window.addEventListener('popstate', handle);
    return () => { window.removeEventListener('hashchange', handle); window.removeEventListener('popstate', handle); };
  }, []);

  // Generate site URL - uses ?site= which works in iframes
  const getSiteUrl = (slug: string): string => {
    const base = window.location.origin + window.location.pathname;
    return `${base}?site=${slug}`;
  };

  // Auth
  const registerUser = (name: string, email: string, password: string) => {
    if (users.find(u => u.email === email)) return false;
    const u: User = { id: uuidv4(), name, email, password, createdAt: new Date().toISOString(), plan: 'free', wallet: 0 };
    setUsers(p => [...p, u]); fbSave('users', u.id, u);
    setCurrentUser(u); setCurrentPage('dashboard'); return true;
  };
  const loginUser = (email: string, password: string) => {
    const u = users.find(x => x.email === email && x.password === password);
    if (u) { setCurrentUser({ ...u, plan: u.plan || 'free', wallet: typeof u.wallet === 'number' ? u.wallet : 0 }); setCurrentPage('dashboard'); return true; }
    return false;
  };
  const loginAdmin = (pw: string) => { if (pw === '01147497465') { setIsAdmin(true); setCurrentPage('admin'); return true; } return false; };
  const logout = () => { setCurrentUser(null); setIsAdmin(false); setCurrentPage('landing'); };

  const updateUserProfile = (name: string, email: string) => {
    if (!currentUser) return false;
    if (email !== currentUser.email && users.find(u => u.email === email && u.id !== currentUser.id)) return false;
    const updated = { ...currentUser, name, email };
    setCurrentUser(updated);
    setUsers(p => p.map(u => u.id === updated.id ? updated : u));
    fbSave('users', updated.id, updated);
    return true;
  };

  const updateUserPassword = (currentPassword: string, newPassword: string) => {
    if (!currentUser || currentUser.password !== currentPassword) return false;
    const updated = { ...currentUser, password: newPassword };
    setCurrentUser(updated);
    setUsers(p => p.map(u => u.id === updated.id ? updated : u));
    fbSave('users', updated.id, updated);
    return true;
  };

  // Site CRUD
  const modSite = (siteId: string, fn: (s: ClientSite) => ClientSite) => {
    setSites(prev => { const next = prev.map(s => s.id === siteId ? fn({ ...s, updatedAt: new Date().toISOString() }) : s); const c = next.find(s => s.id === siteId); if (c) fbSave('sites', c.id, c); return next; });
  };
  const canCreateMoreSites = () => {
    if (!currentUser) return false;
    const userSitesCount = sites.filter(s => s.userId === currentUser.id).length;
    const limit = PLAN_LIMITS[currentUser.plan].maxSites;
    return userSitesCount < limit;
  };

  const createSite = (d: Omit<ClientSite, 'id' | 'createdAt' | 'updatedAt'>): boolean => {
    if (!currentUser || !canCreateMoreSites()) return false;
    const s: ClientSite = { ...d, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setSites(p => [...p, s]); fbSave('sites', s.id, s); return true;
  };
  const updateSite = (s: ClientSite) => { const u = { ...s, updatedAt: new Date().toISOString() }; setSites(p => p.map(x => x.id === u.id ? u : x)); fbSave('sites', u.id, u); };
  const deleteSite = (id: string) => { setSites(p => p.filter(s => s.id !== id)); fbDelete('sites', id); };
  const duplicateSite = (id: string): ClientSite | null => {
    const original = sites.find(s => s.id === id);
    if (!original) return null;
    const copy: ClientSite = {
      ...JSON.parse(JSON.stringify(original)),
      id: uuidv4(),
      siteName: original.siteName + ' (نسخة)',
      siteSlug: original.siteSlug + '-copy-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visits: [],
      orders: [],
      contactMessages: [],
    };
    setSites(p => [...p, copy]); fbSave('sites', copy.id, copy); return copy;
  };
  const getUserSites = () => currentUser ? sites.filter(s => s.userId === currentUser.id) : [];
  const recordVisit = (siteId: string, page: string) => { const v: SiteVisit = { id: uuidv4(), siteId, timestamp: new Date().toISOString(), page, device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop' }; modSite(siteId, s => ({ ...s, visits: [...(s.visits || []), v] })); };

  // Analytics
  const buildA = (visits: SiteVisit[]): DailyAnalytics[] => { const byD: Record<string, SiteVisit[]> = {}; visits.forEach(v => { const d = v.timestamp.split('T')[0]; if (!byD[d]) byD[d] = []; byD[d].push(v); }); return Array.from({ length: 30 }).map((_, i) => { const dt = new Date(); dt.setDate(dt.getDate() - (29 - i)); const ds = dt.toISOString().split('T')[0]; const dv = byD[ds] || []; const dev = { desktop: 0, mobile: 0, tablet: 0 }; dv.forEach(v => dev[v.device]++); return { date: ds, visitors: dv.length, pageViews: dv.length, uniqueVisitors: dv.length, avgSessionDuration: dv.length ? 120 : 0, bounceRate: dv.length ? 30 : 0, devices: dev }; }); };
  const getSiteAnalytics = (id: string) => buildA(sites.find(s => s.id === id)?.visits || []);
  const getAllAnalytics = () => { const a: SiteVisit[] = []; sites.forEach(s => { if (s.visits) a.push(...s.visits); }); return buildA(a); };
  const deleteUser = (id: string) => { const sids = sites.filter(s => s.userId === id).map(s => s.id); setUsers(p => p.filter(u => u.id !== id)); fbDelete('users', id); sids.forEach(sid => { setSites(p => p.filter(s => s.id !== sid)); fbDelete('sites', sid); }); };

  // Wallet / Plans
  const updateUserWallet = (userId: string, amount: number) => {
    setUsers(p => p.map(u => u.id === userId ? { ...u, wallet: Math.max(0, (u.wallet || 0) + amount) } : u));
    if (currentUser?.id === userId) setCurrentUser(prev => prev ? { ...prev, wallet: Math.max(0, (prev.wallet || 0) + amount) } : null);
  };
  const setUserPlan = (userId: string, plan: Plan) => {
    setUsers(p => p.map(u => u.id === userId ? { ...u, plan } : u));
    if (currentUser?.id === userId) setCurrentUser(prev => prev ? { ...prev, plan } : null);
  };
  // Normalize users after Firebase sync or any external update
  useEffect(() => {
    setUsers(prev => prev.map(u => ({ ...u, plan: u.plan || 'free', wallet: typeof u.wallet === 'number' ? u.wallet : 0 })));
  }, []);
  const addTransaction = (userId: string, type: 'deposit' | 'subscription' | 'withdrawal', amount: number, note: string) => {
    const t: Transaction = { id: uuidv4(), userId, type, amount, note, createdAt: new Date().toISOString(), confirmed: false };
    setTransactions(p => [...p, t]);
  };
  const getTransactions = (userId: string) => transactions.filter(t => t.userId === userId);
  const getAllTransactions = () => transactions;
  const confirmTransaction = (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.confirmed) return;
    if (tx.type === 'deposit' && tx.amount > 0) {
      updateUserWallet(tx.userId, tx.amount);
    }
    setTransactions(p => p.map(t => t.id === txId ? { ...t, confirmed: true } : t));
  };
  const deleteTransaction = (txId: string) => {
    setTransactions(p => p.filter(t => t.id !== txId));
  };

  // Products / Discounts / Orders
  const addProduct = (sid: string, p: Product) => modSite(sid, s => ({ ...s, products: [...(s.products || []), p] }));
  const updateProduct = (sid: string, p: Product) => modSite(sid, s => ({ ...s, products: (s.products || []).map(x => x.id === p.id ? p : x) }));
  const deleteProduct = (sid: string, pid: string) => modSite(sid, s => ({ ...s, products: (s.products || []).filter(x => x.id !== pid) }));
  const addDiscountCode = (sid: string, c: DiscountCode) => modSite(sid, s => ({ ...s, discountCodes: [...(s.discountCodes || []), c] }));
  const deleteDiscountCode = (sid: string, cid: string) => modSite(sid, s => ({ ...s, discountCodes: (s.discountCodes || []).filter(x => x.id !== cid) }));
  const validateDiscountCode = (sid: string, code: string): DiscountCode | null => { const s = sites.find(x => x.id === sid); if (!s) return null; const d = (s.discountCodes || []).find(c => c.code.toLowerCase() === code.toLowerCase() && c.active); if (!d) return null; if (d.expiresAt && new Date(d.expiresAt) < new Date()) return null; if (d.maxUses && d.usedCount >= d.maxUses) return null; return d; };
  const createOrder = (sid: string, od: Omit<Order, 'id' | 'createdAt'>): Order => { const o: Order = { ...od, id: uuidv4(), createdAt: new Date().toISOString() }; modSite(sid, s => ({ ...s, orders: [...(s.orders || []), o] })); return o; };
  const updateOrderStatus = (sid: string, oid: string, st: Order['status']) => modSite(sid, s => ({ ...s, orders: (s.orders || []).map(o => o.id === oid ? { ...o, status: st } : o) }));

  // Contact Form
  const submitContactMessage = (siteId: string, name: string, email: string, message: string) => {
    const msg: ContactMessage = { id: uuidv4(), name, email, message, createdAt: new Date().toISOString(), read: false };
    modSite(siteId, s => ({ ...s, contactMessages: [...(s.contactMessages || []), msg] }));
  };

  // Cart
  const addToCart = (p: Product) => setCart(prev => { const e = prev.find(i => i.product.id === p.id); if (e) return prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i); return [...prev, { product: p, quantity: 1 }]; });
  const removeFromCart = (pid: string) => setCart(p => p.filter(i => i.product.id !== pid));
  const updateCartQuantity = (pid: string, q: number) => { if (q <= 0) { removeFromCart(pid); return; } setCart(p => p.map(i => i.product.id === pid ? { ...i, quantity: q } : i)); };
  const clearCart = () => setCart([]);

  return (
    <Ctx.Provider value={{
      currentPage, setCurrentPage, currentUser, setCurrentUser, isAdmin,
      users, sites, templates: T, editingSite, setEditingSite,
      viewingSiteSlug, setViewingSiteSlug, cart, firebaseReady,
      registerUser, loginUser, loginAdmin, logout, updateUserProfile, updateUserPassword,
      createSite, updateSite, deleteSite, duplicateSite, getUserSites,
      getSiteAnalytics, getAllAnalytics, recordVisit, deleteUser,
      canCreateMoreSites, updateUserWallet, setUserPlan, addTransaction, getTransactions, getAllTransactions, confirmTransaction, deleteTransaction,
      addProduct, updateProduct, deleteProduct,
      addDiscountCode, deleteDiscountCode, validateDiscountCode,
      createOrder, updateOrderStatus, submitContactMessage,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      getSiteUrl,
    }}>
      {children}
    </Ctx.Provider>
  );
};

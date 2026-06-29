import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Product, ContactMessage } from '../types';
import { ArrowRight, Mail, Phone, MapPin, Star, ShoppingCart, Send, Menu, X, Plus, Minus, Trash2, Tag, Check, MessageCircle } from 'lucide-react';

const SiteViewer: React.FC = () => {
  const { viewingSiteSlug, sites, setCurrentPage, setViewingSiteSlug, recordVisit, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, validateDiscountCode, createOrder, submitContactMessage, currentUser } = useApp();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const site = sites.find(s => s.siteSlug === viewingSiteSlug);
  
  // Check if current user is the owner of this site
  const isOwner = currentUser && site ? site.userId === currentUser.id : false;

  // Record visit only once per session
  const [visitRecorded, setVisitRecorded] = useState(false);
  useEffect(() => {
    if (site && !visitRecorded) {
      recordVisit(site.id, 'home');
      setVisitRecorded(true);
    }
  }, [site?.id, visitRecorded]);

  // Show loading while we wait for data (max 8 seconds then show not found)
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (!site) {
      const t = setTimeout(() => setTimedOut(true), 8000);
      return () => clearTimeout(t);
    }
  }, [site]);

  if (!site) {
    if (!timedOut) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-gray-500 text-lg">جاري تحميل الموقع...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md">
          <div className="text-7xl mb-6">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">الموقع غير موجود</h2>
          <p className="text-gray-500 mb-4">تأكد من صحة الرابط</p>
        </div>
      </div>
    );
  }

  if (!site.isPublished && !isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-6">
        <div className="text-center animate-fade bg-white p-12 rounded-3xl shadow-xl max-w-md">
          <div className="text-7xl mb-6">🚧</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">الموقع قيد الإنشاء</h2>
          <p className="text-gray-500 mb-8">هذا الموقع لم يُنشر بعد</p>
        </div>
      </div>
    );
  }

  const isDark = site.settings?.enableDarkMode;
  const bg = isDark ? '#0f172a' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#64748b';
  const surfaceBg = isDark ? '#1e293b' : '#f8fafc';
  const cardBg = isDark ? '#334155' : '#ffffff';
  const borderColor = isDark ? '#475569' : '#e2e8f0';
  const currency = site.settings?.currency || 'ر.س';

  const enabledSections = site.sections.filter(s => s.enabled);
  const products = site.products || [];
  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'all' ? products : products.filter(p => p.category === selectedCategory);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const finalTotal = cartTotal - (appliedDiscount?.amount || 0);

  const handleApplyDiscount = () => {
    const discount = validateDiscountCode(site.id, discountCode);
    if (discount) {
      const amount = discount.type === 'percentage' ? (cartTotal * discount.value / 100) : discount.value;
      setAppliedDiscount({ code: discount.code, amount: Math.min(amount, cartTotal) });
    } else {
      alert('كود الخصم غير صالح');
    }
  };

  const handleCheckout = () => {
    if (!checkoutForm.name || !checkoutForm.phone) {
      alert('يرجى ملء الاسم ورقم الهاتف');
      return;
    }

    createOrder(site.id, {
      siteId: site.id,
      items: cart,
      customerName: checkoutForm.name,
      customerEmail: checkoutForm.email,
      customerPhone: checkoutForm.phone,
      customerAddress: checkoutForm.address,
      subtotal: cartTotal,
      discount: appliedDiscount?.amount || 0,
      discountCode: appliedDiscount?.code,
      total: finalTotal,
      status: 'pending',
    });

    clearCart();
    setAppliedDiscount(null);
    setShowCheckout(false);
    setShowCart(false);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return;
    addToCart(product);
    showToast('✓ تمت الإضافة للسلة');
  };

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.message) { showToast('يرجى ملء الاسم والرسالة'); return; }
    submitContactMessage(site.id, contactForm.name, contactForm.email, contactForm.message);
    setContactSent(true);
    setContactForm({ name: '', email: '', message: '' });
    showToast('✓ تم إرسال رسالتك بنجاح');
  };

  return (
    <div style={{ background: bg, color: textColor, fontFamily: site.fontFamily + ', sans-serif', minHeight: '100vh' }}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-[999] animate-fade">
          {toast}
        </div>
      )}

      {/* Floating WhatsApp Button */}
      {site.settings?.socialLinks?.whatsapp && (
        <a
          href={`https://wa.me/${site.settings.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          style={{ background: '#25D366' }}
          title="تواصل عبر واتساب"
        >
          <MessageCircle size={28} color="white" />
        </a>
      )}

      {/* Back Button - only for the site owner */}
      {isOwner && (
        <button onClick={() => { setViewingSiteSlug(null); setCurrentPage('dashboard'); window.location.hash = ''; }} className="back-btn">
          <ArrowRight size={14} /> لوحة التحكم
        </button>
      )}

      {/* Success Message */}
      {orderSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-fade flex items-center gap-3">
          <Check size={24} />
          <span className="font-semibold">تم إرسال طلبك بنجاح! سنتواصل معك قريباً</span>
        </div>
      )}

      {/* Header */}
      {site.settings?.showHeader !== false && (
        <header style={{ background: site.primaryColor, position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>{site.siteName}</h1>
            
            <nav className="hidden md:flex items-center gap-8">
              {enabledSections.filter(s => s.type !== 'footer').map(s => (
                <a key={s.id} href={`#${s.type}`} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.target as HTMLElement).style.opacity = '1'}
                  onMouseLeave={e => (e.target as HTMLElement).style.opacity = '0.9'}>
                  {s.title}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {site.settings?.enableCart && (
                <button onClick={() => setShowCart(true)} className="relative" style={{ color: 'white' }}>
                  <ShoppingCart size={24} />
                  {cart.length > 0 && (
                    <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: site.accentColor, color: 'white', fontSize: '12px', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>
              )}
              <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
                {mobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {mobileMenu && (
            <div className="md:hidden px-6 py-4 border-t border-white/20">
              {enabledSections.filter(s => s.type !== 'footer').map(s => (
                <a key={s.id} href={`#${s.type}`} onClick={() => setMobileMenu(false)} style={{ display: 'block', color: 'white', padding: '12px 0', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{s.title}</a>
              ))}
            </div>
          )}
        </header>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide overflow-y-auto" style={{ direction: 'rtl' }}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">سلة المشتريات ({cart.length})</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            {cart.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingCart size={64} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">السلة فارغة</p>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                        {(item.product.image?.startsWith('http') || item.product.image?.startsWith('data:'))
                          ? <img src={item.product.image} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).outerHTML = '<span style="font-size:28px">📦</span>'; }} />
                          : <span>{item.product.image || '📦'}</span>}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.product.name}</h4>
                        <p className="text-indigo-600 font-bold">{item.product.price} {currency}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"><Minus size={14} /></button>
                          <span className="font-semibold text-gray-800 w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"><Plus size={14} /></button>
                          <button onClick={() => removeFromCart(item.product.id)} className="mr-auto text-red-500 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="كود الخصم" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm" dir="ltr" />
                    <button onClick={handleApplyDiscount} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">تطبيق</button>
                  </div>
                  {appliedDiscount && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                      <Tag size={14} />
                      <span>تم تطبيق خصم {appliedDiscount.amount} {currency}</span>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="px-6 py-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>المجموع</span>
                    <span>{cartTotal} {currency}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم</span>
                      <span>-{appliedDiscount.amount} {currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-100">
                    <span>الإجمالي</span>
                    <span>{finalTotal} {currency}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="p-6">
                  <button onClick={() => setShowCheckout(true)} style={{ background: site.primaryColor }} className="w-full py-4 rounded-xl text-white font-bold text-lg hover:opacity-90 transition-opacity">
                    إتمام الطلب
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCheckout(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fade" style={{ direction: 'rtl' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">بيانات الطلب</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">الاسم *</label>
                <input type="text" value={checkoutForm.name} onChange={(e) => setCheckoutForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="الاسم الكامل" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">رقم الهاتف *</label>
                <input type="tel" value={checkoutForm.phone} onChange={(e) => setCheckoutForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl" dir="ltr" placeholder="05XXXXXXXX" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">البريد الإلكتروني</label>
                <input type="email" value={checkoutForm.email} onChange={(e) => setCheckoutForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl" dir="ltr" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">العنوان</label>
                <textarea value={checkoutForm.address} onChange={(e) => setCheckoutForm(f => ({ ...f, address: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none" rows={3} placeholder="المدينة - الحي - الشارع" />
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>الإجمالي</span>
                <span>{finalTotal} {currency}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowCheckout(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">إلغاء</button>
              <button onClick={handleCheckout} style={{ background: site.primaryColor }} className="flex-1 py-3 rounded-xl text-white font-bold hover:opacity-90">تأكيد الطلب</button>
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      {enabledSections.map(section => {
        switch (section.type) {
          case 'hero':
            return (
              <section key={section.id} id="hero" style={{ padding: '100px 24px 80px', background: `linear-gradient(135deg, ${site.primaryColor}08, ${site.secondaryColor}08)`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '600px', height: '600px', borderRadius: '50%', background: `${site.primaryColor}10` }} />
                <div style={{ position: 'absolute', bottom: '-30%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: `${site.secondaryColor}10` }} />
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                  <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2, background: `linear-gradient(135deg, ${site.primaryColor}, ${site.secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{section.title}</h1>
                  <p style={{ fontSize: '20px', color: textMuted, marginBottom: '40px', lineHeight: 1.8 }}>{section.content}</p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="#products" style={{ padding: '16px 40px', background: site.primaryColor, color: 'white', borderRadius: '50px', fontWeight: 600, textDecoration: 'none', boxShadow: `0 10px 30px ${site.primaryColor}40` }}>
                      تسوق الآن
                    </a>
                    <a href="#contact" style={{ padding: '16px 40px', background: 'white', color: site.primaryColor, borderRadius: '50px', fontWeight: 600, textDecoration: 'none', border: `2px solid ${site.primaryColor}` }}>
                      تواصل معنا
                    </a>
                  </div>
                </div>
              </section>
            );

          case 'products':
            return (
              <section key={section.id} id="products" style={{ padding: '80px 24px', background: surfaceBg }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>{section.title}</h2>
                  <p style={{ textAlign: 'center', color: textMuted, marginBottom: '40px', fontSize: '18px' }}>{section.content}</p>
                  
                  {/* Categories */}
                  {categories.length > 2 && (
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
                      {categories.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '10px 24px', borderRadius: '50px', fontWeight: 500, border: 'none', cursor: 'pointer', background: selectedCategory === cat ? site.primaryColor : cardBg, color: selectedCategory === cat ? 'white' : textColor, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                          {cat === 'all' ? 'الكل' : cat}
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredProducts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                      {filteredProducts.map((product) => (
                        <div key={product.id} style={{ background: cardBg, borderRadius: '24px', overflow: 'hidden', border: `1px solid ${borderColor}`, transition: 'transform 0.3s, box-shadow 0.3s' }} className="hover:shadow-xl hover:-translate-y-1">
                          <div style={{ height: '200px', background: `linear-gradient(135deg, ${site.primaryColor}10, ${site.secondaryColor}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {(product.image?.startsWith('http') || product.image?.startsWith('data:')) ? (
                              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<span style="font-size:72px">📦</span>'; }} />
                            ) : (
                              <span style={{ fontSize: '72px' }}>{product.image || '📦'}</span>
                            )}
                            {product.discount && product.discount > 0 && (
                              <span style={{ position: 'absolute', top: '12px', left: '12px', background: site.accentColor, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                                -{product.discount}%
                              </span>
                            )}
                            {product.featured && (
                              <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#f59e0b', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                                ⭐ مميز
                              </span>
                            )}
                          </div>
                          <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                              <h3 style={{ fontWeight: 600, fontSize: '18px', color: textColor }}>{product.name}</h3>
                              <span style={{ fontSize: '12px', padding: '4px 10px', background: `${site.primaryColor}15`, color: site.primaryColor, borderRadius: '20px' }}>{product.category}</span>
                            </div>
                            <p style={{ fontSize: '14px', color: textMuted, marginBottom: '16px', lineHeight: 1.6 }}>{product.description}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                              <span style={{ fontSize: '24px', fontWeight: 700, color: site.primaryColor }}>{product.price} {currency}</span>
                              {product.originalPrice && (
                                <span style={{ fontSize: '16px', color: textMuted, textDecoration: 'line-through' }}>{product.originalPrice}</span>
                              )}
                            </div>
                            <button onClick={() => handleAddToCart(product)} disabled={!product.inStock} style={{ width: '100%', padding: '14px', background: product.inStock ? site.primaryColor : '#e5e7eb', color: product.inStock ? 'white' : '#9ca3af', borderRadius: '12px', border: 'none', fontWeight: 600, cursor: product.inStock ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s' }}>
                              <ShoppingCart size={18} />
                              {product.inStock ? 'أضف للسلة' : 'نفد المخزون'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
                      <p style={{ color: textMuted }}>لا توجد منتجات في هذا التصنيف</p>
                    </div>
                  )}
                </div>
              </section>
            );

          case 'features':
          case 'services':
            return (
              <section key={section.id} id={section.type} style={{ padding: '80px 24px', background: section.type === 'services' ? surfaceBg : bg }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>{section.title}</h2>
                  <p style={{ textAlign: 'center', color: textMuted, marginBottom: '48px', fontSize: '18px' }}>{section.content}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {['⚡ سرعة فائقة', '🛡️ أمان متقدم', '🎨 تصميم احترافي', '📱 متجاوب', '🔧 سهل الاستخدام', '📊 تحليلات'].slice(0, 6).map((f, i) => (
                      <div key={i} style={{ background: cardBg, padding: '32px', borderRadius: '24px', textAlign: 'center', border: `1px solid ${borderColor}` }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>{f.split(' ')[0]}</div>
                        <h3 style={{ fontWeight: 600, marginBottom: '12px', fontSize: '18px' }}>{f.split(' ').slice(1).join(' ')}</h3>
                        <p style={{ fontSize: '14px', color: textMuted, lineHeight: 1.7 }}>تجربة استثنائية ومميزة تلبي جميع احتياجاتك</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'about':
            return (
              <section key={section.id} id="about" style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '24px' }}>{section.title}</h2>
                    <p style={{ color: textMuted, lineHeight: 2, fontSize: '17px' }}>{section.content}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '32px' }}>
                      {[{ n: '+1000', l: 'عميل سعيد' }, { n: '+50', l: 'مشروع ناجح' }, { n: '5⭐', l: 'تقييم' }, { n: '24/7', l: 'دعم فني' }].map((s, i) => (
                        <div key={i} style={{ textAlign: 'center', padding: '20px', background: surfaceBg, borderRadius: '16px' }}>
                          <div style={{ fontSize: '28px', fontWeight: 700, color: site.primaryColor }}>{s.n}</div>
                          <div style={{ fontSize: '14px', color: textMuted }}>{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: '350px', background: `linear-gradient(135deg, ${site.primaryColor}20, ${site.secondaryColor}20)`, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '100px' }}>🏆</span>
                  </div>
                </div>
              </section>
            );

          case 'testimonials':
            return (
              <section key={section.id} id="testimonials" style={{ padding: '80px 24px', background: surfaceBg }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>{section.title}</h2>
                  <p style={{ textAlign: 'center', color: textMuted, marginBottom: '48px', fontSize: '18px' }}>{section.content}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {[{ name: 'أحمد محمد', role: 'رائد أعمال', text: 'تجربة رائعة! المنتجات ممتازة والخدمة سريعة.' }, { name: 'سارة علي', role: 'مصممة', text: 'أفضل متجر تعاملت معه. الجودة عالية جداً.' }, { name: 'خالد عمر', role: 'مدير تقني', text: 'أنصح الجميع بالشراء من هنا. خدمة عملاء ممتازة!' }].map((t, i) => (
                      <div key={i} style={{ background: cardBg, padding: '32px', borderRadius: '24px', border: `1px solid ${borderColor}` }}>
                        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                          {[1, 2, 3, 4, 5].map(j => <Star key={j} size={18} style={{ color: '#fbbf24', fill: '#fbbf24' }} />)}
                        </div>
                        <p style={{ color: textMuted, marginBottom: '24px', lineHeight: 1.8, fontSize: '16px' }}>"{t.text}"</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg, ${site.primaryColor}, ${site.secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '18px' }}>{t.name[0]}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '16px' }}>{t.name}</div>
                            <div style={{ fontSize: '14px', color: textMuted }}>{t.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'contact':
            return (
              <section key={section.id} id="contact" style={{ padding: '80px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                  <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', marginBottom: '16px' }}>{section.title}</h2>
                  <p style={{ textAlign: 'center', color: textMuted, marginBottom: '48px', fontSize: '18px' }}>{section.content}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {site.settings?.contactEmail && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${site.primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Mail size={24} style={{ color: site.primaryColor }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', color: textMuted, marginBottom: '4px' }}>البريد الإلكتروني</div>
                            <div style={{ fontWeight: 600, fontSize: '16px' }} dir="ltr">{site.settings.contactEmail}</div>
                          </div>
                        </div>
                      )}
                      {site.settings?.contactPhone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${site.primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Phone size={24} style={{ color: site.primaryColor }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', color: textMuted, marginBottom: '4px' }}>الهاتف</div>
                            <div style={{ fontWeight: 600, fontSize: '16px' }} dir="ltr">{site.settings.contactPhone}</div>
                          </div>
                        </div>
                      )}
                      {site.settings?.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${site.primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin size={24} style={{ color: site.primaryColor }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', color: textMuted, marginBottom: '4px' }}>العنوان</div>
                            <div style={{ fontWeight: 600, fontSize: '16px' }}>{site.settings.address}</div>
                          </div>
                        </div>
                      )}
                      {/* Social Links */}
                      {Object.entries(site.settings?.socialLinks || {}).some(([_, v]) => v) && (
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                          {site.settings?.socialLinks?.whatsapp && (
                            <a href={`https://wa.me/${site.settings.socialLinks.whatsapp}`} target="_blank" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>💬</a>
                          )}
                          {site.settings?.socialLinks?.instagram && (
                            <a href={site.settings.socialLinks.instagram} target="_blank" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>📸</a>
                          )}
                          {site.settings?.socialLinks?.twitter && (
                            <a href={site.settings.socialLinks.twitter} target="_blank" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#1DA1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}>🐦</a>
                          )}
                        </div>
                      )}
                    </div>
                    {site.settings?.showContactForm !== false && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {contactSent ? (
                          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                            <h3 style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>تم إرسال رسالتك!</h3>
                            <p style={{ color: textMuted, fontSize: '14px' }}>سنتواصل معك في أقرب وقت</p>
                          </div>
                        ) : (
                          <>
                            <input type="text" placeholder="الاسم" value={contactForm.name} onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '16px 20px', border: `2px solid ${borderColor}`, borderRadius: '14px', background: cardBg, color: textColor, fontSize: '16px', outline: 'none' }} />
                            <input type="email" placeholder="البريد الإلكتروني (اختياري)" dir="ltr" value={contactForm.email} onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))} style={{ padding: '16px 20px', border: `2px solid ${borderColor}`, borderRadius: '14px', background: cardBg, color: textColor, fontSize: '16px', outline: 'none' }} />
                            <textarea placeholder="رسالتك" rows={4} value={contactForm.message} onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))} style={{ padding: '16px 20px', border: `2px solid ${borderColor}`, borderRadius: '14px', background: cardBg, color: textColor, fontSize: '16px', resize: 'none', outline: 'none' }} />
                            <button onClick={handleContactSubmit} style={{ padding: '16px', background: site.primaryColor, color: 'white', borderRadius: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px' }}>
                              <Send size={18} /> إرسال الرسالة
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );

          case 'footer':
            if (site.settings?.showFooter === false) return null;
            return (
              <footer key={section.id} style={{ background: '#1e293b', color: 'white', padding: '60px 24px 30px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '22px' }}>{site.siteName}</h3>
                      <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.8 }}>{site.description}</p>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, marginBottom: '20px', fontSize: '16px' }}>روابط سريعة</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {enabledSections.filter(s => s.type !== 'footer').slice(0, 5).map(s => (
                          <a key={s.id} href={`#${s.type}`} style={{ color: '#94a3b8', fontSize: '15px', textDecoration: 'none' }}>{s.title}</a>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 600, marginBottom: '20px', fontSize: '16px' }}>تواصل معنا</h4>
                      <div style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 2 }}>
                        {site.settings?.contactEmail && <div dir="ltr">📧 {site.settings.contactEmail}</div>}
                        {site.settings?.contactPhone && <div dir="ltr">📱 {site.settings.contactPhone}</div>}
                        {site.settings?.address && <div>📍 {site.settings.address}</div>}
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #334155', paddingTop: '24px', textAlign: 'center' }}>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>
                      © {new Date().getFullYear()} {site.siteName}. جميع الحقوق محفوظة
                      <span style={{ margin: '0 8px' }}>•</span>
                      صُنع بـ <span className="logo" dir="ltr" style={{ fontSize: '14px', color: '#94a3b8' }}>Naqra</span>
                    </p>
                  </div>
                </div>
              </footer>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default SiteViewer;

import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { SiteSettings as SiteSettingsType, DiscountCode, Product } from '../types';
import { ArrowRight, Save, Check, Plus, Trash2, Tag, Package, Percent } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const SiteSettings: React.FC = () => {
  const { editingSite, updateSite, setCurrentPage, addProduct, updateProduct, deleteProduct, addDiscountCode, deleteDiscountCode, sites, updateOrderStatus } = useApp();
  
  // Always use the freshest site data from the store
  const liveSite = editingSite ? sites.find(s => s.id === editingSite.id) || editingSite : null;
  const [activeTab, setActiveTab] = useState<'general' | 'products' | 'discounts' | 'orders' | 'messages'>('general');
  const [settings, setSettings] = useState<SiteSettingsType>({
    showHeader: true, showFooter: true, showContactForm: true, enableDarkMode: false,
    enableCart: true, enableOrders: true, currency: 'ر.س',
    seoTitle: '', seoDescription: '',
    socialLinks: { facebook: '', twitter: '', instagram: '', whatsapp: '', tiktok: '', youtube: '' },
    contactEmail: '', contactPhone: '', address: '',
  });
  const [saved, setSaved] = useState(false);
  
  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  
  // Discount form
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountForm, setDiscountForm] = useState<Partial<DiscountCode>>({
    type: 'percentage', value: 10, active: true, usedCount: 0
  });

  useEffect(() => {
    if (editingSite?.settings) setSettings(editingSite.settings);
  }, [editingSite]);

  // Use liveSite for reading (always fresh), editingSite for writing
  const activeSite = liveSite || editingSite;
  if (!activeSite) return null;

  const handleSave = () => {
    updateSite({ ...activeSite, settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price) return;
    const product: Product = {
      id: editingProduct?.id || uuidv4(),
      name: productForm.name || '',
      price: productForm.price || 0,
      originalPrice: productForm.originalPrice,
      discount: productForm.originalPrice ? Math.round(((productForm.originalPrice - (productForm.price || 0)) / productForm.originalPrice) * 100) : 0,
      description: productForm.description || '',
      image: productForm.image || '📦',
      category: productForm.category || 'عام',
      inStock: productForm.inStock ?? true,
      featured: productForm.featured ?? false,
    };
    
    if (editingProduct) {
      updateProduct(activeSite.id, product);
    } else {
      addProduct(activeSite.id, product);
    }
    
    setProductForm({});
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setShowProductForm(true);
  };

  const handleAddDiscount = () => {
    if (!discountForm.code || !discountForm.value) return;
    const discount: DiscountCode = {
      id: uuidv4(),
      code: discountForm.code.toUpperCase(),
      type: discountForm.type || 'percentage',
      value: discountForm.value,
      minPurchase: discountForm.minPurchase,
      maxUses: discountForm.maxUses,
      usedCount: 0,
      expiresAt: discountForm.expiresAt,
      active: true,
    };
    addDiscountCode(activeSite.id, discount);
    setDiscountForm({ type: 'percentage', value: 10, active: true, usedCount: 0 });
    setShowDiscountForm(false);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div className={`toggle ${value ? 'active' : ''}`} onClick={() => onChange(!value)} />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav">
        <div className="nav-inner">
          <div className="flex items-center gap-6">
            <span className="logo" dir="ltr">Naqra</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">إعدادات: {activeSite.siteName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className={`btn btn-sm ${saved ? 'bg-green-500 text-white' : 'btn-primary'}`}>
              {saved ? <><Check size={14} /> تم الحفظ</> : <><Save size={14} /> حفظ</>}
            </button>
            <button onClick={() => setCurrentPage('dashboard')} className="btn btn-ghost btn-sm"><ArrowRight size={16} /></button>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Tabs */}
        <div className="tabs mb-8">
          {[
            { id: 'general' as const, label: 'عام', icon: '⚙️' },
            { id: 'products' as const, label: `المنتجات (${activeSite.products?.length || 0})`, icon: '📦' },
            { id: 'discounts' as const, label: `أكواد الخصم (${activeSite.discountCodes?.length || 0})`, icon: '🏷️' },
            { id: 'orders' as const, label: `الطلبات (${activeSite.orders?.length || 0})`, icon: '📋' },
            { id: 'messages' as const, label: `الرسائل (${(activeSite.contactMessages || []).filter(m => !m.read).length || 0})`, icon: '✉️' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab ${activeTab === tab.id ? 'active' : ''}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="max-w-3xl animate-fade">
            <div className="card p-8 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">إعدادات العرض</h3>
              <div className="space-y-4">
                {[
                  { key: 'showHeader', label: 'إظهار الهيدر', desc: 'شريط التنقل العلوي' },
                  { key: 'showFooter', label: 'إظهار التذييل', desc: 'قسم أسفل الصفحة' },
                  { key: 'showContactForm', label: 'نموذج التواصل', desc: 'عرض نموذج الاتصال' },
                  { key: 'enableDarkMode', label: 'الوضع الداكن', desc: 'تفعيل المظهر الليلي' },
                  { key: 'enableCart', label: 'سلة المشتريات', desc: 'تفعيل سلة التسوق' },
                  { key: 'enableOrders', label: 'الطلبات', desc: 'السماح بإتمام الطلبات' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-800">{item.label}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <Toggle value={(settings as any)[item.key]} onChange={(v) => setSettings(prev => ({ ...prev, [item.key]: v }))} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">إعدادات المتجر</h3>
              <div className="form-group">
                <label className="form-label">العملة</label>
                <select value={settings.currency} onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))} className="input">
                  <option value="ر.س">ريال سعودي (ر.س)</option>
                  <option value="د.إ">درهم إماراتي (د.إ)</option>
                  <option value="د.ك">دينار كويتي (د.ك)</option>
                  <option value="ج.م">جنيه مصري (ج.م)</option>
                  <option value="$">دولار ($)</option>
                </select>
              </div>
            </div>

            <div className="card p-8 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">معلومات التواصل</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">البريد الإلكتروني</label>
                  <input type="email" value={settings.contactEmail} onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))} className="input" dir="ltr" />
                </div>
                <div className="form-group">
                  <label className="form-label">الهاتف</label>
                  <input type="tel" value={settings.contactPhone} onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))} className="input" dir="ltr" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">العنوان</label>
                <input type="text" value={settings.address} onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))} className="input" />
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">وسائل التواصل الاجتماعي</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'whatsapp' as const, label: 'واتساب' },
                  { key: 'instagram' as const, label: 'إنستغرام' },
                  { key: 'facebook' as const, label: 'فيسبوك' },
                  { key: 'twitter' as const, label: 'تويتر' },
                  { key: 'tiktok' as const, label: 'تيك توك' },
                  { key: 'youtube' as const, label: 'يوتيوب' },
                ].map((social) => (
                  <div key={social.key} className="form-group">
                    <label className="form-label">{social.label}</label>
                    <input
                      type="text"
                      value={settings.socialLinks[social.key]}
                      onChange={(e) => setSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [social.key]: e.target.value } }))}
                      className="input"
                      dir="ltr"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div className="animate-fade">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">المنتجات ({activeSite.products?.length || 0})</h2>
              <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({}); }} className="btn btn-primary">
                <Plus size={16} /> إضافة منتج
              </button>
            </div>
            {/* Search */}
            <input
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="input mb-6"
              placeholder="🔍 بحث في المنتجات..."
              dir="rtl"
            />

            {showProductForm && (
              <div className="card p-6 mb-6 border-2 border-indigo-200">
                <h3 className="font-semibold text-gray-800 mb-4">{editingProduct ? 'تعديل منتج' : 'منتج جديد'}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">اسم المنتج *</label>
                    <input type="text" value={productForm.name || ''} onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))} className="input" placeholder="اسم المنتج" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">التصنيف</label>
                    <input type="text" value={productForm.category || ''} onChange={(e) => setProductForm(p => ({ ...p, category: e.target.value }))} className="input" placeholder="مثال: ملابس" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">السعر *</label>
                    <input type="number" value={productForm.price || ''} onChange={(e) => setProductForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className="input" dir="ltr" placeholder="99" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">السعر قبل الخصم (اختياري)</label>
                    <input type="number" value={productForm.originalPrice || ''} onChange={(e) => setProductForm(p => ({ ...p, originalPrice: parseFloat(e.target.value) || undefined }))} className="input" dir="ltr" placeholder="149" />
                  </div>
                  <div className="form-group col-span-2">
                    <label className="form-label">الوصف</label>
                    <textarea value={productForm.description || ''} onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))} className="input" style={{ minHeight: '80px', resize: 'none' }} placeholder="وصف المنتج..." />
                  </div>
                  <div className="form-group col-span-2">
                    <label className="form-label">صورة المنتج</label>
                    {/* Image preview */}
                    {productForm.image && (
                      <div className="mb-3 relative inline-block">
                        {productForm.image.startsWith('data:') || productForm.image.startsWith('http') ? (
                          <img src={productForm.image} alt="معاينة" className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-4xl border-2 border-gray-200">{productForm.image}</div>
                        )}
                        <button type="button" onClick={() => setProductForm(p => ({ ...p, image: '' }))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {/* Upload from device */}
                      <label className="btn btn-secondary btn-sm cursor-pointer flex-1 text-center">
                        📁 رفع من الجهاز
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 500000) {
                              // Compress large images
                              const canvas = document.createElement('canvas');
                              const ctx = canvas.getContext('2d');
                              const img = new Image();
                              img.onload = () => {
                                const maxW = 400;
                                const scale = Math.min(1, maxW / img.width);
                                canvas.width = img.width * scale;
                                canvas.height = img.height * scale;
                                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                                const compressed = canvas.toDataURL('image/jpeg', 0.7);
                                setProductForm(p => ({ ...p, image: compressed }));
                              };
                              img.src = URL.createObjectURL(file);
                            } else {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setProductForm(p => ({ ...p, image: ev.target?.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {/* Or enter URL/emoji */}
                      <input
                        type="text"
                        value={productForm.image?.startsWith('data:') ? '' : (productForm.image || '')}
                        onChange={(e) => setProductForm(p => ({ ...p, image: e.target.value }))}
                        className="input flex-1"
                        placeholder="أو رابط URL أو إيموجي 📦"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">ارفع صورة من جهازك أو أدخل رابط أو إيموجي</p>
                  </div>
                  <div className="form-group flex items-end gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={productForm.inStock ?? true} onChange={(e) => setProductForm(p => ({ ...p, inStock: e.target.checked }))} className="w-5 h-5" />
                      <span>متوفر</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={productForm.featured ?? false} onChange={(e) => setProductForm(p => ({ ...p, featured: e.target.checked }))} className="w-5 h-5" />
                      <span>مميز</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }} className="btn btn-ghost">إلغاء</button>
                  <button onClick={handleAddProduct} className="btn btn-primary">{editingProduct ? 'تحديث' : 'إضافة'}</button>
                </div>
              </div>
            )}

            {(() => {
              const filtered = productSearch
                ? (activeSite.products || []).filter(p =>
                    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.category?.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.description?.toLowerCase().includes(productSearch.toLowerCase())
                  )
                : (activeSite.products || []);
              return filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(product => (
                  <div key={product.id} className="card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                          {(product.image?.startsWith('http') || product.image?.startsWith('data:'))
                            ? <img src={product.image} alt="" className="w-full h-full object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).outerHTML = '<span style="font-size:24px">📦</span>'; }} />
                            : <span>{product.image || '📦'}</span>}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      {product.featured && <span className="badge badge-warning text-xs">مميز</span>}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-lg text-indigo-600">{product.price} {settings.currency}</span>
                      {product.originalPrice && (
                        <>
                          <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                          <span className="badge badge-success text-xs">-{product.discount}%</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`badge ${product.inStock ? 'badge-success' : 'badge-warning'}`}>
                        {product.inStock ? 'متوفر' : 'نفد'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditProduct(product)} className="btn btn-ghost btn-sm">تعديل</button>
                        <button onClick={() => deleteProduct(activeSite.id, product.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
              <div className="empty-state card">
                <Package size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="title">{productSearch ? 'لا توجد نتائج للبحث' : 'لا توجد منتجات'}</h3>
                <p className="desc">{productSearch ? 'حاول بكلمات بحث مختلفة' : 'أضف منتجات لعرضها في متجرك'}</p>
              </div>
            )})()}
          </div>
        )}

        {/* Discounts */}
        {activeTab === 'discounts' && (
          <div className="animate-fade max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">أكواد الخصم</h2>
              <button onClick={() => setShowDiscountForm(true)} className="btn btn-primary">
                <Plus size={16} /> إنشاء كود
              </button>
            </div>

            {showDiscountForm && (
              <div className="card p-6 mb-6 border-2 border-indigo-200">
                <h3 className="font-semibold text-gray-800 mb-4">كود خصم جديد</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">الكود *</label>
                    <input type="text" value={discountForm.code || ''} onChange={(e) => setDiscountForm(d => ({ ...d, code: e.target.value.toUpperCase() }))} className="input" dir="ltr" placeholder="SAVE20" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">نوع الخصم</label>
                    <select value={discountForm.type} onChange={(e) => setDiscountForm(d => ({ ...d, type: e.target.value as any }))} className="input">
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">القيمة *</label>
                    <input type="number" value={discountForm.value || ''} onChange={(e) => setDiscountForm(d => ({ ...d, value: parseFloat(e.target.value) || 0 }))} className="input" dir="ltr" placeholder={discountForm.type === 'percentage' ? '20' : '50'} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">الحد الأدنى للشراء</label>
                    <input type="number" value={discountForm.minPurchase || ''} onChange={(e) => setDiscountForm(d => ({ ...d, minPurchase: parseFloat(e.target.value) || undefined }))} className="input" dir="ltr" placeholder="100" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">الحد الأقصى للاستخدام</label>
                    <input type="number" value={discountForm.maxUses || ''} onChange={(e) => setDiscountForm(d => ({ ...d, maxUses: parseInt(e.target.value) || undefined }))} className="input" dir="ltr" placeholder="100" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">تاريخ الانتهاء</label>
                    <input type="date" value={discountForm.expiresAt?.split('T')[0] || ''} onChange={(e) => setDiscountForm(d => ({ ...d, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined }))} className="input" dir="ltr" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setShowDiscountForm(false)} className="btn btn-ghost">إلغاء</button>
                  <button onClick={handleAddDiscount} className="btn btn-primary">إنشاء الكود</button>
                </div>
              </div>
            )}

            {activeSite.discountCodes?.length > 0 ? (
              <div className="space-y-3">
                {activeSite.discountCodes.map(code => (
                  <div key={code.id} className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Tag size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 font-mono">{code.code}</span>
                          <span className={`badge ${code.active ? 'badge-success' : 'badge-warning'}`}>
                            {code.active ? 'فعال' : 'معطل'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          خصم {code.value}{code.type === 'percentage' ? '%' : ` ${settings.currency}`}
                          {code.minPurchase && ` • حد أدنى ${code.minPurchase} ${settings.currency}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-800">{code.usedCount}</div>
                        <div className="text-xs text-gray-400">استخدام</div>
                      </div>
                      <button onClick={() => deleteDiscountCode(activeSite.id, code.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <Percent size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="title">لا توجد أكواد خصم</h3>
                <p className="desc">أنشئ أكواد خصم لعملائك</p>
              </div>
            )}
          </div>
        )}

        {/* Orders - Amazon-like System */}
        {activeTab === 'orders' && (
          <div className="animate-fade">
            {/* Order Stats */}
            {activeSite.orders?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                {[
                  { label: 'الكل', count: activeSite.orders.length, color: 'bg-gray-100 text-gray-700', filter: 'all' },
                  { label: 'قيد الانتظار', count: activeSite.orders.filter(o => o.status === 'pending').length, color: 'bg-amber-50 text-amber-700', filter: 'pending' },
                  { label: 'تم التأكيد', count: activeSite.orders.filter(o => o.status === 'confirmed').length, color: 'bg-blue-50 text-blue-700', filter: 'confirmed' },
                  { label: 'تم الشحن', count: activeSite.orders.filter(o => o.status === 'shipped').length, color: 'bg-purple-50 text-purple-700', filter: 'shipped' },
                  { label: 'تم التوصيل', count: activeSite.orders.filter(o => o.status === 'delivered').length, color: 'bg-green-50 text-green-700', filter: 'delivered' },
                ].map((s, i) => (
                  <div key={i} className={`${s.color} rounded-xl p-4 text-center cursor-pointer hover:opacity-80 transition-opacity`}>
                    <div className="text-2xl font-bold">{s.count}</div>
                    <div className="text-xs font-medium mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Revenue Summary */}
            {activeSite.orders?.length > 0 && (
              <div className="card p-5 mb-6" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: 'none' }}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-700">
                      {activeSite.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)} {settings.currency}
                    </div>
                    <div className="text-xs text-indigo-500 mt-1">إجمالي المبيعات</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">
                      {activeSite.orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0)} {settings.currency}
                    </div>
                    <div className="text-xs text-green-600 mt-1">تم التوصيل</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-700">
                      {activeSite.orders.filter(o => o.status === 'pending').length}
                    </div>
                    <div className="text-xs text-amber-600 mt-1">بانتظار الإجراء</div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar + Export */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(f => (
                  <button key={f} onClick={() => setOrderFilter(f)}
                    className={`btn btn-sm ${orderFilter === f ? 'btn-primary' : 'btn-ghost'}`}>
                    {f === 'all' ? 'الكل' :
                     f === 'pending' ? '⏳ قيد الانتظار' :
                     f === 'confirmed' ? '✅ مؤكد' :
                     f === 'shipped' ? '🚚 شحن' :
                     f === 'delivered' ? '📦 تم' : '❌ ملغي'}
                  </button>
                ))}
              </div>
              <button onClick={() => {
                const orders = activeSite.orders || [];
                const csv = [
                  ['رقم الطلب', 'العميل', 'الهاتف', 'البريد', 'العنوان', 'المجموع', 'الخصم', 'الإجمالي', 'الحالة', 'التاريخ'],
                  ...orders.map(o => [
                    o.id.slice(0,8).toUpperCase(),
                    o.customerName,
                    o.customerPhone,
                    o.customerEmail,
                    o.customerAddress,
                    o.subtotal,
                    o.discount,
                    o.total,
                    o.status,
                    new Date(o.createdAt).toLocaleDateString('ar-EG'),
                  ])
                ].map(r => r.join(',')).join('\n');
                const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `orders_${activeSite.siteSlug}.csv`;
                a.click(); URL.revokeObjectURL(url);
              }} className="btn btn-secondary btn-sm" title="تصدير CSV">
                📥 تصدير CSV
              </button>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">إدارة الطلبات</h2>
            {(() => {
              const filtered = orderFilter === 'all'
                ? (activeSite.orders || [])
                : (activeSite.orders || []).filter(o => o.status === orderFilter);
              return filtered.length > 0 ? (
              <div className="space-y-4">
                {[...filtered].reverse().map(order => {
                  const statusSteps = [
                    { key: 'pending', label: 'قيد الانتظار', icon: '⏳', color: '#f59e0b' },
                    { key: 'confirmed', label: 'تم التأكيد', icon: '✅', color: '#3b82f6' },
                    { key: 'shipped', label: 'تم الشحن', icon: '🚚', color: '#8b5cf6' },
                    { key: 'delivered', label: 'تم التوصيل', icon: '📦', color: '#10b981' },
                  ];
                  const currentIdx = statusSteps.findIndex(s => s.key === order.status);
                  const isCancelled = order.status === 'cancelled';

                  return (
                    <div key={order.id} className={`card overflow-hidden ${isCancelled ? 'opacity-60' : ''}`}>
                      {/* Order Header */}
                      <div className="p-5 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-800 text-lg">طلب #{order.id.slice(0, 8).toUpperCase()}</span>
                            {isCancelled && <span className="badge" style={{ background: '#fef2f2', color: '#dc2626' }}>ملغي</span>}
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-indigo-600">{order.total} {settings.currency}</div>
                          {order.discount > 0 && <div className="text-sm text-green-600">خصم: -{order.discount} {settings.currency}</div>}
                          {order.discountCode && <div className="text-xs text-gray-400 font-mono">كود: {order.discountCode}</div>}
                        </div>
                      </div>

                      {/* Progress Tracker - Amazon Style */}
                      {!isCancelled && (
                        <div className="px-5 pb-4">
                          <div className="flex items-center justify-between relative">
                            {/* Progress Line */}
                            <div className="absolute top-5 right-5 left-5 h-1 bg-gray-200 rounded-full" style={{ zIndex: 0 }}>
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(currentIdx / (statusSteps.length - 1)) * 100}%`, background: statusSteps[currentIdx]?.color || '#e5e7eb' }} />
                            </div>
                            {statusSteps.map((step, i) => (
                              <div key={step.key} className="flex flex-col items-center relative" style={{ zIndex: 1 }}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                                  i <= currentIdx
                                    ? 'border-transparent text-white'
                                    : 'border-gray-200 bg-white text-gray-400'
                                }`} style={i <= currentIdx ? { background: step.color } : {}}>
                                  {i < currentIdx ? '✓' : step.icon}
                                </div>
                                <span className={`text-xs mt-2 font-medium ${i <= currentIdx ? 'text-gray-800' : 'text-gray-400'}`}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Customer Info */}
                      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400 block text-xs mb-1">👤 العميل</span>
                            <span className="text-gray-800 font-medium">{order.customerName}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-xs mb-1">📱 الهاتف</span>
                            <span className="text-gray-800 font-medium" dir="ltr">{order.customerPhone}</span>
                          </div>
                          {order.customerEmail && (
                            <div>
                              <span className="text-gray-400 block text-xs mb-1">📧 البريد</span>
                              <span className="text-gray-800 font-medium text-xs" dir="ltr">{order.customerEmail}</span>
                            </div>
                          )}
                          {order.customerAddress && (
                            <div>
                              <span className="text-gray-400 block text-xs mb-1">📍 العنوان</span>
                              <span className="text-gray-800 font-medium text-xs">{order.customerAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Products List */}
                      <div className="px-5 py-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400 mb-2 block">المنتجات ({order.items.length})</span>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-lg overflow-hidden">
                                  {(item.product.image?.startsWith('http') || item.product.image?.startsWith('data:'))
                                    ? <img src={item.product.image} className="w-full h-full object-cover" />
                                    : <span>{item.product.image || '📦'}</span>}
                                </div>
                                <div>
                                  <span className="text-gray-800 font-medium text-sm">{item.product.name}</span>
                                  <span className="text-gray-400 text-xs mr-2">× {item.quantity}</span>
                                </div>
                              </div>
                              <span className="text-gray-800 font-semibold text-sm">{item.product.price * item.quantity} {settings.currency}</span>
                            </div>
                          ))}
                        </div>
                        {/* Order Total Breakdown */}
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>المجموع الفرعي</span>
                            <span>{order.subtotal} {settings.currency}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>الخصم</span>
                              <span>-{order.discount} {settings.currency}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-base font-bold text-gray-800 pt-1">
                            <span>الإجمالي</span>
                            <span>{order.total} {settings.currency}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Amazon Style */}
                      {!isCancelled && (
                        <div className="px-5 py-4 border-t border-gray-100 flex flex-wrap gap-2">
                          {order.status === 'pending' && (
                            <>
                              <button onClick={() => updateOrderStatus(activeSite.id, order.id, 'confirmed')} className="btn btn-sm" style={{ background: '#3b82f6', color: 'white' }}>
                                ✅ تأكيد الطلب
                              </button>
                              <button onClick={() => { if(confirm('هل تريد إلغاء هذا الطلب؟')) updateOrderStatus(activeSite.id, order.id, 'cancelled'); }} className="btn btn-danger btn-sm">
                                ✕ إلغاء الطلب
                              </button>
                            </>
                          )}
                          {order.status === 'confirmed' && (
                            <button onClick={() => updateOrderStatus(activeSite.id, order.id, 'shipped')} className="btn btn-sm" style={{ background: '#8b5cf6', color: 'white' }}>
                              🚚 تم الشحن
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button onClick={() => updateOrderStatus(activeSite.id, order.id, 'delivered')} className="btn btn-sm" style={{ background: '#10b981', color: 'white' }}>
                              📦 تم التوصيل
                            </button>
                          )}
                          {order.status === 'delivered' && (
                            <span className="text-green-600 text-sm font-medium flex items-center gap-2">✅ تم إكمال الطلب بنجاح</span>
                          )}
                          {/* Quick Actions */}
                          {order.customerPhone && (
                            <a href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`} target="_blank" className="btn btn-sm" style={{ background: '#25D366', color: 'white' }}>
                              💬 واتساب العميل
                            </a>
                          )}
                        </div>
                      )}
                      {isCancelled && (
                        <div className="px-5 py-3 border-t border-gray-100 bg-red-50">
                          <span className="text-red-600 text-sm">❌ تم إلغاء هذا الطلب</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              ) : (
              <div className="empty-state card">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="title">{orderFilter !== 'all' ? 'لا توجد طلبات بهذه الحالة' : 'لا توجد طلبات بعد'}</h3>
                <p className="desc">عندما يشتري عملاؤك من متجرك ستظهر الطلبات هنا</p>
              </div>
            )})()}
          </div>
        )}

        {/* Messages */}
        {activeTab === 'messages' && (
          <div className="animate-fade">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                رسائل التواصل
                {(activeSite.contactMessages || []).filter(m => !m.read).length > 0 && (
                  <span className="mr-2 text-sm text-red-500">({(activeSite.contactMessages || []).filter(m => !m.read).length} غير مقروءة)</span>
                )}
              </h2>
            </div>
            {(activeSite.contactMessages || []).length > 0 ? (
              <div className="space-y-4">
                {[...(activeSite.contactMessages || [])].reverse().map(msg => (
                  <div key={msg.id} className={`card p-5 ${!msg.read ? 'border-r-4 border-indigo-500 bg-indigo-50/30' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{msg.name}</h4>
                        {msg.email && <p className="text-sm text-gray-500" dir="ltr">{msg.email}</p>}
                      </div>
                      <div className="text-left text-xs text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">{msg.message}</p>
                    <div className="flex gap-2">
                      {!msg.read && (
                        <button onClick={() => {
                          const updated = { ...activeSite, contactMessages: (activeSite.contactMessages || []).map(m => m.id === msg.id ? { ...m, read: true } : m) };
                          updateSite(updated);
                        }} className="btn btn-secondary btn-sm text-xs">✓ تحديد كمقروء</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <div className="text-6xl mb-4">✉️</div>
                <h3 className="title">لا توجد رسائل</h3>
                <p className="desc">عندما يرسل زوار موقعك رسائل من نموذج التواصل ستظهر هنا</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteSettings;

import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { SiteSettings as SiteSettingsType, DiscountCode, Product } from '../types';
import { ArrowRight, Save, Check, Plus, Trash2, Tag, Package, Percent } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const SiteSettings: React.FC = () => {
  const { editingSite, updateSite, setCurrentPage, addProduct, updateProduct, deleteProduct, addDiscountCode, deleteDiscountCode } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'products' | 'discounts' | 'orders'>('general');
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
  
  // Discount form
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountForm, setDiscountForm] = useState<Partial<DiscountCode>>({
    type: 'percentage', value: 10, active: true, usedCount: 0
  });

  useEffect(() => {
    if (editingSite?.settings) setSettings(editingSite.settings);
  }, [editingSite]);

  if (!editingSite) return null;

  const handleSave = () => {
    updateSite({ ...editingSite, settings });
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
      updateProduct(editingSite.id, product);
    } else {
      addProduct(editingSite.id, product);
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
    addDiscountCode(editingSite.id, discount);
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
            <span className="text-gray-500">إعدادات: {editingSite.siteName}</span>
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
            { id: 'products' as const, label: `المنتجات (${editingSite.products?.length || 0})`, icon: '📦' },
            { id: 'discounts' as const, label: `أكواد الخصم (${editingSite.discountCodes?.length || 0})`, icon: '🏷️' },
            { id: 'orders' as const, label: `الطلبات (${editingSite.orders?.length || 0})`, icon: '📋' },
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
              <h2 className="text-xl font-semibold text-gray-800">المنتجات</h2>
              <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({}); }} className="btn btn-primary">
                <Plus size={16} /> إضافة منتج
              </button>
            </div>

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
                  <div className="form-group">
                    <label className="form-label">صورة المنتج (إيموجي أو رابط)</label>
                    <input type="text" value={productForm.image || ''} onChange={(e) => setProductForm(p => ({ ...p, image: e.target.value }))} className="input" placeholder="📦 أو https://..." />
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

            {editingSite.products?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {editingSite.products.map(product => (
                  <div key={product.id} className="card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                          {product.image?.startsWith('http') ? <img src={product.image} alt="" className="w-full h-full object-cover rounded-xl" /> : product.image || '📦'}
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
                        <button onClick={() => deleteProduct(editingSite.id, product.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <Package size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="title">لا توجد منتجات</h3>
                <p className="desc">أضف منتجات لعرضها في متجرك</p>
              </div>
            )}
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

            {editingSite.discountCodes?.length > 0 ? (
              <div className="space-y-3">
                {editingSite.discountCodes.map(code => (
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
                      <button onClick={() => deleteDiscountCode(editingSite.id, code.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
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

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="animate-fade">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">الطلبات</h2>
            {editingSite.orders?.length > 0 ? (
              <div className="space-y-4">
                {editingSite.orders.map(order => (
                  <div key={order.id} className="card p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">#{order.id.slice(0, 8)}</span>
                          <span className={`badge ${
                            order.status === 'delivered' ? 'badge-success' :
                            order.status === 'shipped' ? 'badge-info' :
                            order.status === 'confirmed' ? 'badge-warning' :
                            order.status === 'cancelled' ? 'badge-danger' : 'badge-info'
                          }`}>
                            {order.status === 'pending' ? 'قيد الانتظار' :
                             order.status === 'confirmed' ? 'مؤكد' :
                             order.status === 'shipped' ? 'تم الشحن' :
                             order.status === 'delivered' ? 'تم التوصيل' : 'ملغي'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('ar-EG')}</p>
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold text-indigo-600">{order.total} {settings.currency}</div>
                        {order.discount > 0 && <div className="text-sm text-green-600">خصم: {order.discount}</div>}
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">العميل:</span>
                          <span className="text-gray-800 mr-2">{order.customerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">الهاتف:</span>
                          <span className="text-gray-800 mr-2" dir="ltr">{order.customerPhone}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-400 text-sm">المنتجات:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {order.items.map((item, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {item.product.name} × {item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state card">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="title">لا توجد طلبات</h3>
                <p className="desc">ستظهر الطلبات هنا عندما يطلب العملاء من متجرك</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteSettings;

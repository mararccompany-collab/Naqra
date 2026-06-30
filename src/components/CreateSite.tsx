import React, { useState } from 'react';
import { useApp } from '../store';
import { SiteTemplate, TemplateSection, PLAN_LIMITS } from '../types';
import { ArrowRight, ArrowLeft, Check, X, Crown, Star } from 'lucide-react';

const CreateSite: React.FC = () => {
  const { templates, currentUser, createSite, setCurrentPage, canCreateMoreSites } = useApp();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<SiteTemplate | null>(null);
  const [siteName, setSiteName] = useState('');
  const [siteSlug, setSiteSlug] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');
  const [accentColor, setAccentColor] = useState('#f43f5e');
  const [fontFamily, setFontFamily] = useState('Cairo');
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [isPublished, setIsPublished] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleTemplateSelect = (template: SiteTemplate) => {
    setSelectedTemplate(template);
    setPrimaryColor(template.primaryColor);
    setSecondaryColor(template.secondaryColor);
    setAccentColor(template.accentColor);
    setSections(template.sections.map(s => ({ ...s })));
    setStep(2);
  };

  const handleSectionUpdate = (index: number, field: keyof TemplateSection, value: any) => {
    setSections(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleCreate = () => {
    if (!currentUser || !selectedTemplate || !siteName || !siteSlug) return;
    if (!canCreateMoreSites()) { setShowUpgradeModal(true); return; }
    const slug = siteSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    createSite({
      userId: currentUser.id,
      templateId: selectedTemplate.id,
      siteName,
      siteSlug: slug,
      description,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      sections,
      isPublished,
      visits: [],
      products: [],
      discountCodes: [],
      orders: [],
      categories: ['عام'],
      contactMessages: [],
      settings: {
        showHeader: true, showFooter: true, showContactForm: true, enableDarkMode: false,
        enableCart: true, enableOrders: true, enableReviews: true, enableWishlist: true, currency: 'ج.م',
        seoTitle: siteName, seoDescription: description,
        socialLinks: { facebook: '', twitter: '', instagram: '', whatsapp: '', tiktok: '', youtube: '' },
        contactEmail: currentUser.email, contactPhone: '', address: '',
        shippingMethods: [{ id: 'standard', name: 'Standard', nameAr: 'شحن عادي', cost: 0, estimatedDays: '3-7', enabled: true }],
        tax: { enabled: false, rate: 0, name: 'VAT', nameAr: 'ضريبة' },
      },
    });

    setCurrentPage('dashboard');
  };

  const categoryLabels: Record<string, string> = {
    business: 'شركات', ecommerce: 'متاجر', portfolio: 'معرض', blog: 'مدونة', 
    restaurant: 'مطعم', landing: 'هبوط', service: 'خدمات', realestate: 'عقارات',
  };

  const layoutLabels: Record<string, string> = {
    modern: 'عصري', classic: 'كلاسيكي', minimal: 'بسيط', bold: 'جريء', elegant: 'أنيق',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav">
        <div className="nav-inner">
          <div className="flex items-center gap-6">
            <span className="logo" dir="ltr">Naqra</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">إنشاء موقع جديد</span>
          </div>
          <button onClick={() => setCurrentPage('dashboard')} className="btn btn-ghost btn-sm">
            <ArrowRight size={16} /> رجوع
          </button>
        </div>
      </nav>

      <div className="container py-10">
        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-4">
            {['القالب', 'المعلومات', 'التصميم', 'المحتوى', 'النشر'].map((label, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-all ${
                  step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > i + 1 ? <Check size={18} /> : i + 1}
                </div>
                <span className={`text-xs ${step === i + 1 ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="progress"><div className="progress-bar" style={{ width: `${(step / 5) * 100}%` }} /></div>
        </div>

        {/* Step 1: Templates */}
        {step === 1 && (
          <div className="animate-fade">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر قالباً لموقعك</h2>
              <p className="text-gray-500">لدينا {templates.length} قوالب احترافية متنوعة</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                >
                  <div className="preview" style={{ background: `linear-gradient(135deg, ${template.primaryColor}, ${template.secondaryColor})` }}>
                    <span style={{ fontSize: '56px' }}>{template.thumbnail}</span>
                  </div>
                  <div className="info">
                    <div className="flex items-center justify-between mb-2">
                      <span className="name">{template.nameAr}</span>
                      <span className="badge badge-info text-xs">{categoryLabels[template.category]}</span>
                    </div>
                    <p className="desc text-xs text-gray-500">{template.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-gray-400">التصميم:</span>
                      <span className="text-xs text-gray-600">{layoutLabels[template.layout]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Info */}
        {step === 2 && (
          <div className="animate-fade max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">معلومات الموقع</h2>
              <p className="text-gray-500">أدخل المعلومات الأساسية لموقعك</p>
            </div>
            <div className="card p-8">
              <div className="form-group">
                <label className="form-label">اسم الموقع *</label>
                <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="input" placeholder="مثال: متجر أحمد للملابس" />
              </div>
              <div className="form-group">
                <label className="form-label">رابط الموقع *</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm whitespace-nowrap" dir="ltr">?site=</span>
                  <input type="text" value={siteSlug} onChange={(e) => setSiteSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="input flex-1" placeholder="my-store" dir="ltr" />
                </div>
                <p className="form-hint">هذا الرابط سيستخدمه زوارك للوصول لموقعك</p>
              </div>
              <div className="form-group">
                <label className="form-label">وصف الموقع</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input" style={{ minHeight: '100px', resize: 'none' }} placeholder="وصف قصير يظهر في محركات البحث..." />
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)} className="btn btn-ghost"><ArrowRight size={16} /> السابق</button>
              <button onClick={() => siteName && siteSlug && setStep(3)} className="btn btn-primary" disabled={!siteName || !siteSlug}>التالي <ArrowLeft size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 3: Design */}
        {step === 3 && (
          <div className="animate-fade max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">تخصيص التصميم</h2>
              <p className="text-gray-500">اختر ألوان وخطوط موقعك</p>
            </div>
            <div className="card p-8">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="form-group">
                  <label className="form-label text-sm">اللون الأساسي</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label text-sm">اللون الثانوي</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label text-sm">لون التمييز</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">نوع الخط</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="input">
                  <option value="Cairo">Cairo (القاهرة)</option>
                  <option value="Tajawal">Tajawal (تجول)</option>
                  <option value="Almarai">Almarai (المراعي)</option>
                  <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</option>
                </select>
              </div>
              <div className="mt-6">
                <label className="form-label">معاينة التصميم</label>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <div className="h-14 flex items-center justify-between px-6" style={{ background: primaryColor }}>
                    <span className="text-white font-bold">{siteName || 'اسم الموقع'}</span>
                    <div className="flex gap-4">
                      <span className="text-white/80 text-sm">الرئيسية</span>
                      <span className="text-white/80 text-sm">المنتجات</span>
                      <span className="text-white/80 text-sm">تواصل</span>
                    </div>
                  </div>
                  <div className="h-32 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)` }}>
                    <div className="text-center">
                      <h3 style={{ fontFamily, color: primaryColor }} className="font-bold text-2xl mb-2">{siteName || 'اسم الموقع'}</h3>
                      <button style={{ background: accentColor }} className="text-white px-4 py-2 rounded-lg text-sm">تسوق الآن</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(2)} className="btn btn-ghost"><ArrowRight size={16} /> السابق</button>
              <button onClick={() => setStep(4)} className="btn btn-primary">التالي <ArrowLeft size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 4: Content */}
        {step === 4 && (
          <div className="animate-fade max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">محتوى الموقع</h2>
              <p className="text-gray-500">عدّل أقسام موقعك (يمكنك تعديلها لاحقاً)</p>
            </div>
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={section.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{section.title || section.type}</h4>
                    <div className={`toggle ${section.enabled ? 'active' : ''}`} onClick={() => handleSectionUpdate(index, 'enabled', !section.enabled)} />
                  </div>
                  {section.enabled && (
                    <div className="space-y-3">
                      <input type="text" value={section.title} onChange={(e) => handleSectionUpdate(index, 'title', e.target.value)} className="input" placeholder="عنوان القسم" />
                      <textarea value={section.content} onChange={(e) => handleSectionUpdate(index, 'content', e.target.value)} className="input" style={{ minHeight: '70px', resize: 'none' }} placeholder="محتوى القسم" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(3)} className="btn btn-ghost"><ArrowRight size={16} /> السابق</button>
              <button onClick={() => setStep(5)} className="btn btn-primary">التالي <ArrowLeft size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 5: Publish */}
        {step === 5 && (
          <div className="animate-fade max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 موقعك جاهز!</h2>
              <p className="text-gray-500">راجع التفاصيل وانشر موقعك</p>
            </div>
            <div className="card p-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <span className="text-sm text-gray-400">اسم الموقع</span>
                  <p className="font-semibold text-gray-800 text-lg">{siteName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">رابط الموقع</span>
                  <p className="font-mono text-indigo-600" dir="ltr">?site={siteSlug}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">القالب</span>
                  <p className="font-semibold text-gray-800">{selectedTemplate?.nameAr}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">الألوان</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ background: primaryColor }} />
                    <div className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ background: secondaryColor }} />
                    <div className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ background: accentColor }} />
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div>
                    <h4 className="font-semibold text-green-800">نشر الموقع فوراً</h4>
                    <p className="text-green-600 text-sm">سيكون موقعك متاحاً للزوار</p>
                  </div>
                  <div className={`toggle ${isPublished ? 'active' : ''}`} onClick={() => setIsPublished(!isPublished)} />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(4)} className="btn btn-ghost"><ArrowRight size={16} /> السابق</button>
              <button onClick={handleCreate} className="btn btn-lg" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                <Check size={20} /> إنشاء الموقع
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowUpgradeModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-fade" style={{ direction: 'rtl', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer border-none">
              <X size={20} />
            </button>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">لقد وصلت للحد الأقصى!</h2>
              <p className="text-gray-500">باقتك الحالية {PLAN_LIMITS[currentUser?.plan || 'free'].label} تسمح لك بإنشاء {PLAN_LIMITS[currentUser?.plan || 'free'].maxSites === Infinity ? 'عدد غير محدود' : `موقع${PLAN_LIMITS[currentUser?.plan || 'free'].maxSites > 1 ? ' واحد فقط' : ''}`} من المواقع</p>
              <p className="text-gray-500 mt-1">قم بالترقية إلى باقة أعلى لإنشاء المزيد من المواقع</p>
            </div>

            <div className="space-y-4">
              <div onClick={() => { setShowUpgradeModal(false); setCurrentPage('landing'); }} className="p-4 bg-gradient-to-l from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Star size={24} className="text-amber-500" />
                    <span className="font-bold text-lg text-gray-800">الباقة الاحترافية</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-600">49 ج.م<span className="text-sm font-normal text-gray-500">/شهر</span></span>
                </div>
                <p className="text-sm text-gray-600 mr-9">5 مواقع + تحليلات متقدمة + دعم أولوية</p>
              </div>
              <div onClick={() => { setShowUpgradeModal(false); setCurrentPage('landing'); }} className="p-4 bg-gradient-to-l from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Crown size={24} className="text-purple-500" />
                    <span className="font-bold text-lg text-gray-800">باقة الأعمال</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">99 ج.م<span className="text-sm font-normal text-gray-500">/شهر</span></span>
                </div>
                <p className="text-sm text-gray-600 mr-9">مواقع غير محدودة + API كامل + دعم مخصص</p>
              </div>
            </div>

            <button onClick={() => { setShowUpgradeModal(false); setCurrentPage('dashboard'); }} className="w-full mt-6 py-3 border-2 border-gray-200 rounded-2xl font-medium text-gray-600 hover:bg-gray-50 cursor-pointer bg-white">
              العودة للوحة التحكم
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSite;

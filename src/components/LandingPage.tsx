import React, { useState } from 'react';
import { useApp } from '../store';
import { ArrowLeft, Globe, Zap, Shield, Palette, BarChart3, Users, Check, Star, ShoppingCart, X, CreditCard, Smartphone, Wallet, Building } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setCurrentPage, currentUser, updateUserWallet, setUserPlan, addTransaction } = useApp();
  const [showSubModal, setShowSubModal] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const features = [
    { icon: <Globe size={24} />, title: 'مواقع متعددة', desc: 'أنشئ عدداً غير محدود من المواقع الاحترافية' },
    { icon: <Zap size={24} />, title: 'سرعة فائقة', desc: 'مواقع سريعة التحميل ومحسّنة للأداء' },
    { icon: <Shield size={24} />, title: 'حماية متقدمة', desc: 'أمان متكامل لحماية بياناتك' },
    { icon: <Palette size={24} />, title: 'تخصيص كامل', desc: 'تحكم في الألوان والخطوط والتصميم' },
    { icon: <BarChart3 size={24} />, title: 'تحليلات ذكية', desc: 'تتبع زوار موقعك وأدائه' },
    { icon: <Users size={24} />, title: 'دعم متواصل', desc: 'فريق دعم متاح على مدار الساعة' },
  ];

  const templates = [
    { emoji: '🏢', name: 'بزنس', desc: 'للشركات والأعمال' },
    { emoji: '🛒', name: 'متجر', desc: 'للتجارة الإلكترونية' },
    { emoji: '🎨', name: 'معرض أعمال', desc: 'للمصممين والمبدعين' },
    { emoji: '📝', name: 'مدونة', desc: 'للمحتوى والمقالات' },
    { emoji: '🍽️', name: 'مطعم', desc: 'للمطاعم والكافيهات' },
    { emoji: '🚀', name: 'صفحة هبوط', desc: 'للحملات التسويقية' },
  ];

  const platformFeatures = [
    { icon: '📨', title: 'نظام الرسائل', desc: 'استقبل رسائل الزوار وأرسل ردوداً فورية' },
    { icon: '💬', title: 'واتساب عائم', desc: 'زر واتساب يظهر في موقعك للتواصل المباشر' },
    { icon: '🔍', title: 'بحث ذكي', desc: 'ابحث في المنتجات بسرعة وسهولة' },
    { icon: '📥', title: 'تصدير CSV', desc: 'حمّل طلباتك كملف Excel بضغطة زر' },
    { icon: '🔎', title: 'فلترة الطلبات', desc: 'صنّف الطلبات حسب الحالة وعرضها' },
    { icon: '📱', title: 'إشعارات توست', desc: 'تنبيهات منبثقة أنيقة بدون DOM manipulation' },
    { icon: '🎠', title: 'معرض صور', desc: 'عرض صور مع تكبير بتقنية Lightbox' },
    { icon: '❓', title: 'أسئلة شائعة', desc: 'قسم FAQ بأكورديون تفاعلي' },
    { icon: '👥', title: 'فريق العمل', desc: 'عرض أعضاء فريقك ببطاقات احترافية' },
    { icon: '📊', title: 'إحصائيات', desc: 'عرض إحصائيات وأرقام موقعك' },
    { icon: '💲', title: 'باقات الأسعار', desc: 'جدول أسعار احترافي لباقاتك' },
    { icon: '🍪', title: 'موافقة الكوكيز', desc: 'شريط موافقة cookies للامتثال للقوانين' },
    { icon: '⬆️', title: 'زر العودة للأعلى', desc: 'زر عائم للعودة لأعلى الصفحة' },
    { icon: '📢', title: 'شريط إعلانات', desc: 'إعلانات منبثقة في أعلى الموقع' },
    { icon: '🕐', title: 'ساعات العمل', desc: 'عرض أوقات العمل في قسم التواصل' },
    { icon: '🗺️', title: 'خرائط جوجل', desc: 'تضمين خريطة الموقع في قسم التواصل' },
    { icon: '📋', title: 'نسخ الموقع', desc: 'أنشئ نسخة كاملة من موقعك الحالي' },
    { icon: '🔄', title: 'ترتيب المنتجات', desc: 'رتب المنتجات حسب السعر والاسم' },
    { icon: '📤', title: 'مشاركة الموقع', desc: 'زر مشاركة للموقع عبر وسائل التواصل' },
    { icon: '✨', title: 'ظهور متدرج', desc: 'أنيميشن ظهور Smooth عند التمرير' },
  ];

  const testimonials = [
    { name: 'أحمد محمد', role: 'صاحب متجر', text: 'أنشأت متجري في أقل من ساعة! منصة رائعة وسهلة الاستخدام.' },
    { name: 'سارة علي', role: 'مصممة', text: 'القوالب جميلة جداً والتخصيص سهل. أنصح بها بشدة!' },
    { name: 'خالد عمر', role: 'مدير شركة', text: 'أفضل منصة لإنشاء المواقع. الدعم الفني ممتاز.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="nav">
        <div className="nav-inner">
          <span className="logo" dir="ltr">Naqra</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentPage('admin-login')} className="btn btn-ghost btn-sm">
              الإدارة
            </button>
            <button onClick={() => setCurrentPage('login')} className="btn btn-ghost btn-sm">
              تسجيل الدخول
            </button>
            <button onClick={() => setCurrentPage('register')} className="btn btn-primary btn-sm">
              ابدأ مجاناً
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="animate-fade">
          <div className="badge badge-info mb-6 mx-auto">
            ✨ منصة إنشاء المواقع الأولى عربياً
          </div>
          <h1>
            أنشئ موقعك الاحترافي
            <br />
            <span>في دقائق معدودة</span>
          </h1>
          <p>
            منصة سهلة وقوية لإنشاء مواقع الويب والمتاجر الإلكترونية بتصاميم عصرية وأدوات متقدمة
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => setCurrentPage('register')} className="btn btn-primary btn-lg">
              ابدأ الآن مجاناً
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => setCurrentPage('login')} className="btn btn-secondary btn-lg">
              لديك حساب؟
            </button>
          </div>
        </div>
      </section>

      {/* Live Demo Preview */}
      <section className="section" style={{ background: 'linear-gradient(180deg, #f8fafc, #ffffff)', overflow: 'hidden' }}>
        <div className="container text-center">
          <h2 className="section-title">شاهد موقعك مباشراً</h2>
          <p className="section-subtitle">معاينة حية للموقع الذي ستنشئه مع كل المميزات</p>
          <div className="card-flat p-4 max-w-4xl mx-auto overflow-hidden" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '12px 20px', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>متجري الإلكتروني</span>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>📦 3 منتجات</span>
                <ShoppingCart size={18} color="white" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '16px' }}>
              {[
                { emoji: '👟', name: 'حذاء رياضي', price: '149 ر.س' },
                { emoji: '👕', name: 'تيشيرت قطني', price: '79 ر.س' },
                { emoji: '🎒', name: 'حقيبة يد', price: '199 ر.س' },
              ].map((p, i) => (
                <div key={i} className="animate-slide" style={{ animationDelay: `${i * 0.1}s`, background: '#f8fafc', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>{p.emoji}</div>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>{p.name}</div>
                  <div style={{ color: '#6366f1', fontWeight: 700, fontSize: '14px', margin: '8px 0' }}>{p.price}</div>
                  <button style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                    🛒 أضف للسلة
                  </button>
                </div>
              ))}
            </div>
            <div style={{ padding: '8px 16px 16px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: '#eef2ff', color: '#6366f1', borderRadius: '20px', padding: '4px 12px', fontSize: '12px' }}>💬 واتساب</span>
                <span style={{ background: '#eef2ff', color: '#6366f1', borderRadius: '20px', padding: '4px 12px', fontSize: '12px' }}>📨 تواصل</span>
                <span style={{ background: '#eef2ff', color: '#6366f1', borderRadius: '20px', padding: '4px 12px', fontSize: '12px' }}>🔍 بحث</span>
              </div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>⬆️ العودة للأعلى</span>
            </div>
          </div>
          <button onClick={() => setCurrentPage('register')} className="btn btn-primary btn-lg mt-8">
            أنشئ موقعك الآن 
          </button>
        </div>
      </section>

      {/* Templates */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className="section-title">قوالب احترافية جاهزة</h2>
          <p className="section-subtitle">اختر من مجموعة قوالب مصممة بعناية لتناسب جميع الأعمال</p>
          <div className="grid-3">
            {templates.map((t, i) => (
              <div key={i} className="template-card animate-slide" style={{ animationDelay: `${i * 0.1}s` }} onClick={() => setCurrentPage('register')}>
                <div className="preview">{t.emoji}</div>
                <div className="info">
                  <div className="name">{t.name}</div>
                  <div className="desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">لماذا تختار Naqra؟</h2>
          <p className="section-subtitle">نوفر لك كل الأدوات التي تحتاجها لإنشاء موقع ناجح</p>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="feature-card animate-slide" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Platform Features */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <h2 className="section-title">كل مميزات المنصة</h2>
          <p className="section-subtitle">أكثر من 20 ميزة احترافية لتجعل موقعك متميزاً</p>
          <div className="grid-3">
            {platformFeatures.map((f, i) => (
              <div key={i} className="feature-card animate-slide" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="icon" style={{ fontSize: '24px' }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
        <div className="container">
          <div className="grid-4">
            {[
              { value: '10,000+', label: 'موقع تم إنشاؤه' },
              { value: '50,000+', label: 'عميل سعيد' },
              { value: '99.9%', label: 'وقت التشغيل' },
              { value: '24/7', label: 'دعم فني' },
            ].map((s, i) => (
              <div key={i} className="text-center text-white">
                <div className="text-4xl font-bold mb-2">{s.value}</div>
                <div className="text-white/80">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">ماذا يقول عملاؤنا</h2>
          <p className="section-subtitle">آراء حقيقية من عملاء يستخدمون Naqra</p>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="card-flat p-6 animate-slide" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(j => <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className="section-title">أسعار مناسبة للجميع</h2>
          <p className="section-subtitle">ابدأ مجاناً وقم بالترقية حسب احتياجاتك</p>
          <div className="grid-3 max-w-4xl mx-auto">
            {[
              { name: 'مجاني', price: '0', features: ['موقع واحد', 'قوالب أساسية', 'دعم بريدي'] },
              { name: 'احترافي', price: '49', features: ['5 مواقع', 'جميع القوالب', 'تحليلات متقدمة', 'دعم أولوية'], popular: true },
              { name: 'أعمال', price: '99', features: ['مواقع غير محدودة', 'API كامل', 'دعم مخصص'] },
            ].map((p, i) => (
              <div key={i} className={`card-flat p-8 text-center ${p.popular ? 'border-2 border-indigo-500 relative' : ''}`}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-info">
                    الأكثر طلباً
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{p.name}</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  {p.price}<span className="text-lg font-normal text-gray-500"> ج.م/شهر</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center justify-center gap-2 text-gray-600">
                      <Check size={16} className="text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setShowSubModal(p.name)} className={`btn w-full ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  {p.price === '0' ? 'ابدأ مجاناً' : 'اشترك الآن'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSubModal(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade" style={{ direction: 'rtl', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowSubModal(null)} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer border-none">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{showSubModal === 'مجاني' ? '🎉' : '🌟'}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">باقة {showSubModal}</h2>
              <p className="text-gray-500">اختر طريقة الدفع</p>
            </div>

            {currentUser && (
              <div className="p-4 bg-indigo-50 rounded-2xl mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">رصيد المحفظة</p>
                  <p className="text-2xl font-bold text-indigo-800">{currentUser.wallet || 0} ج.م</p>
                </div>
                <button onClick={() => setShowWalletModal(true)} className="text-sm bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium cursor-pointer border-none">
                  شحن المحفظة
                </button>
              </div>
            )}

            {showSubModal !== 'مجاني' && currentUser && (
              <button
                onClick={() => {
                  const price = showSubModal === 'احترافي' ? 49 : 99;
                  if ((currentUser.wallet || 0) < price) {
                    alert('رصيد المحفظة غير كافٍ. قم بشحن المحفظة أولاً.');
                    return;
                  }
                  updateUserWallet(currentUser.id, -price);
                  setUserPlan(currentUser.id, showSubModal === 'احترافي' ? 'professional' : 'business');
                  addTransaction(currentUser.id, 'subscription', -price, `اشتراك باقة ${showSubModal}`);
                  setShowSubModal(null);
                  alert(`تم تفعيل باقة ${showSubModal} بنجاح!`);
                }}
                className="w-full py-4 px-6 bg-gradient-to-l from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center justify-center gap-3 mb-3"
              >
                <Wallet size={20} />
                ادفع من المحفظة ({showSubModal === 'احترافي' ? '49' : '99'} ج.م)
              </button>
            )}

            <div className="space-y-3">
              {!currentUser && (
                <button onClick={() => { setShowSubModal(null); setCurrentPage('register'); }}
                  className="w-full py-4 px-6 bg-gradient-to-l from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center justify-center gap-3">
                  <CreditCard size={20} />
                  {showSubModal === 'مجاني' ? 'تسجيل حساب مجاني' : 'سجل حسابك أولاً'}
                </button>
              )}

              {showSubModal !== 'مجاني' && (
                <>
                  <button onClick={() => {
                    addTransaction(currentUser?.id || '', 'subscription', showSubModal === 'احترافي' ? 49 : 99, `طلب ترقية باقة ${showSubModal} - التحويل عبر إنستا باي`);
                    setShowSubModal(null);
                    alert('تم إرسال طلب الترقية. يرجى تحويل المبلغ عبر إنستا باي على الرقم 01229938115 وسيتم تفعيل الباقة بعد التأكيد من الإدارة.');
                  }}
                    className="w-full py-4 px-6 bg-gradient-to-l from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center justify-center gap-3">
                    <Smartphone size={20} />
                    دفع {showSubModal === 'احترافي' ? '49' : '99'} ج.م عبر إنستا باي
                  </button>
                  <button onClick={() => {
                    addTransaction(currentUser?.id || '', 'subscription', showSubModal === 'احترافي' ? 49 : 99, `طلب ترقية باقة ${showSubModal} - تحويل بنكي`);
                    setShowSubModal(null);
                    alert('تم إرسال طلب الترقية. يرجى تحويل المبلغ إلى الحساب البنكي: البنك الأهلي المصري - حساب رقم 123456789 وسيتم تفعيل الباقة بعد التأكيد من الإدارة.');
                  }}
                    className="w-full py-4 px-6 bg-gradient-to-l from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center justify-center gap-3">
                    <Building size={20} />
                    تحويل بنكي
                  </button>
                </>
              )}
            </div>
            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <p className="text-sm text-amber-800 text-center">
                🔒 بعد تأكيد الدفع، ستقوم الإدارة بتفعيل الباقة خلال 24 ساعة
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Top-up Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowWalletModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 animate-fade" style={{ direction: 'rtl' }}>
            <button onClick={() => setShowWalletModal(false)} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer border-none">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">💰</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">شحن المحفظة</h2>
              <p className="text-gray-500">رصيدك الحالي: <strong>{currentUser?.wallet || 0} ج.م</strong></p>
            </div>
            <div className="form-group mb-4">
              <label className="form-label">المبلغ المراد شحنه (ج.م)</label>
              <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="input" placeholder="مثال: 100" min="1" />
            </div>
            <p className="text-sm text-gray-500 mb-4 text-center">حول المبلغ على إنستا باي: <strong dir="ltr">01229938115</strong> ثم أرسل إيصال الدفع للإدارة</p>
            <button onClick={() => {
              const amount = parseInt(depositAmount);
              if (!amount || amount <= 0) { alert('أدخل مبلغ صحيح'); return; }
              if (!currentUser) { alert('سجل دخول أولاً'); return; }
              addTransaction(currentUser.id, 'deposit', amount, `شحن محفظة بمبلغ ${amount} ج.م`);
              setShowWalletModal(false);
              setDepositAmount('');
              alert('تم إرسال طلب الشحن. سيتم إضافة الرصيد إلى محفظتك بعد تأكيد الدفع من الإدارة.');
            }} className="w-full py-4 px-6 bg-gradient-to-l from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer border-none">
              تأكيد طلب الشحن
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container text-center">
          <h2 className="section-title">جاهز لإنشاء موقعك؟</h2>
          <p className="section-subtitle">انضم لآلاف العملاء الذين يثقون في Naqra</p>
          <button onClick={() => setCurrentPage('register')} className="btn btn-primary btn-lg">
            أنشئ حسابك المجاني الآن
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="logo" dir="ltr">Naqra</span>
        <p>© 2024 Naqra. جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default LandingPage;

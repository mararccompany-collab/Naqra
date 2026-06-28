import React from 'react';
import { useApp } from '../store';
import { ArrowLeft, Globe, Zap, Shield, Palette, BarChart3, Users, Check, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

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
      <section className="section" style={{ background: '#f8fafc' }}>
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
                  {p.price}<span className="text-lg font-normal text-gray-500"> ر.س/شهر</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center justify-center gap-2 text-gray-600">
                      <Check size={16} className="text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setCurrentPage('register')} className={`btn w-full ${p.popular ? 'btn-primary' : 'btn-secondary'}`}>
                  ابدأ الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

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

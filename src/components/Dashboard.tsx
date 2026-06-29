import React from 'react';
import { useApp } from '../store';
import { PLAN_LIMITS } from '../types';
import { Plus, Globe, Edit3, Trash2, Settings, BarChart3, LogOut, ExternalLink, Copy, Check, CopyPlus, User, Wallet, ShieldCheck, Smartphone, CreditCard, Bell, MessageCircle, Share2, Zap, Headphones } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, getUserSites, setCurrentPage, setEditingSite, setViewingSiteSlug, deleteSite, duplicateSite, logout } = useApp();
  const userSites = getUserSites();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  
  const planInfo = PLAN_LIMITS[currentUser?.plan || 'free'];
  const planLimit = planInfo.maxSites === Infinity ? 'غير محدود' : `${planInfo.maxSites}`;

  const { getSiteUrl } = useApp();
  const copyLink = (slug: string, id: string) => {
    const link = getSiteUrl(slug);
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav">
        <div className="nav-inner">
          <div className="flex items-center gap-6">
            <span className="logo cursor-pointer" dir="ltr" onClick={() => setCurrentPage('landing')}>Naqra</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {currentUser?.name?.[0] || 'U'}
              </div>
              <div className="hidden md:block">
                <div className="text-gray-800 font-medium text-sm">{currentUser?.name}</div>
                <div className="text-gray-400 text-xs">{currentUser?.email}</div>
              </div>
            </div>
            <button onClick={() => setCurrentPage('profile')} className="btn btn-ghost btn-sm" title="الحساب الشخصي">
              <User size={16} />
            </button>
            <button onClick={logout} className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مرحباً، {currentUser?.name} 👋</h1>
          <p className="text-gray-500">إدارة مواقعك ومتاجرك الإلكترونية</p>
        </div>

        {/* Wallet Hero */}
        <div className="mb-10">
          <div className="relative p-8 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 50%, #06b6d4 0%, transparent 50%)' }} />
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                  <Wallet size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">رصيد المحفظة</p>
                  <p className="text-4xl font-bold text-white">{currentUser?.wallet || 0} <span className="text-lg font-normal text-gray-400">ج.م</span></p>
                  <p className="text-xs text-gray-500 mt-1">آخر تحديث: الآن</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-gray-400 text-xs mb-1">الباقة الحالية</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{
                      background: currentUser?.plan === 'free' ? 'rgba(251,191,36,0.2)' : currentUser?.plan === 'professional' ? 'rgba(99,102,241,0.2)' : 'rgba(168,85,247,0.2)',
                      color: currentUser?.plan === 'free' ? '#fbbf24' : currentUser?.plan === 'professional' ? '#818cf8' : '#a855f7'
                    }}>
                      {planInfo.label}
                    </span>
                    <span className="text-gray-400 text-xs">المواقع: {userSites.length}/{planLimit}</span>
                  </div>
                </div>
                <button onClick={() => setCurrentPage('landing')} className="px-6 py-3 rounded-2xl font-semibold text-sm border-none cursor-pointer transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', color: 'white' }}>
                  شحن المحفظة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <div onClick={() => setCurrentPage('create-site')} className="card p-5 text-center cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-indigo-200">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Plus size={24} className="text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm">إنشاء موقع</h4>
            <p className="text-xs text-gray-500">موقع أو متجر جديد</p>
          </div>
          <div onClick={() => setCurrentPage('landing')} className="card p-5 text-center cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-emerald-200">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Wallet size={24} className="text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm">شحن المحفظة</h4>
            <p className="text-xs text-gray-500">أضف رصيداً لمحفظتك</p>
          </div>
          <div onClick={() => setCurrentPage('landing')} className="card p-5 text-center cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-amber-200">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm">ترقية الباقة</h4>
            <p className="text-xs text-gray-500">احصل على مميزات أكثر</p>
          </div>
          <div onClick={() => setCurrentPage('profile')} className="card p-5 text-center cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-pink-200">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm">الملف الشخصي</h4>
            <p className="text-xs text-gray-500">بيانات حسابك</p>
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap size={20} className="text-indigo-500" />
            مميزات حصرية في Naqra
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <Smartphone size={18} />, title: 'إنستا باي', desc: 'ادفع واستقبل المدفوعات عبر إنستا باي مباشرة', color: '#10b981' },
              { icon: <Headphones size={18} />, title: 'خدمة عملاء واتساب', desc: 'تواصل مع العملاء عبر واتساب بنقرة واحدة', color: '#25D366' },
              { icon: <CreditCard size={18} />, title: 'محفظة رقمية', desc: 'محفظة إلكترونية لإدارة أرباحك واشتراكاتك', color: '#6366f1' },
              { icon: <Bell size={18} />, title: 'إشعارات ذكية', desc: 'تنبيهات فورية عند وصول طلبات أو رسائل جديدة', color: '#f59e0b' },
              { icon: <Share2 size={18} />, title: 'توثيق المواقع', desc: 'علامة توثيق زرقاء لمصداقية موقعك', color: '#3b82f6' },
              { icon: <MessageCircle size={18} />, title: 'ردود تلقائية', desc: 'رسائل ترحيب وردود تلقائية للعملاء', color: '#8b5cf6' },
              { icon: <BarChart3 size={18} />, title: 'تحليلات متقدمة', desc: 'إحصائيات زوار ومبيعات بشكل لحظي', color: '#ec4899' },
              { icon: <Globe size={18} />, title: 'استضافة مجانية', desc: 'موقعك منشور على الإنترنت بدون أي رسوم استضافة', color: '#14b8a6' },
            ].map((feat, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${feat.color}15`, color: feat.color }}>
                  {feat.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm">{feat.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sites */}
        {userSites.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">مواقعك ({userSites.length})</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userSites.map((site) => (
                <div key={site.id} className="site-card animate-fade">
                  <div className="preview" style={{ background: `linear-gradient(135deg, ${site.primaryColor}, ${site.secondaryColor})` }}>
                    <span className="name">{site.siteName}</span>
                    <div className="status">
                      <span className={`badge ${site.isPublished ? 'badge-success' : 'badge-warning'}`}>
                        {site.isPublished ? 'منشور' : 'مسودة'}
                      </span>
                    </div>
                  </div>
                  <div className="content">
                    <h3 className="title">{site.siteName}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="url flex-1" dir="ltr">?site={site.siteSlug}</p>
                      <button onClick={() => copyLink(site.siteSlug, site.id)} className="text-gray-400 hover:text-indigo-500" title="نسخ الرابط">
                        {copiedId === site.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="description">{site.description || 'لا يوجد وصف'}</p>
                    
                    {/* Quick Stats */}
                    <div className="flex gap-4 mb-4 text-sm">
                      <span className="text-gray-500">📦 {site.products?.length || 0} منتج</span>
                      <span className="text-gray-500">📋 {site.orders?.length || 0} طلب</span>
                      <span className="text-gray-500">👁️ {site.visits?.length || 0} زيارة</span>
                    </div>

                    <div className="actions">
                      <button onClick={() => { setViewingSiteSlug(site.siteSlug); setCurrentPage('view-site'); }} className="btn btn-primary btn-sm">
                        <ExternalLink size={14} /> عرض
                      </button>
                      <button onClick={() => { setEditingSite(site); setCurrentPage('edit-site'); }} className="btn btn-secondary btn-sm">
                        <Edit3 size={14} /> تعديل
                      </button>
                      <button onClick={() => { setEditingSite(site); setCurrentPage('site-settings'); }} className="btn btn-ghost btn-sm">
                        <Settings size={14} />
                      </button>
                      <button onClick={() => { setEditingSite(site); setCurrentPage('analytics'); }} className="btn btn-ghost btn-sm">
                        <BarChart3 size={14} />
                      </button>
                      <button onClick={() => { const copy = duplicateSite(site.id); if (copy) { setEditingSite(copy); setCurrentPage('edit-site'); } }} className="btn btn-ghost btn-sm" title="نسخ الموقع">
                        <CopyPlus size={14} />
                      </button>
                      <button onClick={() => { if(confirm('حذف الموقع وجميع بياناته؟')) deleteSite(site.id); }} className="btn btn-danger btn-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state card">
            <div className="icon">🌐</div>
            <h3 className="title">لم تنشئ أي موقع بعد</h3>
            <p className="desc mb-6">ابدأ بإنشاء موقعك أو متجرك الأول الآن!</p>
            <button onClick={() => setCurrentPage('create-site')} className="btn btn-primary">
              <Plus size={16} /> إنشاء موقع جديد
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

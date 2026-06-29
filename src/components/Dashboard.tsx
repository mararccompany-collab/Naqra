import React from 'react';
import { useApp } from '../store';
import { Plus, Globe, Edit3, Trash2, Eye, Settings, BarChart3, LogOut, ExternalLink, Package, Copy, Check } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, getUserSites, setCurrentPage, setEditingSite, setViewingSiteSlug, deleteSite, logout } = useApp();
  const userSites = getUserSites();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  
  const totalVisits = userSites.reduce((acc, s) => acc + (s.visits?.length || 0), 0);
  const totalProducts = userSites.reduce((acc, s) => acc + (s.products?.length || 0), 0);


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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="stat-card">
            <div className="icon" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' }}>
              <Globe size={22} className="text-indigo-500" />
            </div>
            <div className="value">{userSites.length}</div>
            <div className="label">المواقع</div>
          </div>
          <div className="stat-card">
            <div className="icon" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
              <Eye size={22} className="text-green-500" />
            </div>
            <div className="value">{userSites.filter(s => s.isPublished).length}</div>
            <div className="label">منشور</div>
          </div>
          <div className="stat-card">
            <div className="icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
              <Package size={22} className="text-amber-500" />
            </div>
            <div className="value">{totalProducts}</div>
            <div className="label">المنتجات</div>
          </div>
          <div className="stat-card">
            <div className="icon" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' }}>
              <BarChart3 size={22} className="text-pink-500" />
            </div>
            <div className="value">{totalVisits}</div>
            <div className="label">الزيارات</div>
          </div>
        </div>

        {/* Create Button */}
        <div onClick={() => setCurrentPage('create-site')} className="card p-8 mb-10 cursor-pointer border-2 border-dashed border-gray-200 hover:border-indigo-300 flex items-center justify-center gap-5 group">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-200">
            <Plus size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">إنشاء موقع جديد</h3>
            <p className="text-gray-500">اختر قالباً وابدأ ببناء موقعك أو متجرك</p>
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

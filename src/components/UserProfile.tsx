import React, { useState } from 'react';
import { useApp } from '../store';
import { PLAN_LIMITS } from '../types';
import { Save, Check, Lock, Globe, LogOut, Edit3, Settings, ExternalLink, Wallet, ShieldCheck, ArrowUp, ArrowDown, Clock } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { currentUser, updateUserProfile, updateUserPassword, getUserSites, setCurrentPage, setEditingSite, setViewingSiteSlug, logout, getTransactions } = useApp();
  const openWhatsAppTopUp = () => {
    const msg = encodeURIComponent('مرحباً، أريد شحن محفظتي في Naqra. (البريد: ' + (currentUser?.email || '') + ')');
    window.open(`https://wa.me/201229938115?text=${msg}`, '_blank');
  };
  const goToUpgrade = () => { setCurrentPage('landing'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 300); };
  const userSites = getUserSites();
  const planInfo = PLAN_LIMITS[currentUser?.plan || 'free'];
  const planLimit = planInfo.maxSites === Infinity ? 'غير محدود' : `${planInfo.maxSites}`;
  const txHistory = currentUser ? getTransactions(currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [error, setError] = useState('');

  const totalVisits = userSites.reduce((a, s) => a + (s.visits?.length || 0), 0);
  const totalOrders = userSites.reduce((a, s) => a + (s.orders?.length || 0), 0);
  const totalProducts = userSites.reduce((a, s) => a + (s.products?.length || 0), 0);

  if (!currentUser) return null;

  const handleSaveProfile = () => {
    if (!name.trim()) { setError('الاسم مطلوب'); return; }
    if (!email.trim()) { setError('البريد الإلكتروني مطلوب'); return; }
    const ok = updateUserProfile(name, email);
    if (!ok) { setError('البريد الإلكتروني مستخدم بالفعل'); return; }
    setSaved(true); setError('');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw) { setError('يرجى ملء جميع الحقول'); return; }
    if (newPw.length < 4) { setError('كلمة المرور الجديدة قصيرة جداً'); return; }
    if (newPw !== confirmPw) { setError('كلمة المرور غير متطابقة'); return; }
    const ok = updateUserPassword(currentPw, newPw);
    if (!ok) { setError('كلمة المرور الحالية غير صحيحة'); return; }
    setPwSaved(true); setError(''); setCurrentPw(''); setNewPw(''); setConfirmPw('');
    setTimeout(() => setPwSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav">
        <div className="nav-inner">
          <div className="flex items-center gap-6">
            <span className="logo cursor-pointer" dir="ltr" onClick={() => setCurrentPage('landing')}>Naqra</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">الحساب الشخصي</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentPage('dashboard')} className="btn btn-ghost btn-sm">لوحة التحكم</button>
            <button onClick={logout} className="btn btn-danger btn-sm"><LogOut size={14} /> خروج</button>
          </div>
        </div>
      </nav>

      <div className="container py-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 الحساب الشخصي</h1>
          <p className="text-gray-500">إدارة بيانات حسابك ومواقعك</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* User Info */}
        <div className="card p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {currentUser.name[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
              <p className="text-gray-500">{currentUser.email}</p>
              <p className="text-xs text-gray-400 mt-1">عضو منذ {new Date(currentUser.createdAt).toLocaleDateString('ar-EG')}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-6">تعديل البيانات</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">الاسم</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" dir="ltr" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={handleSaveProfile} className={`btn ${saved ? 'bg-green-500 text-white' : 'btn-primary'}`}>
              {saved ? <><Check size={16} /> تم الحفظ</> : <><Save size={16} /> حفظ التغييرات</>}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="card p-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">تغيير كلمة المرور</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">كلمة المرور الحالية</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="input" dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">كلمة المرور الجديدة</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="input" dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">تأكيد كلمة المرور</label>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="input" dir="ltr" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={handleChangePassword} className={`btn ${pwSaved ? 'bg-green-500 text-white' : 'btn-primary'}`}>
              {pwSaved ? <><Check size={16} /> تم التغيير</> : <><Lock size={16} /> تغيير كلمة المرور</>}
            </button>
          </div>
        </div>

        {/* Wallet & Plan */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                <Wallet size={24} className="text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">رصيد المحفظة</h3>
                <p className="text-2xl font-bold text-emerald-600">{currentUser.wallet || 0} ج.م</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={openWhatsAppTopUp} className="btn btn-sm flex-1" style={{ background: '#25D366', color: 'white' }}>شحن عبر واتساب</button>
              <button onClick={goToUpgrade} className="btn btn-amber btn-sm flex-1">ترقية الباقة</button>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                <ShieldCheck size={24} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">الباقة الحالية</h3>
                <p className="text-2xl font-bold text-amber-600">{planInfo.label}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500">حد المواقع: {userSites.length}/{planLimit}</span>
            </div>
          </div>
        </div>

        {/* Transactions */}
        {txHistory.length > 0 && (
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={20} className="text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-800">سجل المعاملات المالية</h3>
            </div>
            <div className="space-y-2">
              {txHistory.slice(0, 10).map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-100' : tx.type === 'subscription' ? 'bg-blue-100' : 'bg-red-100'}`}>
                      {tx.type === 'deposit' ? <ArrowDown size={18} className="text-emerald-600" /> : <ArrowUp size={18} className="text-red-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{tx.note}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} ج.م
                    </span>
                    <div>
                      <span className={`text-xs ${tx.confirmed ? 'text-green-600' : 'text-amber-600'}`}>
                        {tx.confirmed ? 'مؤكد' : 'قيد الانتظار'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="stat-card text-center">
            <div className="text-3xl font-bold text-indigo-600">{userSites.length}</div>
            <div className="text-sm text-gray-500">المواقع</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-3xl font-bold text-green-600">{totalProducts}</div>
            <div className="text-sm text-gray-500">المنتجات</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-3xl font-bold text-amber-600">{totalOrders}</div>
            <div className="text-sm text-gray-500">الطلبات</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-3xl font-bold text-pink-600">{totalVisits}</div>
            <div className="text-sm text-gray-500">الزيارات</div>
          </div>
        </div>

        {/* User Sites */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">
              <Globe size={20} className="inline ml-2" />
              مواقعي ({userSites.length})
            </h3>
            <button onClick={() => setCurrentPage('create-site')} className="btn btn-primary btn-sm">
              + إنشاء موقع
            </button>
          </div>

          {userSites.length > 0 ? (
            <div className="space-y-3">
              {userSites.map(site => (
                <div key={site.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white" style={{ background: `linear-gradient(135deg, ${site.primaryColor}, ${site.secondaryColor})` }}>
                      {site.siteName[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{site.siteName}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>📦 {site.products?.length || 0}</span>
                        <span>📋 {site.orders?.length || 0}</span>
                        <span>👁️ {site.visits?.length || 0}</span>
                        <span className={`badge ${site.isPublished ? 'badge-success' : 'badge-warning'} text-xs`}>
                          {site.isPublished ? 'منشور' : 'مسودة'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setViewingSiteSlug(site.siteSlug); setCurrentPage('view-site'); }} className="btn btn-ghost btn-sm"><ExternalLink size={14} /></button>
                    <button onClick={() => { setEditingSite(site); setCurrentPage('edit-site'); }} className="btn btn-ghost btn-sm"><Edit3 size={14} /></button>
                    <button onClick={() => { setEditingSite(site); setCurrentPage('site-settings'); }} className="btn btn-ghost btn-sm"><Settings size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Globe size={48} className="mx-auto mb-4 opacity-50" />
              <p>لم تنشئ أي موقع بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
import React, { useState } from 'react';
import { useApp } from '../store';
import { DailyAnalytics } from '../types';
import { LogOut, Users, Globe, BarChart3, Trash2, Eye, Search, Activity } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminPanel: React.FC = () => {
  const { users, sites, deleteUser, deleteSite, getAllAnalytics, logout, setViewingSiteSlug, setCurrentPage } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'sites' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  const analytics = getAllAnalytics();
  const totalVisitors = analytics.reduce((acc: number, d: DailyAnalytics) => acc + d.visitors, 0);
  const totalPageViews = analytics.reduce((acc: number, d: DailyAnalytics) => acc + d.pageViews, 0);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSites = sites.filter(s => s.siteName.toLowerCase().includes(searchQuery.toLowerCase()) || s.siteSlug.toLowerCase().includes(searchQuery.toLowerCase()));

  const sitesByCategory = [
    { name: 'شركات', value: sites.filter(s => s.templateId === 't1').length, color: '#6366f1' },
    { name: 'متاجر', value: sites.filter(s => s.templateId === 't2').length, color: '#8b5cf6' },
    { name: 'معرض', value: sites.filter(s => s.templateId === 't3').length, color: '#a855f7' },
    { name: 'مدونة', value: sites.filter(s => s.templateId === 't4').length, color: '#c084fc' },
    { name: 'مطعم', value: sites.filter(s => s.templateId === 't5').length, color: '#d8b4fe' },
    { name: 'هبوط', value: sites.filter(s => s.templateId === 't6').length, color: '#e9d5ff' },
  ].filter(c => c.value > 0);

  const recentData = analytics.slice(-14);

  const handleViewSite = (slug: string) => { setViewingSiteSlug(slug); setCurrentPage('view-site'); };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav" style={{ background: '#1e293b' }}>
        <div className="nav-inner">
          <div className="flex items-center gap-6">
            <span className="logo" dir="ltr" style={{ color: 'white', WebkitTextFillColor: 'white' }}>Naqra</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-300 text-sm">لوحة الإدارة</span>
          </div>
          <button onClick={logout} className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
            <LogOut size={16} /> خروج
          </button>
        </div>
      </nav>

      <div className="container py-10">
        {/* Tabs */}
        <div className="tabs mb-10">
          {[
            { id: 'overview' as const, label: 'نظرة عامة', icon: <BarChart3 size={16} /> },
            { id: 'users' as const, label: 'المستخدمون', icon: <Users size={16} /> },
            { id: 'sites' as const, label: 'المواقع', icon: <Globe size={16} /> },
            { id: 'analytics' as const, label: 'التحليلات', icon: <Activity size={16} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab ${activeTab === tab.id ? 'active' : ''}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="animate-fade">
            <div className="grid-4 mb-10">
              <div className="stat-card">
                <div className="icon" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' }}>
                  <Users size={22} className="text-indigo-500" />
                </div>
                <div className="value">{users.length}</div>
                <div className="label">المستخدمون</div>
              </div>
              <div className="stat-card">
                <div className="icon" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
                  <Globe size={22} className="text-green-500" />
                </div>
                <div className="value">{sites.length}</div>
                <div className="label">المواقع</div>
              </div>
              <div className="stat-card">
                <div className="icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
                  <Eye size={22} className="text-amber-500" />
                </div>
                <div className="value">{sites.filter(s => s.isPublished).length}</div>
                <div className="label">منشور</div>
              </div>
              <div className="stat-card">
                <div className="icon" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' }}>
                  <Activity size={22} className="text-pink-500" />
                </div>
                <div className="value">{totalVisitors}</div>
                <div className="label">الزيارات</div>
              </div>
            </div>

            <div className="grid-2 mb-10">
              <div className="chart-card">
                <h3>نمو الزوار</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={recentData}>
                    <defs>
                      <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="visitors" stroke="#6366f1" fillOpacity={1} fill="url(#adminGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {sitesByCategory.length > 0 ? (
                <div className="chart-card">
                  <h3>المواقع حسب النوع</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={sitesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {sitesByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-card flex items-center justify-center">
                  <div className="empty-state">
                    <div className="icon">📊</div>
                    <p className="desc">لا توجد مواقع بعد</p>
                  </div>
                </div>
              )}
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">آخر المستخدمين</h3>
              {users.length === 0 ? (
                <p className="text-gray-400 text-center py-6">لا يوجد مستخدمون</p>
              ) : (
                <div className="space-y-3">
                  {users.slice(-5).reverse().map(user => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {user.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="animate-fade">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">المستخدمون ({users.length})</h2>
              <div className="input-icon w-64">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input" placeholder="بحث..." />
                <Search size={18} />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="card empty-state">
                <div className="icon">👥</div>
                <h3 className="title">لا يوجد مستخدمون</h3>
              </div>
            ) : (
              <div className="card-flat overflow-hidden">
                <table className="table">
                  <thead>
                    <tr>
                      <th>المستخدم</th>
                      <th>البريد</th>
                      <th>التاريخ</th>
                      <th>المواقع</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {user.name[0]}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td dir="ltr">{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                        <td><span className="badge badge-info">{sites.filter(s => s.userId === user.id).length}</span></td>
                        <td>
                          <button onClick={() => { if(confirm('حذف المستخدم ومواقعه؟')) deleteUser(user.id); }} className="btn btn-danger btn-sm">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Sites */}
        {activeTab === 'sites' && (
          <div className="animate-fade">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">المواقع ({sites.length})</h2>
              <div className="input-icon w-64">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input" placeholder="بحث..." />
                <Search size={18} />
              </div>
            </div>

            {filteredSites.length === 0 ? (
              <div className="card empty-state">
                <div className="icon">🌐</div>
                <h3 className="title">لا توجد مواقع</h3>
              </div>
            ) : (
              <div className="grid-3">
                {filteredSites.map(site => {
                  const owner = users.find(u => u.id === site.userId);
                  return (
                    <div key={site.id} className="site-card animate-fade">
                      <div className="preview" style={{ background: `linear-gradient(135deg, ${site.primaryColor}, ${site.secondaryColor})` }}>
                        <span className="name">{site.siteName}</span>
                        <div className="status">
                          <span className={`badge ${site.isPublished ? 'badge-success' : 'badge-warning'}`}>{site.isPublished ? 'منشور' : 'مسودة'}</span>
                        </div>
                      </div>
                      <div className="content">
                        <h3 className="title">{site.siteName}</h3>
                        <p className="url" dir="ltr">/{site.siteSlug}</p>
                        <p className="text-sm text-gray-500 mb-4">المالك: {owner?.name || '—'}</p>
                        <div className="actions">
                          <button onClick={() => handleViewSite(site.siteSlug)} className="btn btn-secondary btn-sm"><Eye size={14} /> عرض</button>
                          <button onClick={() => { if(confirm('حذف الموقع؟')) deleteSite(site.id); }} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <div className="animate-fade">
            <div className="grid-4 mb-10">
              <div className="stat-card">
                <div className="value">{totalVisitors}</div>
                <div className="label">الزوار</div>
              </div>
              <div className="stat-card">
                <div className="value">{totalPageViews}</div>
                <div className="label">المشاهدات</div>
              </div>
              <div className="stat-card">
                <div className="value">{users.length}</div>
                <div className="label">المستخدمون</div>
              </div>
              <div className="stat-card">
                <div className="value">{sites.filter(s => s.isPublished).length}</div>
                <div className="label">منشور</div>
              </div>
            </div>

            <div className="grid-2">
              <div className="chart-card">
                <h3>الزوار</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={recentData}>
                    <defs>
                      <linearGradient id="adminAnalytics" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="visitors" stroke="#6366f1" fillOpacity={1} fill="url(#adminAnalytics)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>المشاهدات</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={recentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                    <Bar dataKey="pageViews" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

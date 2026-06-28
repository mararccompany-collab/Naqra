import React from 'react';
import { useApp } from '../store';
import { DailyAnalytics } from '../types';
import { ArrowRight, Users, Eye, Activity, TrendingUp, Monitor, Smartphone, Tablet } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics: React.FC = () => {
  const { editingSite, getSiteAnalytics, setCurrentPage } = useApp();
  
  if (!editingSite) return null;
  
  const analytics = getSiteAnalytics(editingSite.id);
  const totalVisitors = analytics.reduce((acc: number, d: DailyAnalytics) => acc + d.visitors, 0);
  const totalPageViews = analytics.reduce((acc: number, d: DailyAnalytics) => acc + d.pageViews, 0);
  const avgBounceRate = analytics.length > 0 ? Math.round(analytics.reduce((acc: number, d: DailyAnalytics) => acc + d.bounceRate, 0) / analytics.length) : 0;
  const avgVisitorsPerDay = analytics.length > 0 ? Math.round(totalVisitors / analytics.length) : 0;

  const totalDevices = analytics.reduce((acc, d) => ({
    desktop: acc.desktop + d.devices.desktop,
    mobile: acc.mobile + d.devices.mobile,
    tablet: acc.tablet + d.devices.tablet,
  }), { desktop: 0, mobile: 0, tablet: 0 });

  const recentData = analytics.slice(-14);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="nav">
        <div className="nav-inner">
          <div className="flex items-center gap-6">
            <span className="logo" dir="ltr">Naqra</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">تحليلات: {editingSite.siteName}</span>
          </div>
          <button onClick={() => setCurrentPage('dashboard')} className="btn btn-ghost btn-sm">
            <ArrowRight size={16} /> رجوع
          </button>
        </div>
      </nav>

      <div className="container py-10">
        {/* Stats */}
        <div className="grid-4 mb-10">
          <div className="stat-card">
            <div className="icon" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' }}>
              <Users size={22} className="text-indigo-500" />
            </div>
            <div className="value">{totalVisitors}</div>
            <div className="label">الزوار</div>
          </div>
          <div className="stat-card">
            <div className="icon" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
              <Eye size={22} className="text-green-500" />
            </div>
            <div className="value">{totalPageViews}</div>
            <div className="label">المشاهدات</div>
          </div>
          <div className="stat-card">
            <div className="icon" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
              <Activity size={22} className="text-amber-500" />
            </div>
            <div className="value">{avgBounceRate}%</div>
            <div className="label">معدل الارتداد</div>
          </div>
          <div className="stat-card">
            <div className="icon" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)' }}>
              <TrendingUp size={22} className="text-pink-500" />
            </div>
            <div className="value">{avgVisitorsPerDay}</div>
            <div className="label">متوسط يومي</div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="chart-card mb-6">
          <h3>الزوار - آخر 14 يوم</h3>
          {totalVisitors === 0 ? (
            <div className="empty-state">
              <div className="icon">📊</div>
              <h3 className="title">لا توجد بيانات بعد</h3>
              <p className="desc">ستظهر التحليلات عند زيارة موقعك</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={recentData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="visitors" stroke="#6366f1" fillOpacity={1} fill="url(#colorVisitors)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid-2">
          {/* Page Views */}
          <div className="chart-card">
            <h3>المشاهدات</h3>
            {totalPageViews === 0 ? (
              <div className="empty-state py-10">
                <p className="text-gray-400">لا توجد بيانات</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={recentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                  <Bar dataKey="pageViews" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Devices */}
          <div className="chart-card">
            <h3>الأجهزة</h3>
            {totalVisitors === 0 ? (
              <div className="empty-state py-10">
                <p className="text-gray-400">لا توجد بيانات</p>
              </div>
            ) : (
              <div className="space-y-6 pt-4">
                {[
                  { icon: <Monitor size={20} />, label: 'كمبيوتر', value: totalDevices.desktop, color: '#6366f1' },
                  { icon: <Smartphone size={20} />, label: 'موبايل', value: totalDevices.mobile, color: '#8b5cf6' },
                  { icon: <Tablet size={20} />, label: 'تابلت', value: totalDevices.tablet, color: '#a855f7' },
                ].map((device, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${device.color}15`, color: device.color }}>
                        {device.icon}
                      </div>
                      <span className="text-gray-600">{device.label}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-1 mr-6">
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${totalVisitors > 0 ? (device.value / totalVisitors) * 100 : 0}%`, background: device.color }} />
                      </div>
                      <span className="text-gray-800 font-semibold w-8">{device.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

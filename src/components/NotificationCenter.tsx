import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { Bell, CheckCheck, X, Check, AlertTriangle, Smartphone } from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const { currentUser, getNotifications, markNotificationRead, markAllNotificationsRead, getUnreadCount, setCurrentPage } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const userId = currentUser?.id || '';
  const unread = getUnreadCount(userId);
  const notifications = getNotifications(userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  useEffect(() => {
    const handle = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const icons: Record<string, any> = { success: <Check size={14} />, warning: <AlertTriangle size={14} />, error: <X size={14} />, info: <Smartphone size={14} /> };
  const colors: Record<string, string> = { success: 'bg-emerald-500', warning: 'bg-amber-500', error: 'bg-red-500', info: 'bg-indigo-500' };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer border-none">
        <Bell size={18} />
        {unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-fade">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">الإشعارات</h3>
            {unread > 0 && <button onClick={() => { markAllNotificationsRead(userId); }} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer bg-transparent border-none flex items-center gap-1"><CheckCheck size={14} /> تحديد الكل كمقروء</button>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">لا توجد إشعارات</div>
            ) : notifications.map(n => (
              <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-50/50' : ''}`} onClick={() => { markNotificationRead(userId, n.id); if (n.link) setCurrentPage(n.link as any); setOpen(false); }}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full ${colors[n.type]} flex items-center justify-center text-white flex-shrink-0 mt-0.5`}>{icons[n.type]}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
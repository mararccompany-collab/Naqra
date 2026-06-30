import React, { useState } from 'react';
import { useApp } from '../store';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, DollarSign, Search, Download } from 'lucide-react';

interface Props {
  siteId: string;
  onBack: () => void;
}

const CustomersPage: React.FC<Props> = ({ siteId, onBack }) => {
  const { getCustomers, exportOrdersCSV, exportContactsCSV, notify } = useApp();
  const customers = getCustomers(siteId);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => c.name.includes(search) || c.email.includes(search) || c.phone.includes(search));

  const downloadCSV = (type: 'orders' | 'contacts') => {
    const csv = type === 'orders' ? exportOrdersCSV(siteId) : exportContactsCSV(siteId);
    if (!csv) { notify({ title: 'لا توجد بيانات', message: 'لا يوجد بيانات للتصدير', type: 'warning' }); return; }
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    notify({ title: 'تم التصدير', message: `تم تصدير ملف ${type === 'orders' ? 'الطلبات' : 'جهات الاتصال'} بنجاح`, type: 'success' });
  };

  return (
    <div className="animate-fade">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer border-none"><ArrowLeft size={18} /></button>
          <h2 className="text-xl font-bold text-gray-800">إدارة العملاء</h2>
          <span className="text-sm text-gray-500">({customers.length} عميل)</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV('orders')} className="btn btn-ghost btn-sm"><Download size={14} /> تصدير الطلبات</button>
          <button onClick={() => downloadCSV('contacts')} className="btn btn-ghost btn-sm"><Download size={14} /> تصدير جهات الاتصال</button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input pr-10" placeholder="بحث عن عميل بالاسم أو البريد أو الهاتف..." />
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state"><div className="icon">👥</div><h3 className="title">{customers.length === 0 ? 'لا يوجد عملاء بعد' : 'لا توجد نتائج للبحث'}</h3></div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(c => (
            <div key={c.email} className="card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">{c.name[0]}</div>
                  <div>
                    <h3 className="font-bold text-gray-800">{c.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Mail size={12} /> {c.email}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {c.phone}</span>
                      {c.address && <span className="flex items-center gap-1"><MapPin size={12} /> {c.address}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold"><ShoppingBag size={14} /> {c.totalOrders}</div>
                    <div className="text-xs text-gray-500">طلب</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-indigo-600 font-bold"><DollarSign size={14} /> {c.totalSpent}</div>
                    <div className="text-xs text-gray-500">ج.م</div>
                  </div>
                  {c.lastOrderDate && <div className="text-xs text-gray-400">آخر طلب: {new Date(c.lastOrderDate).toLocaleDateString('ar-EG')}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
import React, { useState } from 'react';
import { useApp } from '../store';
import { Plan, PLAN_LIMITS } from '../types';
import { X, Wallet, Smartphone, Building, ShieldCheck, Crown, Star } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const DashboardUpgradeModal: React.FC<Props> = ({ onClose }) => {
  const { currentUser, updateUserWallet, setUserPlan, addTransaction, notify } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const plans: { key: Plan; price: number; icon: any; color: string; }[] = [
    { key: 'professional', price: 49, icon: <Star size={24} />, color: '#6366f1' },
    { key: 'business', price: 99, icon: <Crown size={24} />, color: '#a855f7' },
  ];

  const handlePayWithWallet = () => {
    if (!currentUser || !selectedPlan) return;
    const price = selectedPlan === 'professional' ? 49 : 99;
    if ((currentUser.wallet || 0) < price) {
      onClose();
      notify({ title: 'رصيد غير كافٍ', message: 'رصيد محفظتك لا يكفي لترقية الباقة. قم بشحن المحفظة أولاً.', type: 'warning' });
      return;
    }
    updateUserWallet(currentUser.id, -price);
    setUserPlan(currentUser.id, selectedPlan);
    addTransaction(currentUser.id, 'subscription', -price, `اشتراك باقة ${PLAN_LIMITS[selectedPlan].label}`);
    setSelectedPlan(null);
    setShowPayment(false);
    onClose();
    notify({ title: 'تم التفعيل بنجاح! 🎉', message: `تم تفعيل باقة ${PLAN_LIMITS[selectedPlan].label} على حسابك.`, type: 'success' });
  };

  const handleInstaPay = () => {
    if (!currentUser || !selectedPlan) return;
    const price = selectedPlan === 'professional' ? 49 : 99;
    addTransaction(currentUser.id, 'subscription', price, `طلب ترقية باقة ${PLAN_LIMITS[selectedPlan].label} - التحويل عبر إنستا باي`);
    setSelectedPlan(null);
    setShowPayment(false);
    onClose();
    notify({ title: 'تم إرسال الطلب', message: `يرجى تحويل ${price} ج.م عبر إنستا باي على الرقم 01229938115 وسيتم تفعيل الباقة بعد التأكيد من الإدارة.`, type: 'info' });
  };

  const handleBankTransfer = () => {
    if (!currentUser || !selectedPlan) return;
    const price = selectedPlan === 'professional' ? 49 : 99;
    addTransaction(currentUser.id, 'subscription', price, `طلب ترقية باقة ${PLAN_LIMITS[selectedPlan].label} - تحويل بنكي`);
    setSelectedPlan(null);
    setShowPayment(false);
    onClose();
    notify({ title: 'تم إرسال الطلب', message: `يرجى تحويل ${price} ج.م إلى الحساب البنكي: البنك الأهلي المصري - حساب رقم 123456789 وسيتم تفعيل الباقة بعد التأكيد من الإدارة.`, type: 'info' });
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-6" style={{ direction: 'rtl' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSelectedPlan(null); setShowPayment(false); onClose(); }} />
      <div className="relative w-full max-w-lg animate-fade">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2" />
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                  <ShieldCheck size={24} color="white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">ترقية الباقة</h2>
                  <p className="text-sm text-gray-500">اختر الباقة التي تناسب احتياجاتك</p>
                </div>
              </div>
              <button onClick={() => { setSelectedPlan(null); setShowPayment(false); onClose(); }} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer border-none">
                <X size={20} />
              </button>
            </div>

            {!showPayment ? (
              <div className="grid gap-4">
                {plans.map(p => {
                  const plan = PLAN_LIMITS[p.key];
                  const isCurrent = currentUser?.plan === p.key;
                  return (
                    <div key={p.key} onClick={() => { if (!isCurrent) { setSelectedPlan(p.key); setShowPayment(true); } }} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${isCurrent ? 'border-emerald-300 bg-emerald-50 opacity-60' : selectedPlan === p.key ? 'border-indigo-400 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${p.color}20`, color: p.color }}>
                            {p.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">{plan.label}</h3>
                            <div className="flex items-center gap-4 mt-2">
                              {plan.maxSites === Infinity ? (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">مواقع غير محدودة</span>
                              ) : (
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">حد أقصى {plan.maxSites} مواقع</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className="text-3xl font-bold text-gray-800">{p.price}</span>
                          <span className="text-sm text-gray-500 mr-1">ج.م/شهر</span>
                        </div>
                      </div>
                      {isCurrent && (
                        <div className="mt-3 text-emerald-600 text-sm font-semibold text-center">✓ هذه باقاتك الحالية</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="animate-fade">
                {selectedPlan && (
                  <>
                    <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${plans.find(p => p.key === selectedPlan)?.color}20`, color: plans.find(p => p.key === selectedPlan)?.color }}>
                            {plans.find(p => p.key === selectedPlan)?.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{PLAN_LIMITS[selectedPlan].label}</h3>
                            <p className="text-sm text-gray-500">{selectedPlan === 'professional' ? '49' : '99'} ج.م / شهرياً</p>
                          </div>
                        </div>
                        <button onClick={() => setShowPayment(false)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer bg-transparent border-none">
                          تغيير الباقة
                        </button>
                      </div>
                    </div>

                    {currentUser && (
                      <div className="p-4 bg-gray-50 rounded-2xl mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">رصيد المحفظة</p>
                          <p className="text-2xl font-bold text-gray-800">{currentUser.wallet || 0} ج.م</p>
                        </div>
                      </div>
                    )}

                    <button onClick={handlePayWithWallet} className="w-full py-4 px-6 bg-gradient-to-l from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center justify-center gap-3 mb-3">
                      <Wallet size={20} />
                      ادفع من المحفظة ({selectedPlan === 'professional' ? '49' : '99'} ج.م)
                    </button>

                    <button onClick={handleInstaPay} className="w-full py-4 px-6 bg-gradient-to-l from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center justify-center gap-3 mb-3">
                      <Smartphone size={20} />
                      دفع {selectedPlan === 'professional' ? '49' : '99'} ج.م عبر إنستا باي
                    </button>

                    <button onClick={handleBankTransfer} className="w-full py-4 px-6 bg-gradient-to-l from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center justify-center gap-3">
                      <Building size={20} />
                      تحويل بنكي
                    </button>

                    <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                      <p className="text-sm text-amber-800 text-center">🔒 بعد تأكيد الدفع، ستقوم الإدارة بتفعيل الباقة خلال 24 ساعة</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUpgradeModal;
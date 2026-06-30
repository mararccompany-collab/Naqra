import React, { useEffect } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

export interface NotifyOptions {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  confirmLabel?: string;
  onConfirm?: () => void;
  onClose?: () => void;
  showCancel?: boolean;
}

interface Props {
  options: NotifyOptions | null;
  setOptions: (o: NotifyOptions | null) => void;
}

const NotificationModal: React.FC<Props> = ({ options, setOptions }) => {
  useEffect(() => {
    if (!options) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOptions(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [options, setOptions]);

  if (!options) return null;

  const { title, message, type = 'info', confirmLabel, onConfirm, onClose, showCancel } = options;

  const icons = {
    success: <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200"><Check size={32} color="white" /></div>,
    error: <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-200"><X size={32} color="white" /></div>,
    warning: <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200"><AlertTriangle size={32} color="white" /></div>,
    info: <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-200"><Info size={32} color="white" /></div>,
  };

  const gradients = {
    success: 'from-emerald-500 to-green-600',
    error: 'from-red-500 to-rose-600',
    warning: 'from-amber-500 to-orange-600',
    info: 'from-indigo-500 to-purple-600',
  };

  const close = () => { setOptions(null); onClose?.(); };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6" style={{ direction: 'rtl' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
      <div className="relative w-full max-w-md animate-fade">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${gradients[type]} h-2`} />
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">{icons[type]}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed mb-8 text-sm">{message}</p>
            <div className="flex gap-3">
              {onConfirm && (
                <button onClick={() => { onConfirm(); close(); }} className={`flex-1 py-3.5 rounded-2xl text-white font-bold text-sm border-none cursor-pointer hover:opacity-90 transition-all shadow-lg ${type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-200' : type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-200' : type === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-200' : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-200'}`}>
                  {confirmLabel || 'موافق'}
                </button>
              )}
              {!onConfirm && (
                <button onClick={close} className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm border-none cursor-pointer hover:opacity-90 transition-all shadow-lg bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-200">
                  {confirmLabel || 'حسناً'}
                </button>
              )}
              {showCancel && (
                <button onClick={close} className="flex-1 py-3.5 rounded-2xl font-bold text-sm cursor-pointer border-2 border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all">
                  إلغاء
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
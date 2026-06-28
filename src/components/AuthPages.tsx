import React, { useState } from 'react';
import { useApp } from '../store';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser, setCurrentPage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (!loginUser(email, password)) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade">
        <div className="text-center mb-8">
          <span className="logo text-3xl cursor-pointer" dir="ltr" onClick={() => setCurrentPage('landing')}>
            Naqra
          </span>
          <p className="text-gray-500 mt-3 text-lg">تسجيل الدخول إلى حسابك</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div className="input-icon">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="example@email.com"
                  dir="ltr"
                />
                <Mail size={18} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <div className="relative">
                <div className="input-icon">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    style={{ paddingLeft: '48px' }}
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-6">
              تسجيل الدخول
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              ليس لديك حساب؟{' '}
              <button onClick={() => setCurrentPage('register')} className="text-indigo-600 font-semibold hover:underline">
                سجل الآن
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mt-6 mx-auto"
        >
          <ArrowRight size={16} />
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { registerUser, setCurrentPage } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (!registerUser(name, email, password)) {
      setError('البريد الإلكتروني مسجل مسبقاً');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade">
        <div className="text-center mb-8">
          <span className="logo text-3xl cursor-pointer" dir="ltr" onClick={() => setCurrentPage('landing')}>
            Naqra
          </span>
          <p className="text-gray-500 mt-3 text-lg">إنشاء حساب جديد</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">الاسم الكامل</label>
              <div className="input-icon">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="اسمك الكامل" />
                <User size={18} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div className="input-icon">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="example@email.com" dir="ltr" />
                <Mail size={18} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <div className="relative">
                <div className="input-icon">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input" style={{ paddingLeft: '48px' }} placeholder="••••••••" dir="ltr" />
                  <Lock size={18} />
                </div>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">تأكيد كلمة المرور</label>
              <div className="input-icon">
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" placeholder="••••••••" dir="ltr" />
                <Lock size={18} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-6">
              إنشاء حساب
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500">
              لديك حساب بالفعل؟{' '}
              <button onClick={() => setCurrentPage('login')} className="text-indigo-600 font-semibold hover:underline">
                سجل دخولك
              </button>
            </p>
          </div>
        </div>

        <button onClick={() => setCurrentPage('landing')} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mt-6 mx-auto">
          <ArrowRight size={16} />
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, setCurrentPage } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAdmin(password)) {
      setError('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">لوحة الإدارة</h2>
          <p className="text-gray-500 mt-2">أدخل كلمة مرور الأدمن</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">كلمة مرور الأدمن</label>
              <div className="relative">
                <div className="input-icon">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input" style={{ paddingLeft: '48px' }} placeholder="••••••••" dir="ltr" />
                  <Lock size={18} />
                </div>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn w-full mt-6" style={{ background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)', color: 'white' }}>
              دخول لوحة الإدارة
            </button>
          </form>
        </div>

        <button onClick={() => setCurrentPage('landing')} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mt-6 mx-auto">
          <ArrowRight size={16} />
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
};

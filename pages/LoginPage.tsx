
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, ShieldAlert, User, Building2, Key } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, language } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
        setError(t('auth.error_user'));
    }
  };

  const fillDemo = (u: string, p: string) => {
    setEmail(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-primary-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
            <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className={`text-center text-3xl font-extrabold text-gray-900 ${language === 'en' ? 'font-sans' : ''}`}>
          {t('auth.login.title')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-bold animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('auth.email')}</label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل البريد أو اسم المستخدم التجريبي"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('auth.password')}</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-0.5"
            >
              {t('auth.submit_login')}
            </button>
          </form>

          {/* Expanded Demo Hints Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs font-black text-amber-600 mb-4 uppercase tracking-widest">
                  <Key className="w-4 h-4" />
                  بيانات الدخول التجريبية (اضغط للملء التلقائي)
              </div>
              
              <div className="grid grid-cols-1 gap-2" dir="ltr">
                  <button 
                    onClick={() => fillDemo('admin', 'admin')}
                    className="flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-colors group"
                  >
                      <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-red-600" />
                          <span className="text-[10px] font-black text-red-900 uppercase">Admin</span>
                      </div>
                      <code className="text-[10px] bg-white px-2 py-0.5 rounded shadow-sm text-red-700">admin / admin</code>
                  </button>

                  <button 
                    onClick={() => fillDemo('seeker', 'seeker')}
                    className="flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors group"
                  >
                      <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-[10px] font-black text-blue-900 uppercase">Seeker</span>
                      </div>
                      <code className="text-[10px] bg-white px-2 py-0.5 rounded shadow-sm text-blue-700">seeker / seeker</code>
                  </button>

                  <button 
                    onClick={() => fillDemo('employer', 'employer')}
                    className="flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl transition-colors group"
                  >
                      <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-[10px] font-black text-emerald-900 uppercase">Employer</span>
                      </div>
                      <code className="text-[10px] bg-white px-2 py-0.5 rounded shadow-sm text-emerald-700">employer / employer</code>
                  </button>
              </div>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-medium">{t('auth.no_account')}</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                {t('auth.create_new')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

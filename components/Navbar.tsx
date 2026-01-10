
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, PlusCircle, User, LogOut, Building2, ShieldCheck, Languages, PenTool, Sparkles, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.RECRUITER: return <Building2 className="w-4 h-4 text-primary-600" />;
      case UserRole.SEEKER: return <User className="w-4 h-4 text-primary-600" />;
      case UserRole.ADMIN: return <ShieldCheck className="w-4 h-4 text-red-600" />;
      case UserRole.SERVICE_PROVIDER: return <Sparkles className="w-4 h-4 text-purple-600" />;
      case UserRole.CONTENT_CREATOR: return <PenTool className="w-4 h-4 text-teal-600" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2" aria-label={t('app.name')}>
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className={`font-bold text-lg md:text-xl text-gray-900 tracking-tight ${language === 'en' ? 'font-sans' : ''}`}>{t('app.name')}</span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
               <Link to="/about" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  <Info className="w-4 h-4" />
                  {t('nav.about')}
               </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Toggle */}
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-colors border border-gray-100"
                aria-label={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            >
                <Languages className="w-4 h-4" />
                <span className="uppercase">{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {user ? (
                <>
                    <Link to="/profile" className="hidden lg:flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors group">
                        {getUserRoleIcon(user.role)}
                        <span className="text-sm font-medium group-hover:text-primary-600 transition-colors">
                            {(user.role === UserRole.RECRUITER || user.role === UserRole.SERVICE_PROVIDER) ? user.companyName : user.name}
                        </span>
                    </Link>
                    
                    {user.role === UserRole.ADMIN && (
                        <Link 
                        to="/admin" 
                        className={`hidden md:flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${
                            isActive('/admin')
                            ? 'bg-red-700 text-white'
                            : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md'
                        }`}
                        >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t('nav.dashboard')}</span>
                        </Link>
                    )}

                    {/* Dynamic Action Buttons based on capabilities */}
                    <div className="hidden md:flex items-center gap-2">
                        {user.role === UserRole.RECRUITER && (
                            <Link 
                            to="/post-job" 
                            className={`flex items-center gap-1 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-bold shadow-sm transition-all ${
                                isActive('/post-job')
                                ? 'bg-primary-700 text-white'
                                : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                            >
                            <PlusCircle className="w-4 h-4" />
                            <span>{t('nav.postJob')}</span>
                            </Link>
                        )}
                        
                        {user.canProvideServices && (
                            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all border border-purple-200">
                                <Sparkles className="w-4 h-4" />
                                <span>أضف خدمة</span>
                            </button>
                        )}

                        {user.canWriteArticles && (
                            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold bg-teal-100 text-teal-700 hover:bg-teal-200 transition-all border border-teal-200">
                                <PenTool className="w-4 h-4" />
                                <span>اكتب مقالاً</span>
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full ml-1"
                        title={t('nav.logout')}
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </>
            ) : (
                <div className="flex items-center gap-2 md:gap-3">
                     <Link 
                        to="/login"
                        className="text-gray-600 hover:text-gray-900 font-medium text-xs md:text-sm px-2 py-1"
                    >
                        {t('nav.login')}
                    </Link>
                    <Link 
                        to="/register"
                        className="bg-gray-900 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        {t('nav.register')}
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

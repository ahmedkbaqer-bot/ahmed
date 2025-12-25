
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, LayoutGrid, User, Sparkles, PenTool } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const MobileNav: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-4 py-3 flex justify-around items-center shadow-[0_-4px_15px_rgba(0,0,0,0.06)] pb-safe rounded-t-2xl">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary-600 scale-110' : 'text-gray-400'} transition-all`}>
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-bold">{t('nav.home')}</span>
      </Link>
      
      {user?.role === UserRole.RECRUITER && (
        <Link to="/post-job" className={`flex flex-col items-center gap-1 ${isActive('/post-job') ? 'text-primary-600 scale-110' : 'text-gray-400'} transition-all`}>
          <PlusCircle className="w-6 h-6" />
          <span className="text-[10px] font-bold">أعلن</span>
        </Link>
      )}

      {user?.canProvideServices && (
        <button className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-600 transition-all">
          <Sparkles className="w-6 h-6" />
          <span className="text-[10px] font-bold">خدماتي</span>
        </button>
      )}

      {user?.canWriteArticles && (
        <button className="flex flex-col items-center gap-1 text-teal-400 hover:text-teal-600 transition-all">
          <PenTool className="w-6 h-6" />
          <span className="text-[10px] font-bold">مقالاتي</span>
        </button>
      )}

      {user?.role === UserRole.ADMIN && (
        <Link to="/admin" className={`flex flex-col items-center gap-1 ${isActive('/admin') ? 'text-primary-600 scale-110' : 'text-gray-400'} transition-all`}>
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] font-bold">الإدارة</span>
        </Link>
      )}

      {!user ? (
        <Link to="/login" className={`flex flex-col items-center gap-1 ${isActive('/login') ? 'text-primary-600' : 'text-gray-400'} transition-all`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">{t('nav.login')}</span>
        </Link>
      ) : (
        <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-primary-600 scale-110' : 'text-gray-400'} transition-all`}>
           <div className={`w-7 h-7 ${isActive('/profile') ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-700'} rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm ring-1 ring-primary-200`}>
              {user.name.charAt(0)}
           </div>
           <span className="text-[10px] font-bold">{t('nav.profile')}</span>
        </Link>
      )}
    </div>
  );
};

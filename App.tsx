
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { HomePage } from './pages/HomePage';
import { PostJobPage } from './pages/PostJobPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ShieldAlert, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { dir, t, language } = useLanguage();

  return (
    <Router>
        <div className={`flex flex-col min-h-screen font-sans bg-gray-50 text-${dir === 'rtl' ? 'right' : 'left'}`} dir={dir}>
        <Navbar />
        
        {/* Urgent Warning Banner */}
        <div className="bg-amber-50 border-y border-amber-100 py-2 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-800 text-[10px] md:text-xs font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>تحذير: جميع المنشورات على الموقع هي مسؤولية ناشرها حصراً. لا يتحمل الموقع أي مسؤولية عن صحة المعلومات.</span>
            </div>
        </div>

        <div className="flex-grow pb-16 md:pb-0">
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/post-job" element={<PostJobPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </div>
        
        <footer className="bg-white border-t py-8 mt-auto hidden md:block">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="text-right">
                        <h4 className="font-bold text-gray-900 mb-2">{t('app.name')}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
                            {t('footer.desc')} المنصة تهدف لتسهيل الوصول للوظائف، لكننا لا نضمن نتائج التوظيف أو صحة العروض.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                        <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-gray-600 leading-relaxed">
                            <span className="font-bold text-gray-900 block mb-1">إخلاء مسؤولية قانوني:</span>
                            جميع الوظائف، الخدمات، والمقالات المنشورة تعبر عن وجهة نظر ناشريها فقط. الموقع يعمل كجسر تواصل ولا يتدخل في عمليات التوظيف أو التدقيق المالي للعروض. يرجى الحذر من أي طلبات دفع أموال مقابل الوظائف.
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-50 text-center text-gray-400 text-[10px] font-medium">
                    <p>© {new Date().getFullYear()} {t('app.name')} - {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
        <MobileNav />
        </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <JobProvider>
          <AppContent />
        </JobProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;

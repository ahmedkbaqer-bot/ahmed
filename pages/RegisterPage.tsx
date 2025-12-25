
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, GOVERNORATES, Sector, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, MapPin, Building2, UserCircle, Sparkles, PenTool, CheckCircle2, Upload, FileText, X } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, language } = useLanguage();
  
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    governorate: '',
    companyName: ''
  });
  
  // CV Upload State
  const [cvData, setCvData] = useState<{name: string, url: string} | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 500KB limit for Firestore document safety (Demo mode)
      if (file.size > 500 * 1024) {
        alert('عذراً، حجم الملف يجب أن يكون أقل من 500 كيلوبايت في النسخة التجريبية.');
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
         setCvData({
           url: reader.result as string,
           name: file.name
         });
         setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCv = () => {
      setCvData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === UserRole.RECRUITER && !formData.companyName) {
        alert(t('auth.alert.fill_all'));
        return;
    }

    const newUser: User = {
      name: formData.name,
      email: formData.email,
      role: role,
      governorate: formData.governorate || undefined, 
      companyName: role === UserRole.RECRUITER ? formData.companyName : undefined,
      cvUrl: cvData?.url,
      cvName: cvData?.name
    };

    await register(newUser);
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-primary-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
            <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className={`text-center text-3xl font-extrabold text-gray-900 ${language === 'en' ? 'font-sans' : ''}`}>
          {t('auth.register.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('auth.register.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>
          
          <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <button
                type="button"
                onClick={() => setRole(UserRole.SEEKER)}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    role === UserRole.SEEKER 
                    ? 'bg-white text-primary-600 shadow-md ring-1 ring-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
            >
                <UserCircle className="w-5 h-5" />
                {t('nav.seeker')}
            </button>
            <button
                type="button"
                onClick={() => setRole(UserRole.RECRUITER)}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    role === UserRole.RECRUITER 
                    ? 'bg-white text-primary-600 shadow-md ring-1 ring-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
            >
                <Building2 className="w-5 h-5" />
                {t('nav.recruiter')}
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {role === UserRole.SEEKER ? t('auth.name') : t('auth.manager_name')}
              </label>
              <input
                name="name"
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {role === UserRole.RECRUITER && (
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('auth.company_name')}</label>
                    <input
                    name="companyName"
                    type="text"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    value={formData.companyName}
                    onChange={handleChange}
                    />
                </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('auth.email')}</label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('auth.password')}</label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('auth.gov_label')}</label>
                <select
                    name="governorate"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                    value={formData.governorate}
                    onChange={handleChange}
                >
                    <option value="">{t('auth.select_gov')}</option>
                    {GOVERNORATES.map(gov => (
                    <option key={gov} value={gov}>{gov}</option>
                    ))}
                </select>
            </div>

            {role === UserRole.SEEKER && (
                <div className="pt-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">السيرة الذاتية (CV)</label>
                    {cvData ? (
                        <div className="bg-green-50 p-3 rounded-xl border border-green-200 flex items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileText className="w-5 h-5 text-green-600 shrink-0" />
                                <span className="text-sm font-bold text-gray-700 truncate">{cvData.name}</span>
                            </div>
                            <button type="button" onClick={removeCv} className="text-red-500 hover:bg-red-50 p-1 rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                    ) : (
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors group">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-primary-500 transition-colors" />
                            <p className="text-xs font-bold text-gray-500 mb-1">اضغط لرفع ملف (PDF)</p>
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <p className="text-[10px] text-gray-400">الحد الأقصى 500 كيلوبايت</p>
                        </div>
                    )}
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isUploading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploading ? 'جاري رفع الملف...' : t('auth.submit_register')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">{t('auth.have_account')} </span>
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
              {t('auth.login_here')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

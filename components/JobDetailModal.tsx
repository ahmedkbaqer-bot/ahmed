
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Building2, Briefcase, Calendar, CheckCircle2, Lock, Globe, ExternalLink, Languages, AlertTriangle } from 'lucide-react';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const { user } = useAuth();
  const { language: globalLanguage } = useLanguage();
  const navigate = useNavigate();
  
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    setLang(globalLanguage);
  }, [globalLanguage, job]);

  if (!job) return null;

  const handleApply = () => {
    if (!user) {
        onClose();
        navigate('/login');
        return;
    }

    if (job.sourceUrl) {
        window.open(job.sourceUrl, '_blank');
    } else {
        const message = lang === 'ar' 
            ? `تم التقديم بنجاح على وظيفة: ${job.title}`
            : `Successfully applied for job: ${job.titleEn || job.title}`;
        alert(message);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        <button 
          onClick={onClose}
          className={`absolute ${lang === 'en' ? 'right-4' : 'left-4'} top-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10`}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-8 pb-4" dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className={`text-2xl font-bold text-gray-900 mb-1 ${lang === 'en' ? 'font-sans' : ''}`}>
                        {lang === 'en' && job.titleEn ? job.titleEn : job.title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            {job.company}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Warning Badge */}
        <div className="px-8 py-2">
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-800 font-bold leading-relaxed">
                    تنبيه: هذا المنشور يقع على عاتق الناشر حصراً. الموقع غير مسؤول عن دقة البيانات أو أي اتفاقات تتم خارج المنصة. لا تدفع أموالاً لأي جهة تدعي توفير وظائف.
                </p>
            </div>
        </div>

        <div className="px-8 py-4 border-t border-b border-gray-100 bg-gray-50/50" dir={lang === 'en' ? 'ltr' : 'rtl'}>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                    <span className="text-xs text-gray-500 block mb-1">{lang === 'ar' ? 'الراتب المتوقع' : 'Expected Salary'}</span>
                    <span className="font-semibold text-green-700">{job.salary}</span>
                </div>
                <div>
                    <span className="text-xs text-gray-500 block mb-1">{lang === 'ar' ? 'المصدر' : 'Source'}</span>
                    <span className="font-medium text-gray-900">{job.source || (lang === 'ar' ? 'مجتمع العمل العراقي' : 'Iraqi Work Community')}</span>
                </div>
             </div>
        </div>

        <div className="p-8 space-y-8" dir={lang === 'en' ? 'ltr' : 'rtl'}>
            <section>
                <h3 className={`text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 ${lang === 'en' ? 'font-sans' : ''}`}>
                    <Briefcase className="w-5 h-5 text-primary-600" />
                    {lang === 'ar' ? 'الوصف الوظيفي' : 'Job Description'}
                </h3>
                <div className={`text-gray-700 leading-relaxed whitespace-pre-line ${lang === 'en' ? 'font-sans text-left' : 'text-right'}`}>
                    {lang === 'ar' ? job.description : (job.descriptionEn || job.description)}
                </div>
            </section>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0 flex justify-end gap-3 rounded-b-2xl">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-200">إغلاق</button>
            <button onClick={handleApply} className="px-6 py-2.5 rounded-xl font-bold bg-primary-600 text-white hover:bg-primary-700 shadow-lg">قدم الآن</button>
        </div>
      </div>
    </div>
  );
};

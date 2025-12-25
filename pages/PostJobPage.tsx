
import React, { useState } from 'react';
import { Sparkles, Loader2, Send, CheckCircle, ShieldAlert, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GOVERNORATES, Sector, JobType, UserRole, Job } from '../types';
import { generateJobDescription } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

export const PostJobPage: React.FC = () => {
  const { user } = useAuth();
  const { addJob } = useJobs();
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.role === UserRole.RECRUITER ? user.companyName : '',
    governorate: user?.governorate || '',
    city: '',
    sector: '',
    type: JobType.FULL_TIME,
    keywords: '',
    description: '',
    salary: '',
    source: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Guard Clause: Only Recruiters (or Admins) can access
  if (!user || (user.role !== UserRole.RECRUITER && user.role !== UserRole.ADMIN)) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
               <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح لك بالدخول</h2>
                    <p className="text-gray-600 mb-6">
                        هذه الصفحة مخصصة فقط لأصحاب العمل والشركات. إذا كنت ترغب بنشر وظيفة، يرجى تسجيل حساب كـ "صاحب عمل".
                    </p>
                    <div className="space-y-3">
                        <Link 
                            to="/register" 
                            className="block w-full bg-primary-600 text-white py-2.5 rounded-lg font-bold hover:bg-primary-700"
                        >
                            تسجيل حساب شركة جديد
                        </Link>
                        <Link 
                            to="/" 
                            className="block w-full text-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-100"
                        >
                            العودة للرئيسية
                        </Link>
                    </div>
               </div>
          </div>
      );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.governorate || !formData.sector) {
      alert('يرجى ملء المسمى الوظيفي، المحافظة، والقطاع قبل استخدام الذكاء الاصطناعي.');
      return;
    }

    setIsGenerating(true);
    const description = await generateJobDescription(
      formData.title,
      formData.sector,
      formData.governorate,
      formData.keywords
    );
    
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new job object
    const newJob: Job = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        company: formData.company || user?.companyName || 'شركة غير معروفة',
        location: formData.governorate,
        city: formData.city,
        sector: formData.sector as Sector,
        type: formData.type as JobType,
        description: formData.description,
        salary: formData.salary || 'غير محدد',
        postedAt: 'الآن',
        requirements: [], 
        views: 0,
        source: formData.source || 'مجتمع العمل العراقي'
    };

    addJob(newJob);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
      return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
              <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">تم نشر الوظيفة بنجاح!</h2>
                  <p className="text-gray-600 mb-8">
                      لقد تم إضافة الوظيفة إلى القائمة ويمكن للباحثين عن عمل رؤيتها الآن.
                  </p>
                  <button 
                    onClick={() => window.location.hash = '#/'}
                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
                  >
                      العودة للرئيسية
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-primary-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">نشر وظيفة جديدة</h1>
            <p className="text-primary-100 mt-2">أدخل تفاصيل الوظيفة واستخدم الذكاء الاصطناعي لكتابة وصف احترافي.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2">المعلومات الأساسية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="مثال: مهندس مدني"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الشركة</label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="مثال: شركة النهرين"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">القطاع</label>
                  <select
                    name="sector"
                    required
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">اختر القطاع</option>
                    {Object.values(Sector).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع الوظيفة</label>
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {Object.values(JobType).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
                  <select
                    name="governorate"
                    required
                    value={formData.governorate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">اختر المحافظة</option>
                    {GOVERNORATES.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المدينة / القضاء</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="مثال: المنصور"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الراتب المتوقع (اختياري)</label>
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="مثال: 1,000,000 د.ع"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Globe className="w-4 h-4 text-gray-400" />
                        مصدر الوظيفة (اختياري)
                      </label>
                      <input
                        type="text"
                        name="source"
                        value={formData.source}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="مثال: لينكد إن، فيسبوك، أو اسم الشركة"
                      />
                  </div>
              </div>
            </div>

            {/* AI Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-bold text-gray-900">الوصف الوظيفي</h3>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 shadow-md shadow-purple-200"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isGenerating ? 'جاري الكتابة...' : 'اكتب بالذكاء الاصطناعي'}
                </button>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <label className="block text-sm font-medium text-purple-900 mb-2">
                  كلمات مفتاحية أو مهارات (لمساعدة الذكاء الاصطناعي)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="مثال: خبرة 3 سنوات، لغة إنجليزية، العمل تحت الضغط..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نص الوصف الوظيفي</label>
                <textarea
                  name="description"
                  required
                  rows={10}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base leading-relaxed"
                  placeholder="سيظهر الوصف الذي تم توليده هنا، ويمكنك تعديله..."
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary-600 text-white font-bold text-lg rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30"
              >
                <Send className="w-5 h-5" />
                نشر الوظيفة الآن
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

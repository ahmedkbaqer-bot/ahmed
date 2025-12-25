
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Filter, Search, MapPin, Briefcase, BellRing, Flame, Clock, Loader2, Megaphone, ArrowLeft, ArrowRight, FileText, GraduationCap, Users, Sparkles, LayoutGrid, ChevronDown, ChevronUp, BookOpen, ArrowUpRight, Building, ExternalLink, Globe, Zap, X, CreditCard, Gift, Share2, Info, Newspaper, PenTool, Plus, CheckCircle2, User as UserIcon } from 'lucide-react';
import { Job, GOVERNORATES, Sector, UserRole, JobType, ServiceItem, Article, SourceItem, ItemStatus } from '../types';
import { JobCard } from '../components/JobCard';
import { JobSkeleton } from '../components/JobSkeleton';
import { JobDetailModal } from '../components/JobDetailModal';
import { ServiceDetailModal } from '../components/ServiceDetailModal';
import { ArticleDetailModal } from '../components/ArticleDetailModal';
import { ArticleCard } from '../components/ArticleCard';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { jobs, services, announcements, articles, siteUsers, addService, addArticle } = useJobs();
  const { t, language } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Forms for Contribution
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  
  const [newService, setNewService] = useState({ 
    title: '', 
    description: '', 
    iconName: 'cv' as any, 
    priceType: 'free' as 'free' | 'paid', 
    price: '',
    priceUnit: 'ساعة'
  });
  
  const [newArticle, setNewArticle] = useState({ 
    title: '', 
    category: 'سوق العمل', 
    excerpt: '', 
    content: '',
    source: '',
    sourceUrl: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false); }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const approvedServices = useMemo(() => services.filter(s => s.status === ItemStatus.APPROVED || !s.status), [services]);
  const approvedArticles = useMemo(() => articles.filter(a => a.status === ItemStatus.APPROVED || !a.status), [articles]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = job.title.toLowerCase().includes(searchLower) || job.company.toLowerCase().includes(searchLower);
      const matchesGov = selectedGovernorate ? job.location === selectedGovernorate : true;
      const matchesSector = selectedSector ? job.sector === selectedSector : true;
      const matchesType = selectedJobType ? job.type === selectedJobType : true;
      return matchesSearch && matchesGov && matchesSector && matchesType;
    });
  }, [searchTerm, selectedGovernorate, selectedSector, selectedJobType, jobs]);

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
        case 'cv': return <FileText className="w-8 h-8 text-blue-600" />;
        case 'training': return <GraduationCap className="w-8 h-8 text-purple-600" />;
        case 'consulting': return <Users className="w-8 h-8 text-green-600" />;
        default: return <Briefcase className="w-8 h-8 text-gray-600" />;
    }
  };

  const getPublisherName = (userId?: string) => {
      if (!userId) return 'المنصة العامة';
      const found = siteUsers.find(u => u.id === userId);
      return found ? found.name : 'مستخدم المنصة';
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return alert('يرجى تسجيل الدخول أولاً');
      addService({
          id: Date.now().toString(),
          ...newService,
          userId: user.id,
          status: ItemStatus.PENDING
      });
      alert('تم إرسال طلبك بنجاح. سيتم مراجعته من قبل الإدارة.');
      setIsServiceModalOpen(false);
      setNewService({ title: '', description: '', iconName: 'cv', priceType: 'free', price: '', priceUnit: 'ساعة' });
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return alert('يرجى تسجيل الدخول أولاً');
      addArticle({
          id: Date.now().toString(),
          ...newArticle,
          author: user.name,
          date: new Date().toISOString().split('T')[0],
          userId: user.id,
          status: ItemStatus.PENDING
      });
      alert('تم إرسال المقال للمراجعة. شكراً لمساهمتك.');
      setIsArticleModalOpen(false);
      setNewArticle({ title: '', category: 'سوق العمل', excerpt: '', content: '', source: '', sourceUrl: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-primary-700 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6">{t('hero.title')}</h1>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
          
          <div className="bg-white p-2 rounded-2xl shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="flex items-center px-4 bg-gray-50 rounded-xl">
                  <Search className="w-5 h-5 text-gray-400 ml-2" />
                  <input type="text" placeholder={t('search.placeholder')} className="w-full py-3 bg-transparent outline-none text-gray-800" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <select className="bg-gray-50 px-4 py-3 rounded-xl text-gray-800 outline-none" value={selectedGovernorate} onChange={(e) => setSelectedGovernorate(e.target.value)}>
                <option value="">{t('filter.all_gov')}</option>
                {GOVERNORATES.map(gov => <option key={gov} value={gov}>{gov}</option>)}
              </select>
              <select className="bg-gray-50 px-4 py-3 rounded-xl text-gray-800 outline-none" value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
                <option value="">{t('filter.all_sec')}</option>
                {Object.values(Sector).map(sector => <option key={sector} value={sector}>{sector}</option>)}
              </select>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-12">
          {/* Section: Contribution CTA */}
          {user && (
            <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                            <Sparkles className="w-6 h-6" /> أنشئ خدمتك الخاصة
                        </h3>
                        <p className="text-purple-100 mb-6 text-sm">هل تمتلك مهارة في كتابة السيرة الذاتية أو التدريب؟ أضف خدمتك هنا لتصل لآلاف الباحثين عن عمل.</p>
                        <button onClick={() => setIsServiceModalOpen(true)} className="bg-white text-purple-700 px-6 py-2.5 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" /> تقديم طلب نشر خدمة
                        </button>
                    </div>
                    <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                            <PenTool className="w-6 h-6" /> شارك خبراتك بمقال
                        </h3>
                        <p className="text-teal-100 mb-6 text-sm">ساهم في تطوير المجتمع المهني العراقي عبر كتابة مقالات تعليمية أو نصائح مهنية.</p>
                        <button onClick={() => setIsArticleModalOpen(true)} className="bg-white text-teal-700 px-6 py-2.5 rounded-xl font-bold hover:bg-teal-50 transition-all flex items-center gap-2">
                            <Plus className="w-5 h-5" /> كتابة مقال جديد
                        </button>
                    </div>
                    <BookOpen className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
                </div>
            </div>
          )}

          {/* Section: Services */}
          <section className="mb-16">
             <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                     <Sparkles className="text-primary-600" /> {t('section.services_title')}
                 </h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {approvedServices.map(service => (
                    <div key={service.id} onClick={() => setSelectedService(service)} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-1.5 h-full ${service.priceType === 'free' ? 'bg-emerald-500' : 'bg-amber-500'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">{renderServiceIcon(service.iconName)}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{service.description}</p>
                        
                        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2">
                            <div className="p-1 bg-gray-100 rounded">
                                <UserIcon className="w-3 h-3 text-gray-400" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">مزود الخدمة: {getPublisherName(service.userId)}</span>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${service.priceType === 'free' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {service.priceType === 'free' ? (language === 'ar' ? 'مجانية' : 'FREE') : (language === 'ar' ? 'مدفوعة' : 'PAID')}
                            </span>
                            {service.priceType === 'paid' && <span className="text-xs font-bold text-gray-400">{service.price} {service.priceUnit && `لكل ${service.priceUnit}`}</span>}
                        </div>
                    </div>
                ))}
             </div>
          </section>

          {/* Jobs Listing */}
          <section className="mb-16">
             <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Briefcase className="text-primary-600" /> {t('section.latest_title')}
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? [...Array(6)].map((_, i) => <JobSkeleton key={i} />) : filteredJobs.map(job => <JobCard key={job.id} job={job} onClick={setSelectedJob} />)}
             </div>
          </section>

          {/* Articles */}
          <section className="mb-16">
               <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                   <BookOpen className="text-primary-600" /> {t('section.articles_title')}
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {approvedArticles.map(article => <ArticleCard key={article.id} article={article} onClick={setSelectedArticle} />)}
               </div>
          </section>
      </main>

      {/* Improved Modal for Service Request */}
      {isServiceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">إضافة خدمة جديدة</h3>
                        <p className="text-gray-500 text-sm mt-1">سيتم مراجعة طلبك لضمان جودة وشفافية المعلومات.</p>
                    </div>
                    <button onClick={() => setIsServiceModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <form onSubmit={handleServiceSubmit} className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase mr-1">عنوان الخدمة</label>
                        <input 
                            type="text" 
                            placeholder="مثال: تدقيق السير الذاتية" 
                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-bold" 
                            value={newService.title} 
                            onChange={e => setNewService({...newService, title: e.target.value})} 
                            required 
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase mr-1">وصف الخدمة</label>
                        <textarea 
                            placeholder="اشرح مهاراتك وما ستقدمه للمستخدم..." 
                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 h-32 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none" 
                            value={newService.description} 
                            onChange={e => setNewService({...newService, description: e.target.value})} 
                            required 
                        />
                      </div>

                      <div className="space-y-4 pt-4 border-t border-dashed border-gray-100">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold text-gray-700 flex-1">نمط التسعير:</label>
                            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                                <button 
                                    type="button" 
                                    onClick={() => setNewService({...newService, priceType: 'free'})}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${newService.priceType === 'free' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                                >
                                    <Gift className="w-3.5 h-3.5" /> مجانية
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setNewService({...newService, priceType: 'paid'})}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${newService.priceType === 'paid' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'}`}
                                >
                                    <CreditCard className="w-3.5 h-3.5" /> مدفوعة
                                </button>
                            </div>
                        </div>

                        {newService.priceType === 'paid' && (
                            <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                                    <p className="text-[10px] text-amber-800 font-bold mb-3 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> تعليمات التسعير: يمكنك اختيار الوحدة الجاهزة أو كتابة وحدة مخصصة إذا كان المكان فارغاً.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <label className="text-[10px] font-black text-amber-600 uppercase mb-1 block">المبلغ (د.ع)</label>
                                            <input 
                                                type="text" 
                                                placeholder="مثال: 15,000" 
                                                className="w-full bg-white p-3 rounded-xl border border-amber-200 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold" 
                                                value={newService.price} 
                                                onChange={e => setNewService({...newService, price: e.target.value})} 
                                                required={newService.priceType === 'paid'}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-[10px] font-black text-amber-600 uppercase mb-1 block">وحدة القياس</label>
                                            <select 
                                                className="w-full bg-white p-3 rounded-xl border border-amber-200 outline-none text-xs font-bold"
                                                value={['ساعة', 'جلسة', 'صفحة'].includes(newService.priceUnit) ? newService.priceUnit : 'custom'}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (val !== 'custom') {
                                                        setNewService({...newService, priceUnit: val});
                                                    } else {
                                                        setNewService({...newService, priceUnit: ''});
                                                    }
                                                }}
                                            >
                                                <option value="ساعة">لكل ساعة</option>
                                                <option value="جلسة">لكل جلسة</option>
                                                <option value="صفحة">لكل صفحة</option>
                                                <option value="custom">أخرى (كتابة مخصصة)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {(!['ساعة', 'جلسة', 'صفحة'].includes(newService.priceUnit) || newService.priceUnit === '') && (
                                        <div className="mt-4 animate-in fade-in duration-300">
                                            <label className="text-[10px] font-black text-amber-600 uppercase mb-1 block">اكتب الوحدة هنا</label>
                                            <input 
                                                type="text" 
                                                placeholder="مثال: ملف، مشروع، زيارة ميدانية..." 
                                                className="w-full bg-white p-3 rounded-xl border border-amber-200 outline-none font-bold" 
                                                value={newService.priceUnit} 
                                                onChange={e => setNewService({...newService, priceUnit: e.target.value})} 
                                                required={newService.priceType === 'paid'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                      </div>

                      <button type="submit" className="w-full py-4 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2">
                          <Plus className="w-5 h-5" /> إرسال الخدمة للمراجعة
                      </button>
                  </form>
              </div>
          </div>
      )}

      {isArticleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-emerald-600"></div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">مشاركة خبراتك بمقال</h3>
                        <p className="text-sm text-gray-500">سيتم مراجعة المقال قبل نشره لضمان دقة وفائدة المحتوى.</p>
                    </div>
                    <button onClick={() => setIsArticleModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                  <form onSubmit={handleArticleSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase">عنوان المقال</label>
                        <input type="text" placeholder="عنوان يشد انتباه القراء..." className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-bold" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} required />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase">مقتطف قصير</label>
                        <input type="text" placeholder="لخص المقال في جملة واحدة..." className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all" value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} required />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-gray-400 uppercase">نص المقال الكامل</label>
                        <textarea placeholder="ابدأ بكتابة أفكارك ومعلوماتك..." className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-100 h-56 outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none leading-relaxed" value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} required />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-dashed border-gray-100">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-gray-400 uppercase">مصدر المعلومات (اختياري)</label>
                          <input type="text" placeholder="مثال: ويكيبيديا، خبر رسمي..." className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-teal-500 transition-all" value={newArticle.source} onChange={e => setNewArticle({...newArticle, source: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-gray-400 uppercase">رابط المصدر (اختياري)</label>
                          <input type="url" placeholder="https://..." className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-teal-500 transition-all" value={newArticle.sourceUrl} onChange={e => setNewArticle({...newArticle, sourceUrl: e.target.value})} />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setIsArticleModalOpen(false)} className="flex-1 py-4 font-black text-gray-500 hover:bg-gray-100 rounded-2xl transition-colors">إلغاء</button>
                          <button type="submit" className="flex-1 py-4 bg-teal-600 text-white font-black rounded-2xl shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all transform hover:-translate-y-1">إرسال للمراجعة</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} />
      <ArticleDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
};

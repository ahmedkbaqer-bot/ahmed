
import React, { useState, useMemo } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  Trash2, Users, FileText, ShieldAlert, Globe, Plus, 
  Sparkles, Briefcase, Layout, Save, Settings, Mail, 
  Facebook, Linkedin, Instagram, Phone, CheckCircle, 
  XCircle, BookOpen, Newspaper, Link as LinkIcon, PlusCircle,
  Eye, User as UserIcon, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, ItemStatus, SiteSettings, SourceItem, Article } from '../types';
import { Link } from 'react-router-dom';

type AdminTab = 'overview' | 'users' | 'requests' | 'sources' | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { 
    jobs, siteUsers, services, articles, siteSettings,
    jobSources, newsSources, addJobSource, deleteJobSource, addNewsSource, deleteNewsSource,
    updateUserRole, deleteUser, deleteService, deleteArticle,
    addArticle, updateSiteSettings
  } = useJobs();
  
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [editSettings, setEditSettings] = useState<SiteSettings>(siteSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Source Forms
  const [newJobSource, setNewJobSource] = useState({ name: '', url: '' });
  const [newNewsSource, setNewNewsSource] = useState({ name: '', url: '' });

  // Admin Quick Article Form
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [adminArticle, setAdminArticle] = useState({ 
    title: '', 
    category: 'سوق العمل', 
    excerpt: '', 
    content: '',
    source: '',
    sourceUrl: ''
  });

  const pendingServices = useMemo(() => services.filter(s => s.status === ItemStatus.PENDING), [services]);
  const pendingArticles = useMemo(() => articles.filter(a => a.status === ItemStatus.PENDING), [articles]);

  if (!user || user.role !== UserRole.ADMIN) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 text-center">
            <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md">
                <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">وصول مرفوض</h2>
                <Link to="/" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold">العودة للرئيسية</Link>
            </div>
        </div>
    );
  }

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSiteSettings(editSettings);
    setTimeout(() => {
        setIsSaving(false);
        alert('تم حفظ التغييرات بنجاح');
    }, 800);
  };

  const handleAddAdminArticle = (e: React.FormEvent) => {
    e.preventDefault();
    addArticle({
        id: Date.now().toString(),
        ...adminArticle,
        author: user.name,
        date: new Date().toISOString().split('T')[0],
        userId: user.id,
        status: ItemStatus.APPROVED
    });
    alert('تم نشر المقال فوراً');
    setIsAddingArticle(false);
    setAdminArticle({ title: '', category: 'سوق العمل', excerpt: '', content: '', source: '', sourceUrl: '' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Layout className="w-6 h-6 text-primary-600" />
                لوحة تحكم الإدارة
            </h1>
            <div className="flex bg-gray-100 p-1 rounded-2xl overflow-x-auto">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'overview' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>نظرة عامة</button>
                <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'users' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>المجتمع</button>
                <button onClick={() => setActiveTab('requests')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'requests' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>الطلبات ({pendingServices.length + pendingArticles.length})</button>
                <button onClick={() => setActiveTab('sources')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'sources' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>المصادر</button>
                <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'settings' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>الإعدادات</button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
          {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-white p-8 rounded-[2rem] border shadow-sm group hover:border-primary-500 transition-colors text-center">
                          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                              <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-gray-500 text-sm mb-1 font-bold">المستخدمين</p>
                          <p className="text-4xl font-black text-gray-900">{siteUsers.length}</p>
                      </div>
                      <div className="bg-white p-8 rounded-[2rem] border shadow-sm group hover:border-primary-500 transition-colors text-center">
                          <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                              <Briefcase className="w-6 h-6 text-emerald-600" />
                          </div>
                          <p className="text-gray-500 text-sm mb-1 font-bold">الوظائف</p>
                          <p className="text-4xl font-black text-gray-900">{jobs.length}</p>
                      </div>
                      <div className="bg-white p-8 rounded-[2rem] border shadow-sm group hover:border-primary-500 transition-colors text-center">
                          <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                              <Sparkles className="w-6 h-6 text-purple-600" />
                          </div>
                          <p className="text-gray-500 text-sm mb-1 font-bold">الخدمات</p>
                          <p className="text-4xl font-black text-gray-900">{services.length}</p>
                      </div>
                      <div className="bg-white p-8 rounded-[2rem] border shadow-sm group hover:border-primary-500 transition-colors text-center">
                          <div className="bg-teal-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                              <BookOpen className="w-6 h-6 text-teal-600" />
                          </div>
                          <p className="text-gray-500 text-sm mb-1 font-bold">المقالات</p>
                          <p className="text-4xl font-black text-gray-900">{articles.length}</p>
                      </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-right">
                            <h2 className="text-2xl font-black mb-2">النشر المباشر للمدير</h2>
                            <p className="text-gray-400">يمكنك نشر مقالات رسمية تظهر لجميع المستخدمين فوراً</p>
                        </div>
                        <button onClick={() => setIsAddingArticle(true)} className="bg-primary-600 hover:bg-primary-700 px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-primary-500/20">
                            <PlusCircle className="w-6 h-6" /> نشر مقال إداري
                        </button>
                      </div>
                  </div>

                  {isAddingArticle && (
                      <div className="bg-white border rounded-[2rem] p-8 shadow-xl animate-in zoom-in-95 duration-300">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black">إضافة مقال رسمي جديد</h3>
                            <button onClick={() => setIsAddingArticle(false)} className="text-gray-400 hover:text-gray-600 p-2"><XCircle className="w-8 h-8" /></button>
                          </div>
                          <form onSubmit={handleAddAdminArticle} className="space-y-6">
                              <input type="text" placeholder="عنوان المقال" className="w-full bg-gray-50 p-4 rounded-2xl border outline-none text-lg font-bold" value={adminArticle.title} onChange={e => setAdminArticle({...adminArticle, title: e.target.value})} required />
                              <textarea placeholder="مقتطف المقال (يظهر في القائمة الرئيسية)..." className="w-full bg-gray-50 p-4 rounded-2xl border outline-none h-24" value={adminArticle.excerpt} onChange={e => setAdminArticle({...adminArticle, excerpt: e.target.value})} required />
                              <textarea placeholder="المحتوى الكامل للمقال..." className="w-full bg-gray-50 p-4 rounded-2xl border outline-none h-64" value={adminArticle.content} onChange={e => setAdminArticle({...adminArticle, content: e.target.value})} required />
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">اسم المصدر (اختياري)</label>
                                  <input type="text" placeholder="مثال: مجلس الخدمة الاتحادي" className="w-full bg-gray-50 p-4 rounded-xl border outline-none" value={adminArticle.source} onChange={e => setAdminArticle({...adminArticle, source: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">رابط المصدر (اختياري)</label>
                                  <input type="url" placeholder="https://..." className="w-full bg-gray-50 p-4 rounded-xl border outline-none" value={adminArticle.sourceUrl} onChange={e => setAdminArticle({...adminArticle, sourceUrl: e.target.value})} />
                                </div>
                              </div>

                              <button type="submit" className="w-full py-5 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 text-lg">نشر المقال الآن فوراً</button>
                          </form>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'sources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white rounded-[2rem] p-8 border shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                        <Briefcase className="w-8 h-8 text-primary-600" />
                        <h3 className="text-xl font-black">إدارة مصادر الوظائف</h3>
                      </div>
                      <div className="flex flex-col gap-3 mb-8">
                          <input type="text" placeholder="اسم المصدر الرسمي" className="w-full bg-gray-50 p-4 rounded-xl border outline-none font-bold" value={newJobSource.name} onChange={e => setNewJobSource({...newJobSource, name: e.target.value})} />
                          <input type="url" placeholder="الرابط (LinkedIn, Web, etc)" className="w-full bg-gray-50 p-4 rounded-xl border outline-none" value={newJobSource.url} onChange={e => setNewJobSource({...newJobSource, url: e.target.value})} />
                          <button onClick={() => { addJobSource({id: Date.now().toString(), ...newJobSource}); setNewJobSource({name:'', url:''}); }} className="w-full bg-primary-600 text-white py-4 rounded-xl font-black shadow-lg">إضافة مصدر وظائف</button>
                      </div>
                      <div className="space-y-4">
                          {jobSources.map(s => (
                              <div key={s.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary-200 transition-colors">
                                  <div className="flex items-center gap-3 overflow-hidden">
                                      <Globe className="w-5 h-5 text-blue-500 shrink-0" />
                                      <div className="truncate">
                                        <p className="font-bold text-gray-900">{s.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{s.url}</p>
                                      </div>
                                  </div>
                                  <button onClick={() => deleteJobSource(s.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="bg-white rounded-[2rem] p-8 border shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                        <Newspaper className="w-8 h-8 text-orange-600" />
                        <h3 className="text-xl font-black">إدارة مصادر الأخبار</h3>
                      </div>
                      <div className="flex flex-col gap-3 mb-8">
                          <input type="text" placeholder="اسم الوكالة أو المصدر" className="w-full bg-gray-50 p-4 rounded-xl border outline-none font-bold" value={newNewsSource.name} onChange={e => setNewNewsSource({...newNewsSource, name: e.target.value})} />
                          <input type="url" placeholder="الرابط الرسمي للأخبار" className="w-full bg-gray-50 p-4 rounded-xl border outline-none" value={newNewsSource.url} onChange={e => setNewNewsSource({...newNewsSource, url: e.target.value})} />
                          <button onClick={() => { addNewsSource({id: Date.now().toString(), ...newNewsSource}); setNewNewsSource({name:'', url:''}); }} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black shadow-lg">إضافة مصدر أخبار</button>
                      </div>
                      <div className="space-y-4">
                          {newsSources.map(s => (
                              <div key={s.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
                                  <div className="flex items-center gap-3 overflow-hidden">
                                      <LinkIcon className="w-5 h-5 text-orange-500 shrink-0" />
                                      <div className="truncate">
                                        <p className="font-bold text-gray-900">{s.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{s.url}</p>
                                      </div>
                                  </div>
                                  <button onClick={() => deleteNewsSource(s.id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'requests' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                          <Sparkles className="w-7 h-7 text-purple-600" /> طلبات نشر الخدمات
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                          {pendingServices.length === 0 ? <div className="text-gray-400 text-center py-16 bg-gray-50 rounded-[2rem] border-4 border-dashed font-bold">لا يوجد طلبات خدمات حالياً</div> : pendingServices.map(s => (
                              <div key={s.id} className="p-6 bg-white rounded-3xl border-2 border-gray-50 flex items-center justify-between hover:border-purple-200 transition-colors">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                          <UserIcon className="w-6 h-6" />
                                      </div>
                                      <div>
                                          <h4 className="font-black text-lg text-gray-900">{s.title}</h4>
                                          <p className="text-sm text-gray-500 mb-2">{s.description}</p>
                                          <div className="flex items-center gap-4">
                                              <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-1 rounded">الناشر: {siteUsers.find(u => u.id === s.userId)?.name || 'غير معروف'}</span>
                                              <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-1 rounded">السعر: {s.price || 'مجاني'}</span>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex gap-3">
                                      <button onClick={() => deleteService(s.id)} className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-gray-100"><XCircle className="w-6 h-6" /></button>
                                      <button onClick={() => alert('تمت الموافقة')} className="w-12 h-12 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all border border-gray-100"><CheckCircle className="w-6 h-6" /></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                      <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                          <BookOpen className="w-7 h-7 text-teal-600" /> مراجعة المقالات المرسلة
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                          {pendingArticles.length === 0 ? <div className="text-gray-400 text-center py-16 bg-gray-50 rounded-[2rem] border-4 border-dashed font-bold">لا توجد مقالات للمراجعة</div> : pendingArticles.map(a => (
                              <div key={a.id} className="p-6 bg-white rounded-3xl border-2 border-gray-50 flex items-center justify-between hover:border-teal-200 transition-colors">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                                          <FileText className="w-6 h-6" />
                                      </div>
                                      <div>
                                          <h4 className="font-black text-lg text-gray-900">{a.title}</h4>
                                          <p className="text-xs text-gray-500 font-bold mb-1">الكاتب: {a.author} {a.source && ` | المصدر: ${a.source}`}</p>
                                          <p className="text-sm text-gray-400 line-clamp-1">{a.excerpt}</p>
                                      </div>
                                  </div>
                                  <div className="flex gap-3">
                                      <button onClick={() => deleteArticle(a.id)} className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-gray-100"><XCircle className="w-6 h-6" /></button>
                                      <button onClick={() => alert('تمت الموافقة ونشر المقال')} className="w-12 h-12 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all border border-gray-100"><CheckCircle className="w-6 h-6" /></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'users' && (
              <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="px-8 py-6 bg-gray-50 border-b flex items-center justify-between">
                      <h3 className="text-xl font-black text-gray-900">إدارة المجتمع</h3>
                      <div className="relative">
                          <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="text" placeholder="بحث عن مستخدم..." className="bg-white border-2 border-gray-100 rounded-2xl pr-12 pl-6 py-3 text-sm outline-none focus:border-primary-500 w-80 transition-all" />
                      </div>
                  </div>
                  <table className="w-full text-right">
                      <thead className="bg-gray-50 font-black text-gray-400 uppercase tracking-tighter text-xs border-b">
                          <tr>
                              <th className="px-8 py-5">المستخدم</th>
                              <th className="px-8 py-5">البريد الإلكتروني</th>
                              <th className="px-8 py-5">الرتبة</th>
                              <th className="px-8 py-5 text-center">إجراءات</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {siteUsers.map(u => (
                              <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                                  <td className="px-8 py-5">
                                      <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center font-black text-primary-700">
                                              {u.name.charAt(0)}
                                          </div>
                                          <span className="font-bold text-gray-900">{u.name}</span>
                                      </div>
                                  </td>
                                  <td className="px-8 py-5 text-gray-500 font-medium">{u.email}</td>
                                  <td className="px-8 py-5">
                                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${u.role === UserRole.ADMIN ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                          {u.role}
                                      </span>
                                  </td>
                                  <td className="px-8 py-5 text-center">
                                      <button onClick={() => deleteUser(u.id!)} className="text-gray-300 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-2xl group-hover:text-red-400"><Trash2 className="w-5 h-5" /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}

          {activeTab === 'settings' && (
              <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 mb-10">
                      <div className="bg-primary-50 p-4 rounded-3xl">
                          <Settings className="w-8 h-8 text-primary-600" />
                      </div>
                      <div>
                          <h2 className="text-3xl font-black text-gray-900">إعدادات المنصة</h2>
                          <p className="text-gray-500 font-medium">تعديل المعلومات العامة، قنوات التواصل، والسياسات</p>
                      </div>
                  </div>

                  <form onSubmit={handleSettingsSave} className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-3">
                              <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">الوصف العام (About Us)</label>
                              <textarea 
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-6 min-h-[160px] focus:border-primary-500 outline-none transition-all font-medium leading-relaxed"
                                value={editSettings.aboutDescription}
                                onChange={e => setEditSettings({...editSettings, aboutDescription: e.target.value})}
                              />
                          </div>
                          <div className="space-y-3">
                              <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">رسالة المنصة (Mission)</label>
                              <textarea 
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-6 min-h-[160px] focus:border-primary-500 outline-none transition-all font-medium leading-relaxed"
                                value={editSettings.mission}
                                onChange={e => setEditSettings({...editSettings, mission: e.target.value})}
                              />
                          </div>
                          <div className="space-y-3">
                              <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">رؤية المنصة (Vision)</label>
                              <textarea 
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-6 min-h-[160px] focus:border-primary-500 outline-none transition-all font-medium leading-relaxed"
                                value={editSettings.vision}
                                onChange={e => setEditSettings({...editSettings, vision: e.target.value})}
                              />
                          </div>
                          <div className="space-y-3">
                              <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">كلمة الفريق</label>
                              <textarea 
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] p-6 min-h-[160px] focus:border-primary-500 outline-none transition-all font-medium leading-relaxed"
                                value={editSettings.teamDescription}
                                onChange={e => setEditSettings({...editSettings, teamDescription: e.target.value})}
                              />
                          </div>
                      </div>

                      <div className="pt-10 border-t-2 border-gray-50">
                          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                              <Globe className="w-7 h-7 text-blue-600" /> قنوات التواصل الاجتماعي والبريد
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-xs font-black text-gray-400 tracking-widest uppercase">
                                      <Mail className="w-4 h-4" /> البريد الرسمي
                                  </label>
                                  <input 
                                    type="email" 
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none font-bold"
                                    value={editSettings.contactEmail}
                                    onChange={e => setEditSettings({...editSettings, contactEmail: e.target.value})}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-xs font-black text-gray-400 tracking-widest uppercase">
                                      <Facebook className="w-4 h-4" /> رابط Facebook
                                  </label>
                                  <input 
                                    type="url" 
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none font-bold"
                                    value={editSettings.facebookUrl}
                                    onChange={e => setEditSettings({...editSettings, facebookUrl: e.target.value})}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-xs font-black text-gray-400 tracking-widest uppercase">
                                      <Linkedin className="w-4 h-4" /> رابط LinkedIn
                                  </label>
                                  <input 
                                    type="url" 
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none font-bold"
                                    value={editSettings.linkedInUrl}
                                    onChange={e => setEditSettings({...editSettings, linkedInUrl: e.target.value})}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-xs font-black text-gray-400 tracking-widest uppercase">
                                      <Instagram className="w-4 h-4" /> رابط Instagram
                                  </label>
                                  <input 
                                    type="url" 
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none font-bold"
                                    value={editSettings.instagramUrl}
                                    onChange={e => setEditSettings({...editSettings, instagramUrl: e.target.value})}
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-xs font-black text-gray-400 tracking-widest uppercase">
                                      <Phone className="w-4 h-4" /> واتساب التواصل
                                  </label>
                                  <input 
                                    type="text" 
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary-500 outline-none font-bold"
                                    value={editSettings.whatsappNumber}
                                    onChange={e => setEditSettings({...editSettings, whatsappNumber: e.target.value})}
                                    placeholder="+964..."
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="pt-10">
                          <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full py-6 bg-primary-600 text-white font-black rounded-3xl shadow-2xl shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-xl"
                          >
                              {isSaving ? <Loader2 className="w-7 h-7 animate-spin" /> : <Save className="w-7 h-7" />}
                              {isSaving ? 'جاري الحفظ والرفع...' : 'حفظ جميع تعديلات المنصة'}
                          </button>
                      </div>
                  </form>
              </div>
          )}
      </main>
    </div>
  );
};

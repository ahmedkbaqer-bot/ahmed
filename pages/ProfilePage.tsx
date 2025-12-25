
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, Experience, Education, Sector, GOVERNORATES } from '../types';
import { 
  User, Briefcase, GraduationCap, Mail, Phone, MapPin, 
  Globe, Plus, Trash2, Save, Edit3, X, CheckCircle2,
  Building2, Camera, Link as LinkIcon, Sparkles, FileText, Upload, Download, Eye, ImagePlus
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for editing to avoid constant context updates
  const [editData, setEditData] = useState(user || {} as any);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-12 rounded-[2.5rem] shadow-xl max-w-md w-full border">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-4">يرجى تسجيل الدخول</h2>
          <p className="text-gray-500 mb-8">يجب عليك تسجيل الدخول لتتمكن من إنشاء وإدارة ملفك الشخصي.</p>
          <button onClick={() => window.location.hash = '#/login'} className="w-full py-4 bg-primary-600 text-white font-black rounded-2xl">تسجيل الدخول</button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile(editData);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 500 * 1024) {
            alert('حجم الصورة كبير جداً. يرجى استخدام صورة أقل من 500 كيلوبايت.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditData({ ...editData, profileImage: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
      fileInputRef.current?.click();
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('حجم الملف كبير جداً. يجب أن يكون أقل من 500 كيلوبايت لضمان الحفظ.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
         setEditData({
           ...editData,
           cvUrl: reader.result as string,
           cvName: file.name
         });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCv = () => {
    setEditData({
      ...editData,
      cvUrl: undefined,
      cvName: undefined
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      title: '',
      startDate: '',
      current: false,
      description: ''
    };
    setEditData({ ...editData, experience: [...(editData.experience || []), newExp] });
  };

  const removeExperience = (id: string) => {
    setEditData({ ...editData, experience: editData.experience?.filter((e: any) => e.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      year: ''
    };
    setEditData({ ...editData, education: [...(editData.education || []), newEdu] });
  };

  const removeEducation = (id: string) => {
    setEditData({ ...editData, education: editData.education?.filter((e: any) => e.id !== id) });
  };

  const isSeeker = user.role === UserRole.SEEKER;

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-20 font-sans">
      {/* Profile Header Background (LinkedIn style banner) */}
      <div className="h-48 md:h-56 bg-gradient-to-r from-primary-700 to-primary-900 relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 -mt-20">
          
          {/* Main Column (Left/Center) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* 1. Main Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
              <div className="p-6 md:p-8 pt-0">
                <div className="flex justify-between items-start">
                  <div className="relative -mt-16 mb-4 group">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-1.5 shadow-md relative">
                        <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                            {editData.profileImage ? (
                                <img src={editData.profileImage} alt={editData.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-gray-300" />
                            )}
                        </div>
                        {isEditing && (
                            <button 
                                onClick={triggerImageUpload}
                                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="w-8 h-8 text-white" />
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </button>
                        )}
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <button onClick={() => { setIsEditing(true); setEditData(user); }} className="mt-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <Edit3 className="w-6 h-6" />
                    </button>
                  ) : (
                    <div className="mt-4 flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4 py-2">إلغاء</button>
                        <button onClick={handleSave} disabled={isSaving} className="bg-primary-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-primary-700 shadow-sm">{isSaving ? 'حفظ...' : 'حفظ'}</button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500" value={isSeeker ? editData.name : editData.companyName} onChange={e => isSeeker ? setEditData({...editData, name: e.target.value}) : setEditData({...editData, companyName: e.target.value})} placeholder="الاسم الكامل" />
                            <select className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500" value={editData.governorate} onChange={e => setEditData({...editData, governorate: e.target.value})}>
                                <option value="">اختر المحافظة</option>
                                {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <input className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500" value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} placeholder="العنوان الوظيفي / نبذة مختصرة (Headline)" />
                    </div>
                ) : (
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            {isSeeker ? user.name : user.companyName}
                            {user.role === UserRole.RECRUITER && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                        </h1>
                        <p className="text-lg text-gray-600 mt-1 font-medium">{user.bio || (isSeeker ? 'باحث عن عمل' : 'شركة توظيف')}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">{user.governorate || 'العراق'}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="text-primary-600 font-bold hover:underline cursor-pointer">معلومات الاتصال</span>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button className="bg-primary-600 text-white px-6 py-1.5 rounded-full font-bold text-sm hover:bg-primary-700 transition-colors">
                                {isSeeker ? 'متاح للعمل' : 'وظائفنا'}
                            </button>
                            <button className="border border-primary-600 text-primary-600 px-6 py-1.5 rounded-full font-bold text-sm hover:bg-primary-50 transition-colors">
                                مشاركة الملف
                            </button>
                        </div>
                    </div>
                )}
              </div>
            </div>

            {/* 2. About Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">نبذة عني</h3>
                    {isEditing && <Edit3 className="w-5 h-5 text-gray-400" />}
                </div>
                {isEditing ? (
                    <textarea 
                        className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 h-32 resize-none"
                        value={editData.bio}
                        onChange={e => setEditData({...editData, bio: e.target.value})}
                        placeholder="اكتب نبذة احترافية عن خبراتك ومهاراتك..."
                    />
                ) : (
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        {user.bio || 'لا توجد نبذة مضافة حالياً.'}
                    </p>
                )}
            </div>

            {/* 3. Experience Section */}
            {isSeeker && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">الخبرة العملية</h3>
                        {isEditing && (
                            <button onClick={addExperience} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Plus className="w-6 h-6 text-gray-600" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-8">
                        {(!editData.experience || editData.experience.length === 0) && (
                            <p className="text-gray-400 text-sm italic">لم تتم إضافة خبرات عملية بعد.</p>
                        )}

                        {isEditing ? (
                            <div className="space-y-6">
                                {editData.experience?.map((exp: any, index: number) => (
                                    <div key={exp.id} className="p-6 bg-gray-50 rounded-xl border relative">
                                        <button onClick={() => removeExperience(exp.id)} className="absolute top-4 left-4 text-red-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                                        <div className="grid grid-cols-1 gap-4">
                                            <input placeholder="المسمى الوظيفي" className="p-2 border rounded" value={exp.title} onChange={e => { const next = [...editData.experience]; next[index].title = e.target.value; setEditData({...editData, experience: next}); }} />
                                            <input placeholder="اسم الشركة" className="p-2 border rounded" value={exp.company} onChange={e => { const next = [...editData.experience]; next[index].company = e.target.value; setEditData({...editData, experience: next}); }} />
                                            <div className="flex gap-2">
                                                <input placeholder="تاريخ البدء" className="p-2 border rounded w-1/2" value={exp.startDate} onChange={e => { const next = [...editData.experience]; next[index].startDate = e.target.value; setEditData({...editData, experience: next}); }} />
                                                <input placeholder="تاريخ الانتهاء" className="p-2 border rounded w-1/2" value={exp.endDate} onChange={e => { const next = [...editData.experience]; next[index].endDate = e.target.value; setEditData({...editData, experience: next}); }} />
                                            </div>
                                            <textarea placeholder="وصف المهام..." className="p-2 border rounded h-20" value={exp.description} onChange={e => { const next = [...editData.experience]; next[index].description = e.target.value; setEditData({...editData, experience: next}); }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {user.experience?.map((exp, index) => (
                                    <div key={exp.id} className="flex gap-4 group">
                                        <div className="mt-1">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                                            <p className="text-sm font-medium text-gray-700">{exp.company}</p>
                                            <p className="text-xs text-gray-500 mt-1 mb-2">
                                                {exp.startDate} - {exp.current ? 'الآن' : exp.endDate}
                                            </p>
                                            <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                                            {index < (user.experience?.length || 0) - 1 && <div className="border-b border-gray-100 mt-6"></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 4. Education Section */}
            {isSeeker && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">التعليم</h3>
                        {isEditing && (
                            <button onClick={addEducation} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Plus className="w-6 h-6 text-gray-600" />
                            </button>
                        )}
                    </div>

                    <div className="space-y-8">
                        {(!editData.education || editData.education.length === 0) && (
                            <p className="text-gray-400 text-sm italic">لم تتم إضافة مؤهلات تعليمية بعد.</p>
                        )}

                        {isEditing ? (
                            <div className="space-y-6">
                                {editData.education?.map((edu: any, index: number) => (
                                    <div key={edu.id} className="p-6 bg-gray-50 rounded-xl border relative">
                                        <button onClick={() => removeEducation(edu.id)} className="absolute top-4 left-4 text-red-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                                        <div className="grid grid-cols-1 gap-4">
                                            <input placeholder="الجامعة / المؤسسة" className="p-2 border rounded" value={edu.school} onChange={e => { const next = [...editData.education]; next[index].school = e.target.value; setEditData({...editData, education: next}); }} />
                                            <input placeholder="الدرجة العلمية" className="p-2 border rounded" value={edu.degree} onChange={e => { const next = [...editData.education]; next[index].degree = e.target.value; setEditData({...editData, education: next}); }} />
                                            <input placeholder="مجال الدراسة" className="p-2 border rounded" value={edu.field} onChange={e => { const next = [...editData.education]; next[index].field = e.target.value; setEditData({...editData, education: next}); }} />
                                            <input placeholder="سنة التخرج" className="p-2 border rounded" value={edu.year} onChange={e => { const next = [...editData.education]; next[index].year = e.target.value; setEditData({...editData, education: next}); }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {user.education?.map((edu, index) => (
                                    <div key={edu.id} className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{edu.school}</h4>
                                            <p className="text-sm font-medium text-gray-700">{edu.degree} في {edu.field}</p>
                                            <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                                            {index < (user.education?.length || 0) - 1 && <div className="border-b border-gray-100 mt-6"></div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 5. Skills Section */}
            {isSeeker && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">المهارات</h3>
                        {isEditing && <Edit3 className="w-5 h-5 text-gray-400" />}
                    </div>
                    
                    {isEditing ? (
                        <div>
                            <label className="text-xs text-gray-500 block mb-2">أدخل المهارات مفصولة بفاصلة</label>
                            <input 
                                className="w-full p-4 border rounded-xl outline-none"
                                value={editData.skills?.join(', ') || ''}
                                onChange={e => setEditData({...editData, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                                placeholder="React, Marketing, Excel..."
                            />
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {user.skills && user.skills.length > 0 ? user.skills.map((skill, i) => (
                                <div key={i} className="px-4 py-2.5 bg-white border border-gray-300 rounded-full font-bold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors shadow-sm text-sm">
                                    {skill}
                                </div>
                            )) : (
                                <p className="text-gray-400 text-sm">لا توجد مهارات مضافة.</p>
                            )}
                        </div>
                    )}
                </div>
            )}

          </div>

          {/* Sidebar (Right/Left) */}
          <div className="space-y-6">
             {/* CV / Resume Section - Enhanced for Upload in Profile */}
             {isSeeker && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-600" /> السيرة الذاتية (CV)
                    </h3>
                    
                    {/* Always allow upload/update in Edit Mode */}
                    {isEditing ? (
                        <div className="space-y-4">
                             {editData.cvName ? (
                                 <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex items-center justify-between">
                                     <div className="flex items-center gap-2 overflow-hidden">
                                         <FileText className="w-5 h-5 text-primary-600 shrink-0" />
                                         <span className="text-sm font-bold text-gray-700 truncate">{editData.cvName}</span>
                                     </div>
                                     <button onClick={removeCv} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                 </div>
                             ) : (
                                 <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                     <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-primary-500 transition-colors" />
                                     <p className="text-xs font-bold text-gray-500 mb-2">اضغط لرفع ملف (PDF)</p>
                                     <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                     <p className="text-[10px] text-gray-400">الحد الأقصى 500 كيلوبايت</p>
                                 </div>
                             )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {user.cvUrl ? (
                                <a 
                                  href={user.cvUrl} 
                                  download={user.cvName || 'resume.pdf'}
                                  className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" /> تحميل السيرة الذاتية
                                </a>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center">
                                    <FileText className="w-8 h-8 text-gray-300 mb-2" />
                                    <p className="text-xs text-gray-400 font-bold mb-2">لم يتم رفع سيرة ذاتية بعد</p>
                                    <button onClick={() => setIsEditing(true)} className="text-primary-600 text-xs font-bold hover:underline">اضغط لتعديل الملف وإضافة CV</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
             )}

             {/* Contact Info Card */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">معلومات التواصل</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="truncate" dir="ltr">{user.email}</span>
                    </div>
                    
                    {isEditing ? (
                        <>
                            <input className="w-full p-2 border rounded text-sm" placeholder="رقم الهاتف" value={editData.phone || ''} onChange={e => setEditData({...editData, phone: e.target.value})} />
                            <input className="w-full p-2 border rounded text-sm" placeholder="الموقع / الرابط" value={editData.website || ''} onChange={e => setEditData({...editData, website: e.target.value})} />
                        </>
                    ) : (
                        <>
                            {user.phone && (
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <span dir="ltr">{user.phone}</span>
                                </div>
                            )}
                            {user.website && (
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                    <a href={user.website} target="_blank" className="text-primary-600 hover:underline truncate">{user.website.replace('https://', '')}</a>
                                </div>
                            )}
                        </>
                    )}
                </div>
             </div>

             {/* Profile Strength / Public View hint */}
             {!isEditing && (
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-700 text-sm">قوة الملف الشخصي</span>
                        <span className="text-primary-600 font-bold text-sm">
                            {calculateProfileStrength(user)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                        <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${calculateProfileStrength(user)}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                        كلما زادت المعلومات، زادت فرصك في الظهور لأصحاب العمل.
                    </p>
                 </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper to calculate strength
const calculateProfileStrength = (user: any) => {
    let score = 20; // Base
    if (user.bio) score += 10;
    if (user.phone) score += 10;
    if (user.experience?.length > 0) score += 20;
    if (user.education?.length > 0) score += 20;
    if (user.skills?.length > 0) score += 10;
    if (user.cvUrl) score += 10;
    if (user.profileImage) score += 10; // Bonus for image
    return Math.min(score, 100);
};


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<string, { ar: string; en: string }> = {
  // Navbar
  'app.name': { ar: 'مجتمع العمل العراقي', en: 'Iraqi Work Environment' },
  'nav.login': { ar: 'دخول', en: 'Login' },
  'nav.register': { ar: 'تسجيل جديد', en: 'Register' },
  'nav.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
  'nav.postJob': { ar: 'أعلن عن وظيفة', en: 'Post a Job' },
  'nav.logout': { ar: 'تسجيل الخروج', en: 'Logout' },
  'nav.seeker': { ar: 'باحث عن عمل', en: 'Job Seeker' },
  'nav.recruiter': { ar: 'صاحب عمل', en: 'Employer' },
  'nav.service_provider': { ar: 'ناشر خدمة', en: 'Service Provider' },
  'nav.content_creator': { ar: 'كاتب', en: 'Writer' },
  'nav.admin': { ar: 'مدير', en: 'Admin' },
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.profile': { ar: 'ملفي', en: 'My Profile' },
  'nav.about': { ar: 'عن المنصة', en: 'About Us' },

  // AI Search
  'search.ai_button': { ar: 'بحث حي بالذكاء الاصطناعي', en: 'AI Live Search' },
  'search.ai_loading': { ar: 'جاري البحث في الويب العراقي...', en: 'Searching the Iraqi web...' },
  'search.ai_title': { ar: 'نتائج البحث المباشر (عبر جوجل)', en: 'Live Search Results (via Google)' },
  'search.ai_sources': { ar: 'المصادر والتقديم المباشر:', en: 'Sources & Direct Application:' },
  'search.ai_visit': { ar: 'زيارة الرابط', en: 'Visit Link' },

  // Auth & Forms
  'auth.login.title': { ar: 'تسجيل الدخول', en: 'Login' },
  'auth.register.title': { ar: 'إنشاء حساب جديد', en: 'Create New Account' },
  'auth.register.subtitle': { ar: 'اختر نوع الحساب الذي يناسبك', en: 'Choose the account type that suits you' },
  'auth.email': { ar: 'البريد الإلكتروني', en: 'Email Address' },
  'auth.password': { ar: 'كلمة المرور', en: 'Password' },
  'auth.submit_login': { ar: 'دخول', en: 'Sign In' },
  'auth.submit_register': { ar: 'إنشاء الحساب', en: 'Create Account' },
  'auth.no_account': { ar: 'ليس لديك حساب؟', en: "Don't have an account?" },
  'auth.have_account': { ar: 'لديك حساب بالفعل؟', en: 'Already have an account?' },
  'auth.create_new': { ar: 'إنشاء حساب جديد', en: 'Create new account' },
  'auth.login_here': { ar: 'تسجيل الدخول هنا', en: 'Login here' },
  'auth.name': { ar: 'الاسم الكامل', en: 'Full Name' },
  'auth.manager_name': { ar: 'اسم المسؤول', en: 'Manager Name' },
  'auth.company_name': { ar: 'اسم الشركة / المؤسسة', en: 'Company / Institution Name' },
  'auth.agency_name': { ar: 'اسم الوكالة / المكتب', en: 'Agency / Office Name' },
  'auth.service_name': { ar: 'المسمى الوظيفي / الخدمة', en: 'Job Title / Service' },
  'auth.service_type_label': { ar: 'نوع الحساب', en: 'Account Type' },
  'auth.personal': { ar: 'شخصي (مستقل)', en: 'Personal (Freelancer)' },
  'auth.agency_owner': { ar: 'صاحب وكالة', en: 'Agency Owner' },
  'auth.gov_label': { ar: 'المدينة / المحافظة', en: 'City / Governorate' },
  'auth.hq_label': { ar: 'مقر العمل الرئيسي', en: 'Headquarters' },
  'auth.select_gov': { ar: 'اختر المحافظة', en: 'Select Governorate' },
  'auth.preferences': { ar: 'تفضيلات الحساب', en: 'Account Preferences' },
  'auth.location_details': { ar: 'تفاصيل الموقع', en: 'Location Details' },
  'auth.admin_hint': { ar: 'بيانات تجريبية للمدير:', en: 'Demo Admin Credentials:' },
  'auth.error_admin': { ar: 'كلمة المرور غير صحيحة لحساب المدير.', en: 'Incorrect password for admin account.' },
  'auth.error_user': { ar: 'لم يتم العثور على حساب بهذا البريد. يرجى التسجيل أولاً.', en: 'No account found with this email. Please register first.' },
  'auth.alert.fill_all': { ar: 'يرجى ملء جميع الحقول المطلوبة', en: 'Please fill all required fields' },
  
  'auth.opt_in_title': { ar: 'صلاحيات إدامية (اختياري)', en: 'Additional Capabilities (Optional)' },
  'auth.opt_in_services': { ar: 'أرغب في تقديم خدمات مهنية (تصميم، تدريب، إلخ)', en: 'I want to offer professional services (Design, Training, etc)' },
  'auth.opt_in_articles': { ar: 'أرغب في كتابة مقالات تعليمية وإرشادية', en: 'I want to write educational and guidance articles' },

  // Hero Section
  'hero.title': { ar: 'ابحث عن وظيفة أحلامك في العراق', en: 'Find Your Dream Job in Iraq' },
  'hero.subtitle': { ar: 'آلاف الوظائف في بغداد، البصرة، أربيل، وجميع المحافظات بانتظارك. سجل الآن وابدأ مسيرتك المهنية.', en: 'Thousands of jobs in Baghdad, Basra, Erbil, and all governorates await you. Register now and start your career.' },
  'search.placeholder': { ar: 'ابحث عن المسمى الوظيفي أو الشركة...', en: 'Search job title or company...' },
  'filter.all_gov': { ar: 'كل المحافظات', en: 'All Governorates' },
  'filter.all_sec': { ar: 'كل القطاعات', en: 'All Sectors' },
  'filter.all_type': { ar: 'كل الأنواع', en: 'All Types' },

  // Sections
  'section.announcements': { ar: 'إعلانات هامة:', en: 'Important Announcements:' },
  'section.popular_title': { ar: 'الوظائف الأكثر رواجاً', en: 'Popular Jobs' },
  'section.popular_subtitle': { ar: 'أكثر الفرص التي يتم تصفحها والتقديم عليها حالياً في السوق العراقي', en: 'Most viewed and applied opportunities currently in the Iraqi market' },
  'section.services_title': { ar: 'خدمات', en: 'Services' },
  'section.services_subtitle': { ar: 'خدمات لخدمة وتطوير المجتمع', en: 'Services to serve and develop the community' },
  'section.agencies_title': { ar: 'شركات ومكاتب التوظيف', en: 'Recruitment Companies & Agencies' },
  'section.agencies_subtitle': { ar: 'تصفح فرص العمل لدى كبرى الشركات ومكاتب التوظيف العاملة في العراق', en: 'Browse opportunities at major companies and recruitment agencies operating in Iraq' },
  'section.articles_title': { ar: 'دليلك المهني', en: 'Career Guide' },
  'section.articles_subtitle': { ar: 'مقالات ونصائح حصرية حول المقابلات، السيرة الذاتية، والنجاح الوظيفي', en: 'Exclusive articles and tips on interviews, CVs, and career success' },
  'section.gov_title': { ar: 'تصفح حسب المحافظة', en: 'Browse by Governorate' },
  'section.gov_subtitle': { ar: 'اختر محافظتك لعرض الوظائف المتاحة فيها فوراً', en: 'Select your governorate to view available jobs immediately' },
  'section.latest_title': { ar: 'أحدث الوظائف المنشورة', en: 'Latest Jobs' },
  'section.latest_count': { ar: 'تصفح {count} وظيفة متاحة', en: 'Browse {count} available jobs' },
  'section.no_results': { ar: 'عذراً، لم نجد نتائج', en: 'Sorry, no results found' },
  'section.no_results_desc': { ar: 'لم يتم العثور على وظائف تطابق معايير البحث الحالية.', en: 'No jobs found matching your current search criteria.' },
  'action.view_all': { ar: 'عرض كل الوظائف', en: 'View All Jobs' },
  'action.load_more': { ar: 'جاري تحميل المزيد من الوظائف...', en: 'Loading more jobs...' },
  'action.read_more': { ar: 'اقرأ المزيد', en: 'Read More' },
  'action.show_more': { ar: 'عرض جميع الخدمات', en: 'Show All Services' },
  'action.show_less': { ar: 'عرض أقل', en: 'Show Less' },
  'action.clear_all': { ar: 'مسح الكل', en: 'Clear All' },

  // About Page
  'about.title': { ar: 'من نحن', en: 'Who We Are' },
  'about.mission.title': { ar: 'رسالتنا', en: 'Our Mission' },
  'about.vision.title': { ar: 'رؤيتنا', en: 'Our Vision' },
  'about.mission.text': { ar: 'نسعى لتمكين الشباب العراقي من خلال توفير منصة موثوقة تربطهم بفرص العمل الحقيقية وتزودهم بالمهارات اللازمة للنجاح.', en: 'We strive to empower Iraqi youth by providing a reliable platform that connects them with real job opportunities and equips them with the skills needed for success.' },
  'about.vision.text': { ar: 'أن نكون المرجع الأول والمنصة الأكثر موثوقية لسوق العمل الرقمي في العراق، مع المساهمة الفعالة في تقليل نسبة البطالة وتطوير الكفاءات الوطنية.', en: 'To be the primary reference and the most trusted platform for the digital job market in Iraq, actively contributing to reducing unemployment and developing national talents.' },
  'about.team.title': { ar: 'الفريق', en: 'The Team' },
  'about.team.text': { ar: 'نحن فريق من المتخصصين العراقيين في مجالات التكنولوجيا والموارد البشرية، نعمل بشغف لخلق بيئة عمل رقمية تخدم الجميع بشفافية واحترافية.', en: 'We are a team of Iraqi professionals in technology and HR, working passionately to create a digital work environment that serves everyone with transparency and professionalism.' },
  'about.values.title': { ar: 'قيمنا', en: 'Our Values' },
  'about.values.transparency': { ar: 'الشفافية في المعلومات', en: 'Transparency in Information' },
  'about.values.innovation': { ar: 'الابتكار التقني', en: 'Technical Innovation' },
  'about.values.community': { ar: 'دعم المجتمع المهني', en: 'Professional Community Support' },

  // Footer
  'footer.rights': { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' },
  'footer.desc': { ar: 'منصة لربط كفاءات العراق بسوق العمل.', en: 'Platform connecting Iraqi talents with the labor market.' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    // Update HTML direction and language attribute
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    // Update Document Title
    document.title = language === 'ar' 
        ? 'مجتمع العمل العراقي | Iraqi Work Environment' 
        : 'Iraqi Work Environment | Job Market';
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      dir: language === 'ar' ? 'rtl' : 'ltr' 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

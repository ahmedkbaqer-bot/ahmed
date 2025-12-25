
import { Job, JobType, Sector, ServiceItem, Announcement, SourceItem, Article, RecruitmentAgency } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'مطور واجهات أمامية (React)',
    titleEn: 'Frontend Developer (React)',
    company: 'شركة دجلة للحلول البرمجية',
    location: 'بغداد',
    city: 'المنصور',
    type: JobType.FULL_TIME,
    sector: Sector.TECH,
    salary: '1,500,000 - 2,500,000 د.ع',
    postedAt: 'منذ يومين',
    description: 'نبحث عن مطور واجهات أمامية موهوب للانضمام إلى فريقنا. يجب أن يكون لديك خبرة في React و Tailwind CSS.',
    descriptionEn: 'We are looking for a talented Frontend Developer to join our team. You must have experience with React and Tailwind CSS. You will be responsible for building user-friendly interfaces and ensuring high performance.',
    requirements: ['خبرة 3 سنوات', 'إجادة TypeScript', 'معرفة بـ Git'],
    requirementsEn: ['3+ years of experience', 'Proficiency in TypeScript', 'Knowledge of Git'],
    source: 'فرص العراق'
  },
  {
    id: '2',
    title: 'مهندس موقع مدني',
    titleEn: 'Civil Site Engineer',
    company: 'مجموعة الإعمار العراقية',
    location: 'البصرة',
    city: 'الزبير',
    type: JobType.FULL_TIME,
    sector: Sector.ENGINEERING,
    salary: 'قابل للتفاوض',
    postedAt: 'منذ 4 ساعات',
    description: 'مطلوب مهندس مدني للإشراف على مواقع البناء وضمان الجودة والسلامة.',
    descriptionEn: 'Civil Engineer required to supervise construction sites and ensure quality and safety standards are met. The role involves managing site operations and coordinating with subcontractors.',
    requirements: ['بكالوريوس هندسة مدنية', 'خبرة موقعية', 'تحمل ضغط العمل'],
    requirementsEn: ['Bachelor in Civil Engineering', 'Site experience', 'Ability to work under pressure'],
    source: 'LinkedIn',
    sourceUrl: 'https://linkedin.com/jobs'
  }
];

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: 'كتابة السيرة الذاتية',
    description: 'احصل على سيرة ذاتية احترافية مصممة خصيصاً لتناسب سوق العمل العراقي والشركات العالمية.',
    iconName: 'cv',
    priceType: 'paid',
    price: '25,000 د.ع'
  },
  {
    id: '2',
    title: 'دورات تدريبية وتطوير',
    description: 'ورش عمل في مهارات الحاسوب، اللغة الإنجليزية، والمهارات الإدارية لزيادة فرصك في التوظيف.',
    iconName: 'training',
    priceType: 'free'
  },
  {
    id: '3',
    title: 'استشارات مهنية',
    description: 'جلسات استشارية مع خبراء موارد بشرية لتوجيه مسارك المهني والاستعداد للمقابلات.',
    iconName: 'consulting',
    priceType: 'paid',
    price: 'حسب نوع الجلسة'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    content: 'مجلس الخدمة الاتحادي يطلق استمارة التوظيف لحملة الشهادات العليا والأوائل.',
    date: '2024-05-20',
    isImportant: true,
    link: '#'
  }
];

export const MOCK_JOB_SOURCES: SourceItem[] = [
    { id: '1', name: 'LinkedIn Iraq', url: 'https://www.linkedin.com/jobs/search/?geoId=104305537&location=Iraq' },
    { id: '2', name: 'Bayt.com Iraq', url: 'https://www.bayt.com/ar/iraq/jobs/' }
];

export const MOCK_NEWS_SOURCES: SourceItem[] = [
    { id: '1', name: 'وكالة الأنباء العراقية', url: 'https://ina.iq/' }
];

export const MOCK_RECRUITMENT_AGENCIES: RecruitmentAgency[] = [
  { id: '1', name: 'MSelect', websiteUrl: 'https://www.mselect.com/' },
  { id: '2', name: 'Miswag', websiteUrl: 'https://miswag.net/careers' }
];

export const MOCK_ARTICLES: Article[] = [
    {
        id: '1',
        title: 'كيف تجتاز مقابلة العمل بنجاح؟',
        category: 'المقابلات الشخصية',
        date: '2024-05-15',
        author: 'فريق التوظيف',
        excerpt: 'أهم الأسئلة الشائعة في مقابلات العمل وكيفية الإجابة عليها باحترافية لضمان قبولك.',
        content: `تعتبر مقابلة العمل الخطوة الأهم في رحلة البحث عن وظيفة...`
    }
];

export const ARTICLE_CATEGORIES = [
    'المقابلات الشخصية',
    'السيرة الذاتية',
    'التحفيز المهني',
    'تطوير المهارات',
    'سوق العمل',
    'عام'
];

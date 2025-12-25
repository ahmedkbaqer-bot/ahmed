
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Job, ServiceItem, Announcement, SourceItem, Article, RecruitmentAgency, User, UserRole, UserStatus, SiteSettings } from '../types';
import { db, isFirebaseConfigured } from '../firebase';
import { 
  collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, 
  query, orderBy, setDoc, getDoc
} from 'firebase/firestore';
import { 
  MOCK_JOBS, MOCK_SERVICES, MOCK_ANNOUNCEMENTS, 
  MOCK_RECRUITMENT_AGENCIES, MOCK_ARTICLES,
  MOCK_JOB_SOURCES, MOCK_NEWS_SOURCES
} from '../constants';

interface JobContextType {
  jobs: Job[];
  services: ServiceItem[];
  announcements: Announcement[];
  recruitmentAgencies: RecruitmentAgency[];
  articles: Article[];
  jobSources: SourceItem[];
  newsSources: SourceItem[];
  siteUsers: User[];
  siteSettings: SiteSettings;
  
  addJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  addService: (service: ServiceItem) => void;
  deleteService: (id: string) => void;
  addAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementImportance: (id: string) => void;
  addRecruitmentAgency: (agency: RecruitmentAgency) => void;
  deleteRecruitmentAgency: (id: string) => void;
  addArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  addJobSource: (source: SourceItem) => void;
  deleteJobSource: (id: string) => void;
  addNewsSource: (source: SourceItem) => void;
  deleteNewsSource: (id: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  deleteUser: (userId: string) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
}

const DEFAULT_SETTINGS: SiteSettings = {
  aboutDescription: 'مجتمع العمل العراقي هو منصة رقمية رائدة تهدف إلى سد الفجوة بين الكفاءات العراقية وسوق العمل المتطور، من خلال توفير أدوات ذكية وبيئة آمنة للنمو المهني.',
  mission: 'نسعى لتمكين الشباب العراقي من خلال توفير منصة موثوقة تربطهم بفرص العمل الحقيقية وتزودهم بالمهارات اللازمة للنجاح.',
  vision: 'أن نكون المرجع الأول والمنصة الأكثر موثوقية لسوق العمل الرقمي في العراق، مع المساهمة الفعالة في تقليل نسبة البطالة وتطوير الكفاءات الوطنية.',
  teamDescription: 'نحن فريق من المتخصصين العراقيين في مجالات التكنولوجيا والموارد البشرية، نعمل بشغف لخلق بيئة عمل رقمية تخدم الجميع بشفافية واحترافية.',
  contactEmail: 'info@iraqjobs.iq',
  facebookUrl: 'https://facebook.com/iraqjobs',
  linkedInUrl: 'https://linkedin.com/company/iraqjobs',
  instagramUrl: 'https://instagram.com/iraqjobs',
  whatsappNumber: '+9647700000000'
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [services, setServices] = useState<ServiceItem[]>(MOCK_SERVICES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [recruitmentAgencies, setRecruitmentAgencies] = useState<RecruitmentAgency[]>(MOCK_RECRUITMENT_AGENCIES);
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [jobSources, setJobSources] = useState<SourceItem[]>(MOCK_JOB_SOURCES);
  const [newsSources, setNewsSources] = useState<SourceItem[]>(MOCK_NEWS_SOURCES);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [siteUsers, setSiteUsers] = useState<User[]>([
    { id: 'u1', name: 'أحمد علي', email: 'ahmed@test.com', role: UserRole.SEEKER, status: UserStatus.ACTIVE, governorate: 'بغداد' },
    { id: 'u2', name: 'سارة محمد', email: 'sara@test.com', role: UserRole.RECRUITER, status: UserStatus.PENDING, companyName: 'تقنيات الرافدين' },
    { id: 'admin', name: 'مدير النظام', email: 'admin@iraqjobs.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE }
  ]);

  useEffect(() => {
    // Load from LocalStorage if Firebase is not ready
    const saved = localStorage.getItem('site_settings');
    if (saved) setSiteSettings(JSON.parse(saved));

    if (!isFirebaseConfigured) return;

    const unsubJobs = onSnapshot(query(collection(db, "jobs"), orderBy("postedAt", "desc")), (s) => {
      const data = s.docs.map(d => ({ id: d.id, ...d.data() } as Job));
      if (data.length > 0) setJobs(data);
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (s) => {
      const data = s.docs.map(d => ({ id: d.id, ...d.data() } as User));
      if (data.length > 0) setSiteUsers(data);
    });

    const unsubSettings = onSnapshot(doc(db, "config", "site"), (s) => {
      if (s.exists()) setSiteSettings(s.data() as SiteSettings);
    });

    return () => { unsubJobs(); unsubUsers(); unsubSettings(); };
  }, []);

  const updateSiteSettings = async (settings: SiteSettings) => {
    setSiteSettings(settings);
    localStorage.setItem('site_settings', JSON.stringify(settings));
    if (isFirebaseConfigured) {
        await setDoc(doc(db, "config", "site"), settings);
    }
  };

  const addJob = async (job: Job) => {
    if (!isFirebaseConfigured) return setJobs([job, ...jobs]);
    await addDoc(collection(db, "jobs"), job);
  };

  const deleteJob = async (id: string) => {
    if (!isFirebaseConfigured) return setJobs(jobs.filter(j => j.id !== id));
    await deleteDoc(doc(db, "jobs", id));
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    if (!isFirebaseConfigured) return setJobs(jobs.map(j => j.id === id ? {...j, ...updates} : j));
    await updateDoc(doc(db, "jobs", id), updates);
  };

  const addService = async (service: ServiceItem) => {
    if (!isFirebaseConfigured) return setServices([service, ...services]);
    await addDoc(collection(db, "services"), service);
  };

  const deleteService = async (id: string) => {
    if (!isFirebaseConfigured) return setServices(services.filter(s => s.id !== id));
    await deleteDoc(doc(db, "services", id));
  };

  const addAnnouncement = async (a: Announcement) => {
    if (!isFirebaseConfigured) return setAnnouncements([a, ...announcements]);
    await addDoc(collection(db, "announcements"), a);
  };

  const deleteAnnouncement = async (id: string) => {
    if (!isFirebaseConfigured) return setAnnouncements(announcements.filter(a => a.id !== id));
    await deleteDoc(doc(db, "announcements", id));
  };

  const toggleAnnouncementImportance = async (id: string) => {
    const a = announcements.find(item => item.id === id);
    if (!a) return;
    if (!isFirebaseConfigured) return setAnnouncements(announcements.map(item => item.id === id ? {...item, isImportant: !item.isImportant} : item));
    await updateDoc(doc(db, "announcements", id), { isImportant: !a.isImportant });
  };

  const addRecruitmentAgency = async (agency: RecruitmentAgency) => {
    if (!isFirebaseConfigured) return setRecruitmentAgencies([agency, ...recruitmentAgencies]);
    await addDoc(collection(db, "agencies"), agency);
  };

  const deleteRecruitmentAgency = async (id: string) => {
    if (!isFirebaseConfigured) return setRecruitmentAgencies(recruitmentAgencies.filter(a => a.id !== id));
    await deleteDoc(doc(db, "agencies", id));
  };

  const addArticle = async (article: Article) => {
    if (!isFirebaseConfigured) return setArticles([article, ...articles]);
    await addDoc(collection(db, "articles"), article);
  };

  const deleteArticle = async (id: string) => {
    if (!isFirebaseConfigured) return setArticles(articles.filter(a => a.id !== id));
    await deleteDoc(doc(db, "articles", id));
  };

  const addJobSource = async (source: SourceItem) => {
    if (!isFirebaseConfigured) return setJobSources([source, ...jobSources]);
    await addDoc(collection(db, "jobSources"), source);
  };

  const deleteJobSource = async (id: string) => {
    if (!isFirebaseConfigured) return setJobSources(jobSources.filter(s => s.id !== id));
    await deleteDoc(doc(db, "jobSources", id));
  };

  const addNewsSource = async (source: SourceItem) => {
    if (!isFirebaseConfigured) return setNewsSources([source, ...newsSources]);
    await addDoc(collection(db, "newsSources"), source);
  };

  const deleteNewsSource = async (id: string) => {
    if (!isFirebaseConfigured) return setNewsSources(newsSources.filter(s => s.id !== id));
    await deleteDoc(doc(db, "newsSources", id));
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (!isFirebaseConfigured) return setSiteUsers(siteUsers.map(u => u.id === userId ? {...u, role: newRole} : u));
    await updateDoc(doc(db, "users", userId), { role: newRole });
  };

  const updateUserStatus = async (userId: string, status: UserStatus) => {
    if (!isFirebaseConfigured) return setSiteUsers(siteUsers.map(u => u.id === userId ? {...u, status: status} : u));
    await updateDoc(doc(db, "users", userId), { status: status });
  };

  const deleteUser = async (userId: string) => {
    if (!isFirebaseConfigured) return setSiteUsers(siteUsers.filter(u => u.id !== userId));
    await deleteDoc(doc(db, "users", userId));
  };

  return (
    <JobContext.Provider value={{
      jobs, services, announcements, recruitmentAgencies, articles, jobSources, newsSources, siteUsers, siteSettings,
      addJob, deleteJob, updateJob,
      addService, deleteService,
      addAnnouncement, deleteAnnouncement, toggleAnnouncementImportance,
      addRecruitmentAgency, deleteRecruitmentAgency,
      addArticle, deleteArticle,
      addJobSource, deleteJobSource,
      addNewsSource, deleteNewsSource,
      updateUserRole, updateUserStatus, deleteUser, updateSiteSettings
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error('useJobs must be used within JobProvider');
  return context;
};

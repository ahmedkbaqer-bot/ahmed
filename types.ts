
export interface Job {
  id: string;
  title: string;
  titleEn?: string;
  company: string;
  location: string;
  city: string;
  type: JobType;
  sector: Sector;
  salary: string;
  postedAt: string;
  description: string;
  descriptionEn?: string;
  requirements: string[];
  requirementsEn?: string[];
  views?: number;
  source?: string;
  sourceUrl?: string;
  isUrgent?: boolean;
}

export enum ItemStatus {
  PENDING = 'قيد المراجعة',
  APPROVED = 'مقبول',
  REJECTED = 'مرفوض',
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'cv' | 'training' | 'consulting';
  priceType: 'free' | 'paid';
  price?: string;
  priceUnit?: string;
  userId?: string;
  status?: ItemStatus;
}

export interface Announcement {
  id: string;
  content: string;
  date: string;
  isImportant: boolean;
  link?: string;
}

export interface SourceItem {
  id: string;
  name: string;
  url: string;
}

export interface RecruitmentAgency {
  id: string;
  name: string;
  websiteUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  userId?: string;
  status?: ItemStatus;
  source?: string;
  sourceUrl?: string;
}

export interface SiteSettings {
  aboutDescription: string;
  mission: string;
  vision: string;
  teamDescription: string;
  contactEmail: string;
  facebookUrl: string;
  linkedInUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
}

export enum UserRole {
  SEEKER = 'باحث عن عمل',
  RECRUITER = 'صاحب عمل',
  ADMIN = 'مدير النظام',
  SERVICE_PROVIDER = 'ناشر خدمة',
  CONTENT_CREATOR = 'كاتب',
}

export enum UserStatus {
  ACTIVE = 'نشط',
  SUSPENDED = 'موقوف مؤقتاً',
  PENDING = 'قيد المراجعة',
}

// New Interfaces for Profile
export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  year: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  governorate?: string;
  canProvideServices?: boolean;
  canWriteArticles?: boolean;
  interestedSector?: Sector;
  companyName?: string;
  createdAt?: string;
  // Profile / CV Fields
  bio?: string;
  phone?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  website?: string;
  profileImage?: string;
  cvUrl?: string;
  cvName?: string;
}

export enum JobType {
  FULL_TIME = 'دوام كامل',
  PART_TIME = 'دوام جزئي',
  REMOTE = 'عمل عن بعد',
  CONTRACT = 'عقد',
  INTERNSHIP = 'تدريب',
}

export enum Sector {
  TECH = 'تكنولوجيا المعلومات',
  ENGINEERING = 'الهندسة والبناء',
  OIL_GAS = 'النفط والغاز',
  HEALTH = 'الرعاية الصحية',
  EDUCATION = 'التعليم',
  SALES = 'المبيعات والتسويق',
  ADMIN = 'الإدارة والسكرتارية',
  FINANCE = 'المحاسبة والمالية',
  SERVICE = 'الخدمات والضيافة',
  OTHER = 'أخرى',
}

export const GOVERNORATES = [
  "بغداد", "البصرة", "نينوى", "أربيل", "السليمانية", "دهوك", "كركوك", 
  "الأنبار", "ديالى", "كربلاء", "النجف", "واسط", "بابل", 
  "ميسان", "القادسية", "ذي قار", "المثنى", "صلاح الدين"
];

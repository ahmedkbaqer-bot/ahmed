
import React from 'react';
import { 
  MapPin, Building2, Clock, Banknote, Globe, Briefcase, Laptop, FileText, GraduationCap,
  Code, HardHat, Flame, Stethoscope, Megaphone, ClipboardList, Coffee, Layers, Calendar,
  User as UserIcon, Link as LinkIcon, ExternalLink
} from 'lucide-react';
import { Job, JobType, Sector } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface JobCardProps {
  job: Job;
  onClick: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  const { language } = useLanguage();

  const getJobTypeIcon = (type: JobType) => {
    switch (type) {
      case JobType.FULL_TIME: return <Briefcase className="w-5 h-5 text-primary-400 shrink-0" />;
      case JobType.PART_TIME: return <Clock className="w-5 h-5 text-orange-400 shrink-0" />;
      case JobType.REMOTE: return <Laptop className="w-5 h-5 text-purple-400 shrink-0" />;
      case JobType.CONTRACT: return <FileText className="w-5 h-5 text-blue-400 shrink-0" />;
      case JobType.INTERNSHIP: return <GraduationCap className="w-5 h-5 text-green-400 shrink-0" />;
      default: return <Briefcase className="w-5 h-5 text-gray-400 shrink-0" />;
    }
  };

  const getSectorStyles = (sector: Sector) => {
    switch (sector) {
      case Sector.TECH: 
        return { icon: <Code className="w-4 h-4" />, classes: "bg-blue-950/50 text-blue-200 border-blue-800/50 hover:bg-blue-900/50" };
      case Sector.ENGINEERING: 
        return { icon: <HardHat className="w-4 h-4" />, classes: "bg-amber-950/50 text-amber-200 border-amber-800/50 hover:bg-amber-900/50" };
      case Sector.OIL_GAS: 
        return { icon: <Flame className="w-4 h-4" />, classes: "bg-red-950/50 text-red-200 border-red-800/50 hover:bg-red-900/50" };
      case Sector.HEALTH: 
        return { icon: <Stethoscope className="w-4 h-4" />, classes: "bg-emerald-950/50 text-emerald-200 border-emerald-800/50 hover:bg-emerald-900/50" };
      case Sector.EDUCATION: 
        return { icon: <GraduationCap className="w-4 h-4" />, classes: "bg-indigo-950/50 text-indigo-200 border-indigo-800/50 hover:bg-indigo-900/50" };
      case Sector.SALES: 
        return { icon: <Megaphone className="w-4 h-4" />, classes: "bg-pink-950/50 text-pink-200 border-pink-800/50 hover:bg-pink-900/50" };
      case Sector.ADMIN: 
        return { icon: <ClipboardList className="w-4 h-4" />, classes: "bg-slate-800/50 text-slate-200 border-slate-600/50 hover:bg-slate-700/50" };
      case Sector.FINANCE: 
        return { icon: <Banknote className="w-4 h-4" />, classes: "bg-green-950/50 text-green-200 border-green-800/50 hover:bg-green-900/50" };
      case Sector.SERVICE: 
        return { icon: <Coffee className="w-4 h-4" />, classes: "bg-cyan-950/50 text-cyan-200 border-cyan-800/50 hover:bg-cyan-900/50" };
      default: 
        return { icon: <Layers className="w-4 h-4" />, classes: "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700" };
    }
  };

  const getSourceDisplay = () => {
    const sourceName = job.source || (language === 'ar' ? 'مجتمع العمل العراقي' : 'Iraqi Work Community');
    const isExternal = !!job.sourceUrl;
    
    return {
      name: sourceName,
      icon: isExternal ? <Globe className="w-3.5 h-3.5 text-blue-400" /> : <UserIcon className="w-3.5 h-3.5 text-primary-400" />,
      label: language === 'ar' ? 'تم النشر بواسطة' : 'Posted by'
    };
  };

  const displayTitle = (language === 'en' && job.titleEn) ? job.titleEn : job.title;
  const displayDesc = (language === 'en' && job.descriptionEn) ? job.descriptionEn : job.description;
  const sectorStyle = getSectorStyles(job.sector);
  const sourceInfo = getSourceDisplay();

  return (
    <div 
      onClick={() => onClick(job)}
      className="bg-gray-900 rounded-[2rem] border border-gray-800 p-6 hover:shadow-2xl hover:shadow-primary-900/20 hover:border-primary-500/30 transition-all duration-500 cursor-pointer group flex flex-col h-full relative overflow-hidden"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-700"></div>
      
      {/* Header Info */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="bg-gray-800/50 p-2.5 rounded-2xl border border-gray-700/50 group-hover:scale-110 group-hover:bg-primary-600/20 transition-all duration-500">
          {getJobTypeIcon(job.type)}
        </div>
        <div className="flex items-center gap-1.5 bg-gray-800/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-700 group-hover:border-primary-500/50 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">{job.postedAt}</span>
        </div>
      </div>

      <div className="mb-4 relative z-10">
        <h3 className={`text-xl font-black text-white group-hover:text-primary-400 transition-colors leading-snug mb-2 ${language === 'en' ? 'font-sans' : ''}`}>
          {displayTitle}
        </h3>
        <div className="flex items-center gap-2 text-gray-400">
          <Building2 className="w-4 h-4 text-gray-500" />
          <span className="font-bold text-sm truncate">{job.company}</span>
        </div>
      </div>

      <p className={`text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed flex-grow ${language === 'en' ? 'font-sans' : ''}`}>
        {displayDesc}
      </p>

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-2 text-gray-400 bg-gray-800/30 p-2 rounded-xl border border-gray-700/30">
          <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
          <span className="text-xs font-bold truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 bg-gray-800/30 p-2 rounded-xl border border-gray-700/30">
          <Banknote className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-bold truncate">{job.salary}</span>
        </div>
      </div>

      {/* Transparency / Source Section - Enhanced */}
      <div className="mb-6 bg-gray-800/40 rounded-2xl border border-gray-700/50 overflow-hidden group/source">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="bg-gray-700 p-2 rounded-xl group-hover/source:bg-primary-600/20 transition-colors">
              {sourceInfo.icon}
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-tighter mb-0.5">{sourceInfo.label}</p>
              <p className="text-xs font-black text-gray-200 truncate max-w-[120px]">{sourceInfo.name}</p>
            </div>
          </div>
          {job.sourceUrl && (
            <div className="text-blue-400 group-hover/source:translate-x-[-2px] transition-transform">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800/50 mt-auto relative z-10">
         <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 font-black text-xs ${sectorStyle.classes} hover:scale-105`}>
            {sectorStyle.icon}
            {job.sector}
         </div>
         <div className="w-8 h-8 rounded-full bg-primary-600/10 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
            <LinkIcon className="w-4 h-4 text-primary-500 group-hover:text-white" />
         </div>
      </div>
    </div>
  );
};

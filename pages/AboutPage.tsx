
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useJobs } from '../context/JobContext';
import { Target, Eye, Users, ShieldCheck, Award, Heart, Mail, Facebook, Linkedin, Instagram, Phone, ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteSettings } = useJobs();

  const values = [
    { icon: <ShieldCheck className="w-8 h-8 text-primary-600" />, title: t('about.values.transparency') },
    { icon: <Award className="w-8 h-8 text-purple-600" />, title: t('about.values.innovation') },
    { icon: <Users className="w-8 h-8 text-teal-600" />, title: t('about.values.community') },
  ];

  const socialLinks = [
      { icon: <Facebook className="w-5 h-5" />, label: 'Facebook', url: siteSettings.facebookUrl, color: 'text-blue-600 bg-blue-50' },
      { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', url: siteSettings.linkedInUrl, color: 'text-blue-700 bg-blue-50' },
      { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', url: siteSettings.instagramUrl, color: 'text-pink-600 bg-pink-50' },
      { icon: <Mail className="w-5 h-5" />, label: 'Email', url: `mailto:${siteSettings.contactEmail}`, color: 'text-red-600 bg-red-50' },
      { icon: <Phone className="w-5 h-5" />, label: 'WhatsApp', url: `https://wa.me/${siteSettings.whatsappNumber.replace('+', '')}`, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className={`text-4xl md:text-5xl font-black text-gray-900 mb-6 ${language === 'en' ? 'font-sans' : ''}`}>
            {t('about.title')}
          </h1>
          <div className="w-24 h-1.5 bg-primary-600 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {siteSettings.aboutDescription}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="bg-primary-50 p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-10 h-10 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.mission.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {siteSettings.mission}
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="bg-purple-50 p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Eye className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('about.vision.title')}</h2>
            <p className="text-gray-600 leading-relaxed">
              {siteSettings.vision}
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-900 text-white rounded-[3rem] p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-10 text-center">{t('about.values.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="bg-white/10 p-4 rounded-full mb-4 backdrop-blur-sm border border-white/5">
                    {val.icon}
                  </div>
                  <h3 className="font-bold text-lg">{val.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <div className="bg-teal-50 p-3 rounded-2xl w-fit mx-auto mb-6">
            <Heart className="w-10 h-10 text-teal-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-6">{t('about.team.title')}</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mb-10">
            {siteSettings.teamDescription}
          </p>
        </div>

        {/* Social Media & Contact Section */}
        <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-8">تواصل معنا</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-sm ${link.color}`}
                    >
                        {link.icon}
                        <span className="text-sm">{link.label}</span>
                        <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                ))}
            </div>
            
            <div className="mt-12 flex flex-col items-center gap-2">
                <p className="text-gray-400 text-sm">للاستفسارات الرسمية يرجى مراسلتنا عبر البريد</p>
                <a href={`mailto:${siteSettings.contactEmail}`} className="text-primary-600 font-bold hover:underline">{siteSettings.contactEmail}</a>
            </div>
        </div>
      </div>
    </div>
  );
};

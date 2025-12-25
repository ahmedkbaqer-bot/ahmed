
import React from 'react';
import { X, FileText, GraduationCap, Users, Briefcase, CheckCircle2, CreditCard, Gift, User as UserIcon } from 'lucide-react';
import { ServiceItem } from '../types';
import { useJobs } from '../context/JobContext';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
  const { siteUsers } = useJobs();
  if (!service) return null;

  const publisher = siteUsers.find(u => u.id === service.userId);

  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
        case 'cv': return <FileText className="w-12 h-12 text-blue-600" />;
        case 'training': return <GraduationCap className="w-12 h-12 text-purple-600" />;
        case 'consulting': return <Users className="w-12 h-12 text-green-600" />;
        default: return <Briefcase className="w-12 h-12 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute left-4 top-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-10 text-center bg-gray-50 border-b border-gray-100">
             <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 w-fit mx-auto mb-6 relative">
                {renderServiceIcon(service.iconName)}
                
                <div className={`absolute -bottom-2 -right-2 p-2 rounded-full border-4 border-white shadow-md ${service.priceType === 'free' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                    {service.priceType === 'free' ? <Gift className="w-4 h-4 text-white" /> : <CreditCard className="w-4 h-4 text-white" />}
                </div>
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-2">{service.title}</h2>
             
             <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${service.priceType === 'free' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {service.priceType === 'free' ? 'خدمة مجانية' : `${service.price} د.ع ${service.priceUnit ? `لكل ${service.priceUnit}` : ''}`}
             </div>

             <div className="mt-6 flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    <UserIcon className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-500 font-bold">مقدم الخدمة: {publisher?.name || 'المنصة الرسمية'}</p>
             </div>
        </div>

        <div className="p-10">
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary-600" />
                ماذا تشمل هذه الخدمة؟
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
                {service.description}
            </p>
            
            <div className="mt-10 flex flex-col gap-3">
                <button 
                    onClick={() => alert('تم توجيه طلبك لمقدم الخدمة، سيتم التواصل معك عبر البريد المسجل.')}
                    className="w-full py-4 rounded-2xl font-black bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/30 text-lg"
                >
                    {service.priceType === 'free' ? 'احصل على الخدمة الآن' : 'طلب الخدمة والتواصل'}
                </button>
                <button 
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl text-gray-500 font-black hover:bg-gray-50 transition-colors"
                >
                    العودة للخلف
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

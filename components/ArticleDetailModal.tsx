
import React from 'react';
import { X, Calendar, User, BookOpen, Globe, ExternalLink, ShieldCheck } from 'lucide-react';
import { Article } from '../types';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute left-4 top-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="bg-primary-50 p-10 border-b border-primary-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
             
             <div className="flex items-center gap-2 mb-6 relative z-10">
                 <span className="bg-white text-primary-700 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary-100 shadow-sm">
                     {article.category}
                 </span>
             </div>
             <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-8 relative z-10">{article.title}</h2>
             
             <div className="flex flex-wrap items-center gap-y-3 gap-x-8 text-sm text-gray-600 relative z-10">
                 <div className="flex items-center gap-2 font-bold">
                     <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                        <User className="w-4 h-4" />
                     </div>
                     <span>{article.author}</span>
                 </div>
                 <div className="flex items-center gap-2 font-medium">
                     <Calendar className="w-4 h-4 text-primary-600" />
                     <span>{article.date}</span>
                 </div>
                 {article.source && (
                    <div className="flex items-center gap-2 font-medium">
                        <Globe className="w-4 h-4 text-primary-600" />
                        <span className="italic">المصدر: {article.source}</span>
                    </div>
                 )}
             </div>
        </div>

        <div className="p-10">
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line mb-10 text-justify">
                {article.content}
            </div>
            
            {(article.sourceUrl || article.source) && (
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 group">
                    <div className="flex items-center gap-4 text-center md:text-right">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-0.5">موثوقية المحتوى</p>
                            <p className="text-sm text-gray-900 font-bold">هذا المقال مستند لمصادر {article.source || 'موثوقة'}</p>
                        </div>
                    </div>
                    {article.sourceUrl && (
                        <a 
                            href={article.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
                        >
                            <ExternalLink className="w-4 h-4" />
                            زيارة الرابط الأصلي
                        </a>
                    )}
                </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                <button 
                    onClick={onClose}
                    className="px-10 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-black transition-all"
                >
                    إغلاق المقال والعودة
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

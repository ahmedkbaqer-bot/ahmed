import React from 'react';
import { Article } from '../types';
import { FileText, ArrowUpRight, Calendar, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const { language, t } = useLanguage();

  return (
    <div 
        onClick={() => onClick(article)}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all cursor-pointer flex flex-col group h-full"
    >
        <div className="h-40 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-gray-100 flex items-center justify-center">
                <FileText className="w-12 h-12 text-primary-200" />
                </div>
                <div className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'} bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-xs font-bold text-primary-700 shadow-sm flex items-center gap-1`}>
                   <Tag className="w-3 h-3" />
                   {article.category}
                </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {article.title}
            </h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                </div>
                <span className="flex items-center gap-1 font-medium text-primary-600 group-hover:underline">
                    {t('action.read_more')} <ArrowUpRight className="w-3 h-3" />
                </span>
            </div>
        </div>
    </div>
  );
};
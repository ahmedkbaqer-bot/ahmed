
import React from 'react';

export const JobSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-900 rounded-[2rem] border border-gray-800 p-6 h-full flex flex-col animate-pulse relative overflow-hidden">
      {/* Skeleton Shimmer Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>

      {/* Header Info */}
      <div className="flex justify-between items-start mb-5">
        <div className="bg-gray-800 w-10 h-10 rounded-2xl"></div>
        <div className="bg-gray-800 h-6 w-24 rounded-full"></div>
      </div>

      {/* Title & Company */}
      <div className="mb-4 space-y-3">
        <div className="h-6 bg-gray-800 rounded-lg w-4/5"></div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-800 rounded w-1/3"></div>
        </div>
      </div>

      {/* Description lines */}
      <div className="space-y-2 mb-6 flex-grow">
        <div className="h-3.5 bg-gray-800 rounded w-full"></div>
        <div className="h-3.5 bg-gray-800 rounded w-5/6"></div>
      </div>

      {/* Meta Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="h-10 bg-gray-800 rounded-xl"></div>
        <div className="h-10 bg-gray-800 rounded-xl"></div>
      </div>

      {/* Transparency / Source Section */}
      <div className="mb-6 bg-gray-800/40 rounded-2xl h-14 border border-gray-800"></div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800 mt-auto">
         <div className="h-8 bg-gray-800 rounded-xl w-32"></div>
         <div className="w-8 h-8 rounded-full bg-gray-800"></div>
      </div>
    </div>
  );
};

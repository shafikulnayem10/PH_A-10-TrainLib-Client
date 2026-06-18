import React from "react";

export default function ClassesSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search and Filter Bar Skeleton */}
      <div className="flex flex-col md:flex-row gap-6 items-end justify-between mb-10 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm animate-pulse">
        <div className="w-full md:max-w-md flex flex-col gap-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div>
        </div>
        <div className="w-full md:w-64 flex flex-col gap-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div>
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between h-[400px] animate-pulse"
          >
            <div>
              {/* Image Area Skeleton */}
              <div className="w-full h-48 bg-slate-200 dark:bg-slate-800"></div>

              {/* Content Area Skeleton */}
              <div className="p-5 flex flex-col gap-3">
                {/* Category Badge */}
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md w-16"></div>
                {/* Class Title */}
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mt-2"></div>
                {/* Trainer Info */}
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>

            {/* Footer Metrics Area Skeleton */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-50 dark:border-slate-800/40 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div>
              </div>
              <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
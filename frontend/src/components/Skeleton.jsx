import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200 rounded-2xl p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-blue-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
      <div className="h-3 bg-gray-200 rounded w-4/6" />
    </div>
    <div className="mt-4 flex justify-end">
      <div className="h-8 bg-gray-200 rounded-full w-24" />
    </div>
  </div>
);

export const SkeletonStats = () => (
  <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-blue-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonInput = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
    <div className="h-12 bg-gray-200 rounded-xl" />
  </div>
);

export const SkeletonButton = () => (
  <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-full" />
);

export const SkeletonDetail = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-blue-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-blue-200 shadow-sm p-6">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

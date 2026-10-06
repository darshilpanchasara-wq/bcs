import React from 'react';

export const CakeCardSkeleton = () => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-confectionery-1 border border-outline-variant/40 flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-surface-container-high/60 animate-shimmer"></div>
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="w-24 h-4 rounded-full bg-surface-container-high animate-shimmer"></div>
          <div className="w-full h-5 rounded-lg bg-surface-container-high animate-shimmer"></div>
          <div className="w-3/4 h-3.5 rounded bg-surface-container-high/70 animate-shimmer"></div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/40">
          <div className="w-16 h-6 rounded-md bg-surface-container-high animate-shimmer"></div>
          <div className="w-20 h-8 rounded-full bg-surface-container-high animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export const CatalogSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <CakeCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default CakeCardSkeleton;

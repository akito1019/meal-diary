'use client';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'image' | 'circle' | 'button';
  width?: string;
  height?: string;
  className?: string;
  lines?: number; // text variant用
}

export default function SkeletonLoader({
  variant = 'text',
  width = 'w-full',
  height = 'h-4',
  className = '',
  lines = 1
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const variants = {
    text: () => (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${width} ${height} ${index > 0 ? 'mt-2' : ''}`}
          />
        ))}
      </div>
    ),
    card: () => (
      <div className={`${baseClasses} ${width} ${height || 'h-64'} ${className}`} />
    ),
    image: () => (
      <div className={`${baseClasses} ${width} ${height || 'h-48'} flex items-center justify-center ${className}`}>
        <svg
          className="w-8 h-8 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    ),
    circle: () => (
      <div className={`${baseClasses} rounded-full ${width || 'w-12'} ${height || 'h-12'} ${className}`} />
    ),
    button: () => (
      <div className={`${baseClasses} ${width || 'w-24'} ${height || 'h-10'} ${className}`} />
    )
  };

  return variants[variant]();
}

// 食事カード用のスケルトン
export function MealCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
      <div className="flex items-center space-x-3">
        <SkeletonLoader variant="circle" width="w-10" height="h-10" />
        <div className="flex-1">
          <SkeletonLoader variant="text" width="w-3/4" height="h-4" />
          <SkeletonLoader variant="text" width="w-1/2" height="h-3" className="mt-1" />
        </div>
      </div>
      <SkeletonLoader variant="image" height="h-32" />
      <div className="space-y-2">
        <SkeletonLoader variant="text" width="w-full" height="h-4" />
        <SkeletonLoader variant="text" width="w-2/3" height="h-3" />
      </div>
      <div className="flex justify-between">
        <SkeletonLoader variant="button" width="w-16" height="h-8" />
        <SkeletonLoader variant="button" width="w-20" height="h-8" />
      </div>
    </div>
  );
}

// カレンダー用のスケルトン
export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SkeletonLoader variant="text" width="w-32" height="h-6" />
        <div className="flex space-x-2">
          <SkeletonLoader variant="button" width="w-8" height="h-8" />
          <SkeletonLoader variant="button" width="w-8" height="h-8" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <SkeletonLoader
            key={index}
            variant="card"
            width="w-full"
            height="h-20"
          />
        ))}
      </div>
    </div>
  );
}

// 栄養情報用のスケルトン
export function NutritionSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="text-center space-y-2">
          <SkeletonLoader variant="text" width="w-16" height="h-8" className="mx-auto" />
          <SkeletonLoader variant="text" width="w-12" height="h-3" className="mx-auto" />
        </div>
      ))}
    </div>
  );
}
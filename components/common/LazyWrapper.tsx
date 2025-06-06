'use client';

import { ReactNode } from 'react';
import { useLazyLoading } from '@/hooks/useLazyLoading';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export default function LazyWrapper({
  children,
  fallback,
  className = '',
  threshold = 0.1,
  rootMargin = '50px'
}: LazyWrapperProps) {
  const [ref, isIntersecting] = useLazyLoading({ threshold, rootMargin });

  if (isIntersecting) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {fallback || (
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-32 w-full"></div>
        </div>
      )}
    </div>
  );
}
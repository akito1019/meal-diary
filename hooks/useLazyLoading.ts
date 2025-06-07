'use client';

import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useLazyLoading = (options: UseLazyLoadingOptions = {}) => {
  const { threshold = 0.1, rootMargin = '100px' } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [elementRef, isIntersecting] as const;
};

export const useInfiniteScroll = (
  loadMore: () => void,
  hasMore: boolean,
  loading: boolean
) => {
  const [sentinelRef, isIntersecting] = useLazyLoading({
    threshold: 0.1,
    rootMargin: '200px'
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loading, loadMore]);

  return sentinelRef;
};
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// フェードイン アニメーション
export function FadeIn({ 
  children, 
  delay = 0,
  duration = 300,
  className = ''
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ease-in-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: isVisible ? 1 : 0
      }}
    >
      {children}
    </div>
  );
}

// スライドイン アニメーション
export function SlideIn({ 
  children, 
  direction = 'bottom',
  delay = 0,
  duration = 300,
  distance = 20,
  className = ''
}: {
  children: ReactNode;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'top':
        return `translate3d(0, -${distance}px, 0)`;
      case 'bottom':
        return `translate3d(0, ${distance}px, 0)`;
      case 'left':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(${distance}px, 0, 0)`;
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  };

  return (
    <div
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transform: getTransform(),
        opacity: isVisible ? 1 : 0
      }}
    >
      {children}
    </div>
  );
}

// ステージング アニメーション（子要素を順番にアニメーション）
export function StaggeredAnimation({ 
  children, 
  staggerDelay = 100,
  className = ''
}: {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <SlideIn
          key={index}
          delay={index * staggerDelay}
          direction="bottom"
          distance={10}
        >
          {child}
        </SlideIn>
      ))}
    </div>
  );
}

// スケール アニメーション
export function ScaleIn({ 
  children, 
  delay = 0,
  duration = 200,
  className = ''
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all ease-out ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        opacity: isVisible ? 1 : 0
      }}
    >
      {children}
    </div>
  );
}
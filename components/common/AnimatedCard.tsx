'use client';

import { ReactNode, useState } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'none';
  clickEffect?: 'scale' | 'none';
  onClick?: () => void;
  disabled?: boolean;
}

export default function AnimatedCard({
  children,
  className = '',
  hoverEffect = 'lift',
  clickEffect = 'none',
  onClick,
  disabled = false
}: AnimatedCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const getHoverClasses = () => {
    if (disabled) return '';
    
    switch (hoverEffect) {
      case 'lift':
        return 'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]';
      case 'scale':
        return 'hover:scale-105';
      case 'glow':
        return 'hover:shadow-xl hover:ring-2 hover:ring-blue-500/20';
      default:
        return '';
    }
  };

  const getClickClasses = () => {
    if (disabled || clickEffect === 'none') return '';
    
    switch (clickEffect) {
      case 'scale':
        return isPressed ? 'scale-95' : '';
      default:
        return '';
    }
  };

  const baseClasses = `
    transition-all duration-200 ease-in-out
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${getHoverClasses()}
    ${getClickClasses()}
  `;

  return (
    <div
      className={`${baseClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}

// 食事カード専用のアニメーション
export function MealCard({
  children,
  className = '',
  onClick,
  isLoading = false
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
}) {
  return (
    <AnimatedCard
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${isLoading ? 'animate-pulse' : ''}
        ${className}
      `}
      hoverEffect="lift"
      clickEffect="scale"
      onClick={onClick}
      disabled={isLoading}
    >
      {children}
    </AnimatedCard>
  );
}

// ボタンのマイクロインタラクション
export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = ''
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800';
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100';
      case 'ghost':
        return 'text-gray-600 hover:bg-gray-100 active:bg-gray-200';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-150 ease-in-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

// フローティングアクションボタン
export function FloatingActionButton({
  children,
  onClick,
  className = '',
  position = 'bottom-right'
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <button
      className={`
        fixed ${getPositionClasses()} z-50
        w-14 h-14 bg-blue-600 text-white
        rounded-full shadow-lg
        flex items-center justify-center
        transition-all duration-200 ease-in-out
        hover:bg-blue-700 hover:scale-110 hover:shadow-xl
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-blue-500/30
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// 入力フィールドのフォーカスアニメーション
export function AnimatedInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = ''
}: {
  label?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label
          className={`
            absolute left-3 transition-all duration-200 ease-in-out pointer-events-none
            ${isFocused || hasValue
              ? 'top-1 text-xs text-blue-600 bg-white px-1'
              : 'top-3 text-gray-500'
            }
          `}
        >
          {label}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? placeholder : ''}
        className={`
          w-full px-3 py-3 border rounded-lg
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          ${error 
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
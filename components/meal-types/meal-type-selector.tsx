'use client';

import { useState } from 'react';
import { Database } from '@/types/database';

type MealType = Database['public']['Tables']['meal_types']['Row'];

interface MealTypeSelectorProps {
  mealTypes: MealType[];
  value?: string;
  onChange: (mealTypeId: string) => void;
  onCreateNew?: () => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function MealTypeSelector({
  mealTypes,
  value,
  onChange,
  onCreateNew,
  placeholder = '食事タイプを選択',
  className = '',
  error,
}: MealTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedType = mealTypes.find(type => type.id === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2 text-left border rounded-lg
          flex items-center justify-between
          ${error ? 'border-red-500' : 'border-gray-300'}
          hover:border-gray-400 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-transparent
          transition-colors
        `}
      >
        <span className={selectedType ? 'text-gray-900' : 'text-gray-500'}>
          {selectedType ? selectedType.name : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {mealTypes.map((type) => (
                <li key={type.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(type.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-2 text-left hover:bg-gray-50
                      ${value === type.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}
                    `}
                  >
                    {type.name}
                  </button>
                </li>
              ))}
              {onCreateNew && (
                <>
                  <li className="border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        onCreateNew();
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-50 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      新しいタイプを作成
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
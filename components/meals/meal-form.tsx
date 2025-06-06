'use client';

import { useState } from 'react';
import { Database } from '@/types/database';
import { MealTypeSelector } from '@/components/meal-types/meal-type-selector';
import { useMealTypes } from '@/hooks/use-meal-types';

type MealType = Database['public']['Tables']['meal_types']['Row'];

interface MealFormData {
  mealTypeId: string;
  mealName: string;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  memo: string;
  recordedAt: string;
}

interface MealFormProps {
  initialData?: Partial<MealFormData>;
  onSubmit: (data: MealFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function MealForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '保存',
  isSubmitting = false,
}: MealFormProps) {
  const { mealTypes } = useMealTypes();

  const [formData, setFormData] = useState<MealFormData>({
    mealTypeId: initialData?.mealTypeId || '',
    mealName: initialData?.mealName || '',
    calories: initialData?.calories || null,
    protein: initialData?.protein || null,
    fat: initialData?.fat || null,
    carbs: initialData?.carbs || null,
    memo: initialData?.memo || '',
    recordedAt: initialData?.recordedAt || new Date().toISOString().slice(0, 16),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof MealFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.mealTypeId) {
      newErrors.mealTypeId = '食事タイプを選択してください';
    }

    if (!formData.mealName.trim()) {
      newErrors.mealName = '食事名を入力してください';
    }

    if (formData.calories !== null && formData.calories < 0) {
      newErrors.calories = 'カロリーは0以上で入力してください';
    }

    if (formData.protein !== null && formData.protein < 0) {
      newErrors.protein = 'たんぱく質は0以上で入力してください';
    }

    if (formData.fat !== null && formData.fat < 0) {
      newErrors.fat = '脂質は0以上で入力してください';
    }

    if (formData.carbs !== null && formData.carbs < 0) {
      newErrors.carbs = '炭水化物は0以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleNumberInput = (value: string): number | null => {
    if (value === '') return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          食事タイプ <span className="text-red-500">*</span>
        </label>
        <MealTypeSelector
          mealTypes={mealTypes}
          value={formData.mealTypeId}
          onChange={(value) => handleInputChange('mealTypeId', value)}
          error={errors.mealTypeId}
          placeholder="食事タイプを選択してください"
        />
      </div>

      <div>
        <label htmlFor="mealName" className="block text-sm font-medium text-gray-700 mb-2">
          食事名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="mealName"
          value={formData.mealName}
          onChange={(e) => handleInputChange('mealName', e.target.value)}
          disabled={isSubmitting}
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.mealName ? 'border-red-500' : 'border-gray-300'}
            ${isSubmitting ? 'bg-gray-100' : 'bg-white'}
          `}
          placeholder="例：チキンサラダ、パスタ"
        />
        {errors.mealName && (
          <p className="mt-1 text-sm text-red-600">{errors.mealName}</p>
        )}
      </div>

      <div>
        <label htmlFor="recordedAt" className="block text-sm font-medium text-gray-700 mb-2">
          記録日時
        </label>
        <input
          type="datetime-local"
          id="recordedAt"
          value={formData.recordedAt}
          onChange={(e) => handleInputChange('recordedAt', e.target.value)}
          disabled={isSubmitting}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isSubmitting ? 'bg-gray-100' : 'bg-white'}
          `}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-2">
            カロリー (kcal)
          </label>
          <input
            type="number"
            id="calories"
            value={formData.calories || ''}
            onChange={(e) => handleInputChange('calories', handleNumberInput(e.target.value))}
            disabled={isSubmitting}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.calories ? 'border-red-500' : 'border-gray-300'}
              ${isSubmitting ? 'bg-gray-100' : 'bg-white'}
            `}
            placeholder="0"
            min="0"
            step="0.1"
          />
          {errors.calories && (
            <p className="mt-1 text-sm text-red-600">{errors.calories}</p>
          )}
        </div>

        <div>
          <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-2">
            たんぱく質 (g)
          </label>
          <input
            type="number"
            id="protein"
            value={formData.protein || ''}
            onChange={(e) => handleInputChange('protein', handleNumberInput(e.target.value))}
            disabled={isSubmitting}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.protein ? 'border-red-500' : 'border-gray-300'}
              ${isSubmitting ? 'bg-gray-100' : 'bg-white'}
            `}
            placeholder="0"
            min="0"
            step="0.1"
          />
          {errors.protein && (
            <p className="mt-1 text-sm text-red-600">{errors.protein}</p>
          )}
        </div>

        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-2">
            脂質 (g)
          </label>
          <input
            type="number"
            id="fat"
            value={formData.fat || ''}
            onChange={(e) => handleInputChange('fat', handleNumberInput(e.target.value))}
            disabled={isSubmitting}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.fat ? 'border-red-500' : 'border-gray-300'}
              ${isSubmitting ? 'bg-gray-100' : 'bg-white'}
            `}
            placeholder="0"
            min="0"
            step="0.1"
          />
          {errors.fat && (
            <p className="mt-1 text-sm text-red-600">{errors.fat}</p>
          )}
        </div>

        <div>
          <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-2">
            炭水化物 (g)
          </label>
          <input
            type="number"
            id="carbs"
            value={formData.carbs || ''}
            onChange={(e) => handleInputChange('carbs', handleNumberInput(e.target.value))}
            disabled={isSubmitting}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.carbs ? 'border-red-500' : 'border-gray-300'}
              ${isSubmitting ? 'bg-gray-100' : 'bg-white'}
            `}
            placeholder="0"
            min="0"
            step="0.1"
          />
          {errors.carbs && (
            <p className="mt-1 text-sm text-red-600">{errors.carbs}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
          メモ
        </label>
        <textarea
          id="memo"
          value={formData.memo}
          onChange={(e) => handleInputChange('memo', e.target.value)}
          disabled={isSubmitting}
          rows={4}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isSubmitting ? 'bg-gray-100' : 'bg-white'}
          `}
          placeholder="食事に関するメモがあれば記入してください"
        />
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
            }
          `}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
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
              保存中...
            </div>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
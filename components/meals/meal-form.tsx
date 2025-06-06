'use client';

import { useState, useRef } from 'react';
import { Database } from '@/types/database';
import { MealTypeSelector } from '@/components/meal-types/meal-type-selector';
import { useMealTypes } from '@/hooks/use-meal-types';
import { useMeals } from '@/hooks/use-meals';
import { CreateMealData } from '@/hooks/use-meals';
import { AIImageAnalyzer } from '@/components/ai/AIImageAnalyzer';
import { useToast } from '@/components/common/Toast';

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
  imageUrl?: string;
}

interface MealFormProps {
  initialData?: Partial<MealFormData>;
  onSubmit: (data: CreateMealData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function MealForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '保存',
  loading = false,
}: MealFormProps) {
  const { mealTypes } = useMealTypes();
  const { uploadImage } = useMeals();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<MealFormData>({
    mealTypeId: initialData?.mealTypeId || '',
    mealName: initialData?.mealName || '',
    calories: initialData?.calories || null,
    protein: initialData?.protein || null,
    fat: initialData?.fat || null,
    carbs: initialData?.carbs || null,
    memo: initialData?.memo || '',
    recordedAt: initialData?.recordedAt || new Date().toISOString().slice(0, 16),
    imageUrl: initialData?.imageUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.imageUrl || '');

  const handleInputChange = (field: keyof MealFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('画像ファイルを選択してください', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('ファイルサイズは5MB以下にしてください', 'error');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload image
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: result.url }));
      showToast('画像をアップロードしました', 'success');
    } catch (error) {
      showToast('画像のアップロードに失敗しました', 'error');
      setPreviewUrl('');
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAnalysisResult = (result: { name: string; calories?: number; protein?: number; fat?: number; carbs?: number }) => {
    setFormData(prev => ({
      ...prev,
      mealName: result.name,
      calories: result.calories || prev.calories,
      protein: result.protein || prev.protein,
      fat: result.fat || prev.fat,
      carbs: result.carbs || prev.carbs,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.imageUrl) {
      newErrors.imageUrl = '食事の写真をアップロードしてください';
    }

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
      await onSubmit({
        meal_type_id: formData.mealTypeId,
        image_url: formData.imageUrl!,
        meal_name: formData.mealName,
        calories: formData.calories,
        protein: formData.protein,
        fat: formData.fat,
        carbs: formData.carbs,
        memo: formData.memo,
        recorded_at: formData.recordedAt,
      });
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
      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          食事の写真 <span className="text-red-500">*</span>
        </label>
        
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="食事の写真"
                className="w-full h-64 object-cover rounded-lg border border-gray-300"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-white">アップロード中...</div>
                </div>
              )}
            </div>
            
            {formData.imageUrl && !uploading && (
              <AIImageAnalyzer
                imageUrl={formData.imageUrl}
                onAnalysisResult={handleAnalysisResult}
              />
            )}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
              className="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400"
            >
              写真を変更
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors"
          >
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-gray-500 text-center">
              クリックして写真をアップロード<br />
              <span className="text-sm text-gray-400">JPEG, PNG, WebP (最大5MB)</span>
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading || loading}
        />
        
        {errors.imageUrl && (
          <p className="mt-2 text-sm text-red-600">{errors.imageUrl}</p>
        )}
      </div>

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
          disabled={loading}
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.mealName ? 'border-red-500' : 'border-gray-300'}
            ${loading ? 'bg-gray-100' : 'bg-white'}
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
          disabled={loading}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            ${loading ? 'bg-gray-100' : 'bg-white'}
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
            disabled={loading}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.calories ? 'border-red-500' : 'border-gray-300'}
              ${loading ? 'bg-gray-100' : 'bg-white'}
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
            disabled={loading}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.protein ? 'border-red-500' : 'border-gray-300'}
              ${loading ? 'bg-gray-100' : 'bg-white'}
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
            disabled={loading}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.fat ? 'border-red-500' : 'border-gray-300'}
              ${loading ? 'bg-gray-100' : 'bg-white'}
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
            disabled={loading}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.carbs ? 'border-red-500' : 'border-gray-300'}
              ${loading ? 'bg-gray-100' : 'bg-white'}
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
          disabled={loading}
          rows={4}
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            ${loading ? 'bg-gray-100' : 'bg-white'}
          `}
          placeholder="食事に関するメモがあれば記入してください"
        />
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`
            px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            ${loading 
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
'use client';

import { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { MealAnalysisResult } from '@/types/ai';
import MealAnalysisResultComponent from './MealAnalysisResult';

interface AIImageAnalyzerProps {
  imageUrl: string;
  onAnalysisComplete: (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
  onManualEdit: () => void;
}

export default function AIImageAnalyzer({
  imageUrl,
  onAnalysisComplete,
  onManualEdit
}: AIImageAnalyzerProps) {
  const { analyzing, error, analyzeImage } = useAI();
  const [result, setResult] = useState<MealAnalysisResult | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    const response = await analyzeImage({ imageUrl });
    
    if (response.success && response.data) {
      setResult(response.data);
      setHasAnalyzed(true);
    }
  };

  const handleSelectResult = (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    onAnalysisComplete(data);
  };

  if (analyzing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI画像解析中...</h3>
          <p className="text-gray-600">食事の内容を分析しています。しばらくお待ちください。</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">解析エラー</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleAnalyze}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              再試行
            </button>
            <button
              onClick={onManualEdit}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              手動入力
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <MealAnalysisResultComponent
        result={result}
        onSelect={handleSelectResult}
        onEdit={onManualEdit}
      />
    );
  }

  if (!hasAnalyzed) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI画像解析</h3>
          <p className="text-gray-600 mb-6">
            アップロードした画像をAIが分析して、自動で栄養情報を入力します。
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleAnalyze}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              AI解析を開始
            </button>
            <button
              onClick={onManualEdit}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              手動で入力
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
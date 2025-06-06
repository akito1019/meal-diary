'use client';

import { useState } from 'react';
import { MealAnalysisResult, MealAnalysisAlternative } from '@/types/ai';

interface MealAnalysisResultProps {
  result: MealAnalysisResult;
  onSelect: (data: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
  onEdit: () => void;
}

export default function MealAnalysisResultComponent({
  result,
  onSelect,
  onEdit
}: MealAnalysisResultProps) {
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);

  const handleSelectMain = () => {
    onSelect({
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat
    });
  };

  const handleSelectAlternative = (alternative: MealAnalysisAlternative) => {
    onSelect({
      name: alternative.name,
      calories: alternative.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return '高';
    if (confidence >= 0.6) return '中';
    return '低';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI認識結果
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(result.confidence)}`}>
            信頼度: {getConfidenceText(result.confidence)} ({Math.round(result.confidence * 100)}%)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-lg text-gray-900">{result.name}</h4>
              <p className="text-gray-600 text-sm mt-1">{result.description}</p>
              {result.portionSize && (
                <p className="text-gray-500 text-xs mt-1">目安量: {result.portionSize}</p>
              )}
            </div>
            <button
              onClick={handleSelectMain}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              この結果を使用
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{result.calories}</div>
              <div className="text-xs text-gray-500">kcal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{result.protein.toFixed(1)}</div>
              <div className="text-xs text-gray-500">タンパク質(g)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{result.carbs.toFixed(1)}</div>
              <div className="text-xs text-gray-500">炭水化物(g)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{result.fat.toFixed(1)}</div>
              <div className="text-xs text-gray-500">脂質(g)</div>
            </div>
          </div>

          {result.ingredients && result.ingredients.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-gray-600 mb-1">主な材料:</p>
              <div className="flex flex-wrap gap-1">
                {result.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="bg-white text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {result.alternatives && result.alternatives.length > 0 && (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">他の候補</h5>
            {result.alternatives.map((alternative, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h6 className="font-medium text-gray-900">{alternative.name}</h6>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">{alternative.calories} kcal</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getConfidenceColor(alternative.confidence)}`}>
                        {getConfidenceText(alternative.confidence)} ({Math.round(alternative.confidence * 100)}%)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectAlternative(alternative)}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    選択
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={onEdit}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          手動で入力・編集
        </button>
      </div>
    </div>
  );
}